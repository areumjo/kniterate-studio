/**
 * Reference-derived DBJ frame with a generic Birdseye body, 7gg.
 *
 * Waste, introduction, settings, and finish are derived from `reference/dbj.kc`.
 * The body uses the general Birdseye rule: every requested front stitch and
 * one rear stitch per needle per design row. It does not reproduce Customist's
 * full-needle DBJ backing. See `test/knitout/dbj-parity.test.ts` for the explicit
 * comparison boundary and Studio's birdseyeBody.test.ts for row coverage.
 */

import { FAIRISLE_PARK_BINDOFF_DEFAULTS } from '../passes/bind-off.js'
import type { RecipeOverrides } from '../wizard-config.js'

export const CUSTOMIST_STUDIO_BIRDSEYE_7GG_OVERRIDES: RecipeOverrides = Object.freeze({
  body: {
    stitchNumber: 7,
    speedNumber: 400,
    // dbj.kc's; Studio knits STUDIO_BIRDSEYE_BODY_ROLLER_V1 unless a project sets its own.
    rollerAdvance: 450,
    xferStitchNumber: 5,
    backBedStyle: 'birdseye',
    birdseyeMode: 'full',
  },
  start: {
    wastePasses: 80,
    wasteCarrierOverride: '6',
    drawCarrierOverride: 'none',
    wasteMachineConfig: {
      stitchNumber: 5,
      castOnSpeed: 100,
      castOnRoller: 440,
      castOnPasses: 1,
      castOnTuckPasses: 0,
      castOnTuckSpeed: 300,
      castOnTuckRoller: 0,
      wasteSpeed: 400,
      flatRollerPasses: 4,
      rampRollerLeft: 440,
      rampRollerRight: 0,
      castOnFirstBed: 'front',
      edgeInertNeedles: 0,
    },
  },
  finish: {
    bindOff: 'fairisle-park-bindoff',
    fairisleParkConfig: {
      ...FAIRISLE_PARK_BINDOFF_DEFAULTS,
      closingWasteSpeed: 300,
      closingWasteRoller: 450,
      closingWasteStitchRamp: Array.from({ length: 20 }, () => 6),
      parkSpeed: 300,
      parkRoller: 450,
      parkStitch: 6,
      parkAutoMoveSpeed: 600,
      parkAutoMoveRoller: 0,
    },
  },
}) as RecipeOverrides

/**
 * Studio's birdseye body roller: Kniterate's settings table for jacquard at
 * Nm7 (stitch 6-7, roller 700, speed 200-400), over dbj.kc's 450. Right-edge
 * stitches dropped in the birdseye body at 450 (issue #9 run 3), and Kniterate
 * staff fix birdseye edge drops with a stronger pull.
 */
export const STUDIO_BIRDSEYE_BODY_ROLLER_V1 = 700
