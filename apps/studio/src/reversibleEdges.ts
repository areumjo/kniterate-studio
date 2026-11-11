import type { ProjectEdit, ProjectState } from '@kniterate-studio/project-contract';

/** A visible one-column colour-swap selvedge. At a carrier's turnaround,
 * changing its edge bed joins the two faces without extra passes or transfers.
 * Three rows cover both turning sides even when carriers start together.
 * This is a development construction, not captured vendor border parity. */
export function reversibleEdgeStatus(state: ProjectState): { closed: boolean; edit: ProjectEdit | null } {
  const { chart } = state;
  const colours = [...new Set(chart.cells.flat())].sort((a, b) => a - b);
  if (chart.width < 3 || chart.height < 3 || colours.length !== 2) return { closed: false, edit: null };
  const columns = [0, chart.width - 1];
  const closed = columns.every(column => chart.cells.every((row, y) => y === 0 || row[column] !== chart.cells[y - 1]![column]));
  const cells = chart.cells.flatMap((row, y) => columns.flatMap(column => {
    const paletteIndex = colours[(chart.height - 1 - y) % 2]!;
    return row[column] === paletteIndex ? [] : [{ rowId: state.rowIds[y]!, column, paletteIndex }];
  }));
  return { closed, edit: cells.length ? { kind: 'paint-cells', cells } : null };
}
