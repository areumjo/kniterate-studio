import type { Measurements } from './draft';

/**
 * A sweater's measurements: their names, how to measure each on the finished
 * pieces, and the order Studio lists them in. The design panel and the
 * package's measurement form both use these, so a measure has one name.
 */
export const MEASUREMENT_FIELDS: readonly { key: keyof Measurements; label: string; onPiece: string }[] = [
  { key: 'chest', label: 'Chest', onPiece: 'front and back, each straight across just below the armhole; add the two' },
  { key: 'length', label: 'Length', onPiece: 'back, from the hem up to the top of the shoulder beside the neck' },
  { key: 'armholeDepth', label: 'Armhole depth', onPiece: 'back, from the first armhole stitch straight up to the shoulder point' },
  { key: 'shoulderWidth', label: 'Shoulder width', onPiece: 'back, straight across from shoulder point to shoulder point' },
  { key: 'sleeveLength', label: 'Sleeve length', onPiece: 'sleeve, from the cuff edge up to where the cap or underarm starts' },
  { key: 'upperArm', label: 'Upper arm', onPiece: 'sleeve, straight across at its widest' },
  { key: 'cuff', label: 'Cuff', onPiece: 'sleeve, straight across the cuff edge' },
  { key: 'neckWidth', label: 'Neck width', onPiece: 'front, across the neck opening at the top' },
  { key: 'frontNeckDepth', label: 'Front neck depth', onPiece: 'front, from the top beside the neck straight down to the bottom of the neck' },
  { key: 'backNeckDepth', label: 'Back neck depth', onPiece: 'back, from the top beside the neck down to the bottom of the back neck' },
  { key: 'shoulderDrop', label: 'Shoulder slope', onPiece: 'back, how much lower the shoulder point is than the top beside the neck' },
];

export const MEASUREMENT_LABELS = Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field.key, field.label])) as Record<keyof Measurements, string>;
