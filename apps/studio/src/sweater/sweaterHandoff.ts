import { materializeColorworkProject, type ColorworkProjectV1 } from '@kniterate-studio/project-contract';
import type { PanelPlan } from './rasterize';
import { edgeRhythm, pairedRhythm, type RhythmStep } from './rhythm';
import type { PiecesPlan, SweaterPiecePlan, SweaterPlan } from './sweater';
import { readinessStory, runRecordMarkdown, storyLines } from '../handoff';
import type { KnitFileCarriers } from './knitFile';
import { MEASUREMENT_FIELDS } from './measurementFields';
import type { SweaterRunSummary } from './sweaterRun';
import { sweaterSchematicSvg } from './schematic';
import { ribName, textureMatching } from './textures';

/**
 * The sweater's written pattern and its download package. The machine knits
 * every piece; the pattern says what each program does, in rows and
 * stitches, so the knitter can follow and check it, and how to assemble it.
 */

const SILHOUETTE_NAMES = { 'drop-shoulder': 'drop-shoulder', 'j-sleeve': 'J-sleeve', 'set-in': 'set-in sleeve' } as const;

const width = (raster: PanelPlan, row: number) => raster.rows[row]!.segments.reduce((sum, segment) => sum + segment.hi - segment.lo + 1, 0);

/** The shaping of one piece, as pattern lines. */
export function pieceSteps(piece: SweaterPiecePlan, plan: PiecesPlan): string[] {
  const raster = piece.raster;
  if (raster === null) return [`Not planned: ${piece.error ?? 'no rows'}.`];
  const object = plan.object;
  // A sweater's trims, or a one-yarn panel's rib ends.
  const rib = 'trims' in object
    ? (piece.id === 'sleeve' ? (object as SweaterPlan['object']).trims.cuff.rib : piece.id === 'neckband' ? (object as SweaterPlan['object']).trims.neck.rib : (object as SweaterPlan['object']).trims.hem.rib)
    : 'ends' in object ? (object as { ends: { rib: string } }).ends.rib : 'kkpp';
  const steps: string[] = [];
  const bottom = raster.realized.ribRows.bottom;
  steps.push(`Cast on ${raster.realized.castOnStitches} stitches over waste yarn${plan.carriers.draw ? ' and the draw thread' : ''}.`);
  if (piece.id === 'neckband') {
    steps.push(`Rows 1–${raster.rows.length}: ${ribName(rib)} rib.`);
  } else {
    if (bottom > 0) steps.push(`Rows 1–${bottom}: ${ribName(rib)} rib (${piece.id === 'sleeve' ? 'cuff' : piece.id === 'panel' ? 'end' : 'hem'}).`);
    steps.push(`From row ${bottom + 1}: ${object.body.name.toLowerCase()}.`);
    const top = raster.realized.ribRows.top;
    if (top > 0) steps.push(`Rows ${raster.rows.length - top + 1}–${raster.rows.length}: ${ribName(rib)} rib (${piece.id === 'panel' ? 'end' : 'neck edge'}).`);
  }
  // Shaping in the machine knitter's rhythm, naming the edge where the two
  // sides differ, with the stitch count once every step up to that row is told.
  const split = raster.events.find((event) => event.kind === 'neck-split');
  const before = raster.events.filter((event) => split === undefined || event.row < split.row);
  const after = split === undefined ? [] : raster.events.filter((event) => event.row >= split.row && event !== split);
  const edges = pairedRhythm(before, 'left', 'right');
  edges.forEach((step, index) => {
    const told = Math.max(...edges.slice(0, index + 1).map((item) => item.to));
    const next = edges[index + 1];
    const count = told === step.to && (next === undefined || next.from > step.to) ? ` → ${width(raster, step.to)} stitches` : '';
    steps.push(`${step.text.replace(': ', step.side === 'both' ? ' at each side: ' : ` at the ${step.side} edge: `)}${count}.`);
  });
  if (split !== undefined) {
    steps.push(`Row ${split.row + 1}: neck. Bind off the centre ${split.stitches} stitches. From here the left shoulder knits on C${plan.carriers.main} and the right shoulder on C${plan.carriers.second}, at the same time.`);
    const lower = (list: readonly RhythmStep[]) => list.map((step) => step.text.replace(/^Rows? /, (match) => match.toLowerCase())).join('; ');
    // Each shoulder's neck and armhole edges: once when both shoulders shape alike, else each its own.
    for (const [name, left, right] of [['neck', 'neck-left', 'neck-right'], ['armhole', 'left', 'right']] as const) {
      const lefts = edgeRhythm(after, [left]);
      const rights = edgeRhythm(after, [right]);
      if (lefts.length === 0 && rights.length === 0) continue;
      if (lower(lefts) === lower(rights)) steps.push(`Each ${name} edge: ${lower(lefts)}${name === 'armhole' ? '; both shoulders on the same rows' : ''}.`);
      else for (const [side, list] of [['Left', lefts], ['Right', rights]] as const) if (list.length > 0) steps.push(`${side} ${name} edge: ${lower(list)}.`);
    }
  }
  const last = raster.rows.length - 1;
  const lastRow = raster.rows[last]!;
  const finish = object.top === 'waste' ? 'knit waste yarn over' : 'bind off';
  steps.push(`Row ${last + 1} is the last: ${finish} the remaining ${lastRow.segments.map((segment) => segment.hi - segment.lo + 1).join(' + ')} stitches.`);
  return steps;
}

export function assemblySteps(plan: SweaterPlan): string[] {
  const { silhouette, neckline } = plan.object;
  const steps = [
    `Take each piece off the machine and ${plan.carriers.draw ? `pull the draw thread (C${plan.carriers.draw}) to release it from the waste yarn` : 'unravel or cut away the waste yarn below the cast-on'}. Trim the strand of the second shoulder yarn that runs up the right edge of the front` + (plan.pieces.find((piece) => piece.id === 'back')?.raster?.events.some((event) => event.kind === 'neck-split') ? ' and back.' : '.'),
    'Wash and block every piece to the schematic measurements; let them dry flat.',
    neckline === 'boat'
      ? `Sew the shoulder seams from each armhole edge toward the centre, leaving the middle ${plan.object.measurements.neckWidth} cm open for the neck.`
      : 'Sew the front to the back at the shoulders (mattress stitch through the bound-off edges, or graft live stitches if you finished with waste yarn).',
    silhouette === 'drop-shoulder'
      ? 'Fold each sleeve in half lengthwise to find the middle of its top. Pin that point to the shoulder seam and sew the sleeve top straight along the front and back edges.'
      : silhouette === 'j-sleeve'
        ? 'Pin the middle of each sleeve top to the shoulder seam. Sew the flat top along the straight armhole edges, then fit the sleeve\'s bound-off underarm steps into the body\'s.'
        : 'Pin the top of each sleeve cap to the shoulder seam and the cap\'s bound-off stitches to the underarm bind-offs. Ease the cap into the armhole and sew.',
    'Sew each side seam and sleeve seam in one line, from the hem to the cuff, one stitch in from the edges.',
    ...(neckline === 'crew' ? ['Sew the neckband\'s short ends together into a ring. Pin the seam to one shoulder seam and stretch the band evenly around the neck opening; sew it on with the right sides out.'] : []),
    ...(neckline === 'v' ? ['Sew the neckband on from the point of the V, round the back and down to the point again, stretching it slightly; cross the right end over the left at the V and stitch both ends down.'] : []),
    ...(neckline === 'square' ? ['Sew the neckband on round the opening, stretching it slightly along the sides; at each corner fold the band at 45° (a mitre) so it lies flat, and join the ends at a shoulder seam.'] : []),
    'Weave in the ends.',
  ];
  return steps;
}

/** The written pattern, with the readiness story first. */
export function sweaterInstructions(project: ColorworkProjectV1, plan: SweaterPlan, summary: SweaterRunSummary | null): string {
  const { state } = materializeColorworkProject(project);
  const yarn = state.chart.palette[0]!;
  const object = plan.object;
  const texture = textureMatching(object.body.texture);
  const lines: string[] = [`# ${project.title}`, ''];
  if (summary) {
    lines.push(...storyLines(readinessStory({ findings: summary.findings, readiness: summary.readiness, verdict: summary.verdict, exportReady: summary.exportReady })));
    lines.push('', `Software verdict: ${summary.verdict.label}. Physical knitting, yarn and fit are checked only by knitting.`, '');
  }
  lines.push(
    '## The sweater',
    `A ${SILHOUETTE_NAMES[object.silhouette]} sweater with a ${object.neckline === 'boat' ? 'boat neck' : `${object.neckline === 'v' ? 'V' : object.neckline} neck and rib neckband`}, knitted flat in pieces and sewn${object.size ? ` (${object.size})` : ''}.`,
    `Body: ${object.body.name}${texture ? '' : ` (custom: ${object.body.texture.join(' / ')})`}. Hem and cuffs: ${ribName(object.trims.hem.rib)} rib, ${object.trims.hem.cm} and ${object.trims.cuff.cm} cm. ${object.neckline === 'crew' ? 'Neckband' : 'Neck edge'}: ${ribName(object.trims.neck.rib)} rib, ${object.trims.neck.cm} cm.`,
    `Yarn: ${yarn.name} (${yarn.hex}). Body gauge ${plan.gauge.stitchesPer10cm} st / ${plan.gauge.rowsPer10cm} rows per 10 cm (${plan.gauge.source}); rib gauge ${plan.ribGauge.stitchesPer10cm} / ${plan.ribGauge.rowsPer10cm} (${plan.ribGauge.source}).`,
    '',
    '## Finished measurements',
    ...plan.realized.map((item) => `- **${item.label}:** ${item.cm} cm knitted${item.target === null ? '' : ` (wanted ${item.target} cm)`}, ${item.how}.`),
    `- **Yarn:** about ${plan.yarn.metres.toLocaleString('en')} m of the main yarn (${plan.yarn.how}).`,
    '',
    '## At the machine',
    ...(summary ? summary.readiness.operatorChecks : [`Main yarn on C${plan.carriers.main}${plan.carriers.second ? `; a second cone of the same yarn on C${plan.carriers.second} for the right shoulder` : ''}. Waste yarn on C${plan.carriers.waste}${plan.carriers.draw ? `, draw thread on C${plan.carriers.draw}` : ', no draw thread'}.`]).map((check) => `- ${check}`),
    '',
    '## Pieces',
  );
  for (const piece of plan.pieces) {
    const run = summary?.pieces.find((item) => item.id === piece.id);
    lines.push('', `### ${piece.name}${piece.copies > 1 ? ` — knit ${piece.copies}` : ''}`, `File: \`${piece.id}.kc\`${run?.passCount ? ` · ${run.passCount.toLocaleString()} passes` : ''}${run ? ` · ${run.verdict.label}` : ''}`, '');
    for (const step of pieceSteps(piece, plan)) lines.push(`- ${step}`);
  }
  lines.push('', '## Assembly', ...assemblySteps(plan).map((step, index) => `${index + 1}. ${step}`), '');
  return lines.join('\n');
}

/** The yarns each carrier holds, for a piece's run record. */
function runCarriers(plan: PiecesPlan, yarn: { name: string; hex: string }): KnitFileCarriers {
  const { main, second, waste, draw } = plan.carriers;
  return { main, second, waste, draw, yarns: { [main]: yarn, ...(second ? { [second]: { name: `${yarn.name}, second cone`, hex: yarn.hex } } : {}) } };
}

/** One run record for each piece knitted, each copy its own (a sweater's two sleeves). */
export function pieceRunRecords(plan: PiecesPlan, summary: SweaterRunSummary, yarn: { name: string; hex: string }, fileName: (piece: SweaterRunSummary['pieces'][number]) => string): string[] {
  const lines: string[] = [];
  for (const piece of summary.pieces) {
    if (piece.file === null) continue;
    for (let copy = 1; copy <= piece.copies; copy++) {
      const name = piece.copies > 1 ? `${piece.name} ${copy}` : piece.name;
      lines.push('', ...runRecordMarkdown(piece.file, runCarriers(plan, yarn), `Run record: ${name} (\`${fileName(piece)}\`)`));
    }
  }
  return lines;
}

/** The gauge lines every piece form starts with: what the plan assumed, to be measured on the knitted fabric. */
export function gaugeRows(plan: PiecesPlan, rib: boolean): string[] {
  const { gauge, ribGauge } = plan;
  return [
    `| Body gauge | stitches and rows over 10 cm in a plain area of the body, face side | ${gauge.stitchesPer10cm} st / ${gauge.rowsPer10cm} rows (${gauge.source}) | ___ st / ___ rows |`,
    ...(rib ? [`| Rib gauge | stitches and rows over 10 cm in the rib, unstretched | ${ribGauge.stitchesPer10cm} st / ${ribGauge.rowsPer10cm} rows (${ribGauge.source}) | ___ st / ___ rows |`] : []),
  ];
}

/**
 * The form returned with a knitted sweater: each piece's exact file, the
 * sizes the plan predicts beside the measured ones, and a run record for
 * each piece knitted. The pieces are measured flat before sewing up, so each
 * measure belongs to one piece.
 */
export function sweaterMeasurementForm(project: ColorworkProjectV1, plan: SweaterPlan, summary: SweaterRunSummary): string {
  const { state } = materializeColorworkProject(project);
  const fileName = (piece: SweaterRunSummary['pieces'][number]) => `${piece.id}.kc`;
  const measures = MEASUREMENT_FIELDS.filter((field) => plan.knitted[field.key] !== undefined);
  return `${[
    `# Measurement form: ${project.title}`,
    '',
    'Measure only pieces knitted from these exact files.',
    '',
    '| Piece | File | KCode SHA-256 |',
    '|---|---|---|',
    ...summary.pieces.map((piece) => `| ${piece.name}${piece.copies > 1 ? ` × ${piece.copies}` : ''} | \`${fileName(piece)}\` | \`${piece.kcHash ?? 'not exported'}\` |`),
    '',
    'Wash or steam each piece as the yarn label says, let it dry flat and rest 24 h. Then lay it flat without stretching and measure it with a rigid rule, before sewing up.',
    '',
    '| Measure | On the flat pieces | Predicted | Measured |',
    '|---|---|---|---|',
    ...gaugeRows(plan, true),
    ...measures.map((field) => `| ${field.label} | ${field.onPiece} | ${plan.knitted[field.key]} cm | ___ cm |`),
    '',
    'Also: the outcome of each piece (clean / issues / failed), every machine stop and what was done, and photographs of each piece, the sewn sweater and any defect with a ruler in frame.',
    ...pieceRunRecords(plan, summary, state.chart.palette[0]!, fileName),
  ].join('\n')}\n`;
}

/** Every file of the package, with a manifest of their SHA-256. Throws when a piece has no validated program. */
export async function sweaterPackageFiles(input: {
  project: ColorworkProjectV1;
  serializedProject: string;
  plan: SweaterPlan;
  summary: SweaterRunSummary;
  sha256: (bytes: Uint8Array) => Promise<string>;
}): Promise<Record<string, Uint8Array>> {
  const { project, plan, summary } = input;
  if (!summary.exportReady) throw new Error('Every piece needs a validated program before the package can be written.');
  const encode = (text: string) => new TextEncoder().encode(text);
  const { state } = materializeColorworkProject(project);
  const files: Record<string, Uint8Array> = {
    'project.json': encode(input.serializedProject),
    'instructions.md': encode(sweaterInstructions(project, plan, summary)),
    'schematic.svg': encode(sweaterSchematicSvg(plan, state.chart.palette[0]!.hex)),
  };
  for (const piece of summary.pieces) {
    files[`${piece.id}.kc`] = encode(piece.kcText!);
    if (piece.knitoutText) files[`${piece.id}.k`] = encode(piece.knitoutText);
  }
  const manifest = {
    kind: 'kniterate-studio-sweater-package',
    version: 1,
    project: project.id,
    verdict: summary.verdict.label,
    ready: summary.readiness.ready,
    pieces: summary.pieces.map((piece) => ({ id: piece.id, name: piece.name, copies: piece.copies, file: `${piece.id}.kc`, passes: piece.passCount, kcodeSha256: piece.kcHash, verdict: piece.verdict.label })),
    files: Object.fromEntries(await Promise.all(Object.entries(files).map(async ([name, bytes]) => [name, await input.sha256(bytes)] as const))),
    /** Filled in and returned by the knitter; not hashed. */
    forms: ['measurement-form.md'],
  };
  files['measurement-form.md'] = encode(sweaterMeasurementForm(project, plan, summary));
  files['manifest.json'] = encode(`${JSON.stringify(manifest, null, 2)}\n`);
  return files;
}
