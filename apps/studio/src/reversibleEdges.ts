import type { ProjectEdit, ProjectState } from '@kniterate-studio/project-contract';
import { diamondRangesV1 } from '@kniterate-studio/machine-lib/browser';

/** Visible colour-swap selvedges. On a diamond, follow the active bounds. */
export function reversibleEdgeStatus(state: ProjectState): { closed: boolean; edit: ProjectEdit | null } {
  const { chart } = state;
  const colours = [...new Set(chart.cells.flat())].sort((a, b) => (state.machine.yarnAssignments.find(x => x.paletteId === chart.palette[a]?.id)?.carrier ?? String(a)).localeCompare(state.machine.yarnAssignments.find(x => x.paletteId === chart.palette[b]?.id)?.carrier ?? String(b)));
  if (chart.width < 3 || chart.height < 3 || colours.length !== 2) return { closed: false, edit: null };
  let bounds: { lo: number; hi: number }[];
  try {
    bounds = state.strategy.diamond ? diamondRangesV1(chart.width, chart.height, state.strategy.diamond).reverse() : chart.cells.map(() => ({ lo: 0, hi: chart.width - 1 }));
  } catch { return { closed: false, edit: null }; }
  const cells = chart.cells.flatMap((row, y) => [bounds[y]!.lo, bounds[y]!.hi].flatMap(column => {
    const paletteIndex = colours[(chart.height - 1 - y) % 2]!;
    return row[column] === paletteIndex ? [] : [{ rowId: state.rowIds[y]!, column, paletteIndex }];
  }));
  const closed = state.strategy.diamond ? cells.length === 0 : [0, chart.width - 1].every(column => chart.cells.every((row, y) => y === 0 || row[column] !== chart.cells[y - 1]![column]));
  return { closed, edit: cells.length ? { kind: 'paint-cells', cells } : null };
}
