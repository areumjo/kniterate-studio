import { CarriageSimulator } from '../sim/carriage-simulator.js';

/**
 * The roller Studio pulls with on the first row knitted after a whole-bed
 * transfer block: Kniterate's guidance knits the row after many transfers at
 * a takedown of 50-100 "to avoid dropping". Yarn broke at the first fairisle
 * row after the cast-on transfers at 450 (issue #9 runs 1 and 2).
 */
export const STUDIO_FIRST_ROW_AFTER_TRANSFERS_ROLLER_V1 = 100;

export interface FirstRowSpeedOverride {
  speed: number;
  restoreSpeed: number;
  /** Optional first-row stitch number (Customist fairisle knits the first
   *  body row at the handoff stitch) and the body stitch to restore. */
  stitch?: number;
  restoreStitch?: number;
  /** Optional first-row roller and the body roller to restore. */
  roller?: number;
  restoreRoller?: number;
}

export function applyFirstRowSpeedOverride(
  sim: CarriageSimulator,
  row: number,
  override: FirstRowSpeedOverride | undefined,
): void {
  if (row === 0 && override) {
    sim.setSpeed(override.speed);
    if (override.stitch !== undefined) sim.setStitch(override.stitch);
    if (override.roller !== undefined) sim.setRoller(override.roller);
  }
}

export function restoreFirstRowSpeedOverride(
  sim: CarriageSimulator,
  row: number,
  override: FirstRowSpeedOverride | undefined,
): void {
  if (row === 0 && override) {
    sim.setSpeed(override.restoreSpeed);
    if (override.restoreStitch !== undefined) sim.setStitch(override.restoreStitch);
    if (override.restoreRoller !== undefined) sim.setRoller(override.restoreRoller);
  }
}
