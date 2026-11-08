import { materializeColorworkProject, type ColorworkProjectV1 } from '@kniterate-studio/project-contract';
import type { PanelPlan } from './panel';
import { gaugeRows, pieceRunRecords, pieceSteps } from './sweaterHandoff';
import { readinessStory, storyLines } from '../handoff';
import type { SweaterRunSummary } from './sweaterRun';
import { machineFileName } from '../workspace/fileNames';
import { ribName, textureMatching } from './textures';

/** A one-yarn scarf or blanket's written pattern and its download package. */

export function panelInstructions(project: ColorworkProjectV1, plan: PanelPlan, summary: SweaterRunSummary | null): string {
  const { state } = materializeColorworkProject(project);
  const yarn = state.chart.palette[0]!;
  const object = plan.object;
  const piece = plan.pieces[0]!;
  const run = summary?.pieces[0];
  const lines: string[] = [`# ${project.title}`, ''];
  if (summary) {
    lines.push(...storyLines(readinessStory({ findings: summary.findings, readiness: summary.readiness, verdict: summary.verdict, exportReady: summary.exportReady })));
    lines.push('', `Software check: ${summary.verdict.label}. Yarn and size are proven only by knitting.`, '');
  }
  lines.push(
    `## The ${piece.name.toLowerCase()}`,
    `${object.body.name}${textureMatching(object.body.texture) ? '' : ` (your stitch: ${object.body.texture.join(' / ')})`}, ${object.widthCm} × ${object.lengthCm} cm${object.ends.cm > 0 ? `, with ${object.ends.cm} cm of ${ribName(object.ends.rib)} rib at each end` : ''}.`,
    plan.knitted ? `Knitted: ${plan.knitted.stitches} stitches × ${plan.knitted.rows} rows, ${plan.knitted.widthCm} × ${plan.knitted.lengthCm} cm.` : '',
    `Yarn: ${yarn.name} (${yarn.hex}), about ${plan.yarn.metres.toLocaleString('en')} m. Gauge ${plan.gauge.stitchesPer10cm} st / ${plan.gauge.rowsPer10cm} rows per 10 cm (${plan.gauge.source}).`,
    '',
    '## At the machine',
    ...(summary ? summary.readiness.operatorChecks : [`Yarn on C${plan.carriers.main}, waste yarn on C${plan.carriers.waste}${plan.carriers.draw ? `, draw thread on C${plan.carriers.draw}` : ', no draw thread'}.`]).map((check) => `- ${check}`),
    '',
    '## Knitting',
    `File: \`${machineFileName(piece.name)}\`${run?.passCount ? ` · ${run.passCount.toLocaleString()} passes` : ''}${run ? ` · ${run.verdict.label}` : ''}`,
    '',
    ...pieceSteps(piece, plan).map((step) => `- ${step}`),
    '',
    '## Finishing',
    plan.carriers.draw ? `- Pull the draw thread (C${plan.carriers.draw}) to free the piece from the waste yarn.` : '- Unravel or cut away the waste yarn below the cast-on.',
    '- Weave in the ends.',
  );
  return `${lines.filter((line, index, all) => line !== '' || all[index - 1] !== '').join('\n')}\n`;
}

/** The form returned with a knitted scarf or blanket: its exact file, its size beside the plan's, and the run record. */
export function panelMeasurementForm(project: ColorworkProjectV1, plan: PanelPlan, summary: SweaterRunSummary): string {
  const { state } = materializeColorworkProject(project);
  const piece = summary.pieces[0]!;
  const file = machineFileName(piece.name);
  const predicted = (value: number | undefined) => (value === undefined ? '—' : `${value} cm`);
  return `${[
    `# Measurement form: ${project.title}`,
    '',
    `Candidate: \`${file}\`, KCode SHA-256 \`${piece.kcHash ?? 'not exported'}\`. Measure only the ${piece.name.toLowerCase()} knitted from this exact file.`,
    '',
    'Wash or steam it as the yarn label says, let it dry flat and rest 24 h. Then lay it flat without stretching and measure it with a rigid rule.',
    '',
    '| Measure | How | Predicted | Measured |',
    '|---|---|---|---|',
    ...gaugeRows(plan, plan.object.ends.cm > 0),
    `| Width | straight across the middle | ${predicted(plan.knitted?.widthCm)} | ___ cm |`,
    `| Length | from end to end, along the middle | ${predicted(plan.knitted?.lengthCm)} | ___ cm |`,
    '',
    'Also: the outcome (clean / issues / failed), every machine stop and what was done, and photographs of both faces and any defect with a ruler in frame.',
    ...pieceRunRecords(plan, summary, state.chart.palette[0]!, () => file),
  ].join('\n')}\n`;
}

export async function panelPackageFiles(input: {
  project: ColorworkProjectV1;
  serializedProject: string;
  plan: PanelPlan;
  summary: SweaterRunSummary;
  sha256: (bytes: Uint8Array) => Promise<string>;
}): Promise<Record<string, Uint8Array>> {
  const { project, plan, summary } = input;
  const piece = summary.pieces[0];
  if (!summary.exportReady || !piece?.kcText) throw new Error('The panel needs a validated program before the package can be written.');
  const encode = (text: string) => new TextEncoder().encode(text);
  const files: Record<string, Uint8Array> = {
    'project.json': encode(input.serializedProject),
    'instructions.md': encode(panelInstructions(project, plan, summary)),
    'panel.kc': encode(piece.kcText),
  };
  if (piece.knitoutText) files['panel.k'] = encode(piece.knitoutText);
  const manifest = {
    kind: 'kniterate-studio-panel-package',
    version: 1,
    project: project.id,
    verdict: summary.verdict.label,
    ready: summary.readiness.ready,
    pieces: [{ id: piece.id, name: piece.name, copies: 1, file: 'panel.kc', passes: piece.passCount, kcodeSha256: piece.kcHash, verdict: piece.verdict.label }],
    files: Object.fromEntries(await Promise.all(Object.entries(files).map(async ([name, bytes]) => [name, await input.sha256(bytes)] as const))),
    /** Filled in and returned by the knitter; not hashed. */
    forms: ['measurement-form.md'],
  };
  files['measurement-form.md'] = encode(panelMeasurementForm(project, plan, summary));
  files['manifest.json'] = encode(`${JSON.stringify(manifest, null, 2)}\n`);
  return files;
}
