# Paisley: right-only supported split increase and existing decrease

Operator elected to proceed directly from the encouraging right-side reversible comparison to paisley, without the repeat/mirrored trials. This file does not qualify left-side split increases. New combined physical trial; software checks are not physical proof.

## Setup

C3 orange and C4 grey: previous single 2/14 acrylic pair. C1 existing draw; C6 previous double 2/30 waste. C2/C5 unused. Empty needle bed and all feeders home left at start.

Body stitch7, speed200, roller450; first body row100/100. Extra outer-join fragment roller0; carrierless shaping speed100, transfer stitch5, roller0. No manual feeder relocation prescribed.

8 → 21 → 8 columns (8 loops per bed initially), fixed left edge, 81 design rows. 13 right increases beginning rows4,7,…40, each completing on the following row; 13 existing paired cross-bed decreases on rows43,46,…79. Eight tubular waste courses then drop, not a bind-off test. Secure both faces before removing waste.

Original small / simplified large / original small artwork and equal two-row gaps retained. All historical interior cells and width schedule compared against the issued 522-pass paisley. Boundary/old-edge construction cells may change to support the new increase. Start and waste anchoring follow the historical right-only paisley frame, not the recent 24-needle comparison start.

## What changed, and what remains experimental

The opposite-edge borrowed-loop control is removed: left edge stays fixed and alternates yarn ownership. At each right increase, the old rear loop moves outward to the new front; the first split forms supported loops there. The next design row joins the outside rear and splits the old front loop back to its rear position, completing the new column. Interior needles follow the two original paisley chart rows. No body knit has an empty parent.

The carrier at the left performs the outward-first increase, so orange/grey roles alternate across events to preserve three-row spacing. This yarn-role alternation and arbitrary interior colourwork extend the plain comparison and have not been physically knitted. No extra phase-reset construction is inserted.

Mixed front/rear knitting can serialize separately from the split. Completion explicitly sets ordinary roller0 after the split's one-shot450 advance, preventing a third take-down advance if a separate knit pass is emitted. Serialized checks require exactly two positive advances per design row, and zero roller on the outer-join fragment. Do not describe this file as byte-identical to the reviewed plain comparison.

The decrease remains outgoing front→adjacent rear and outgoing rear→adjacent front, then knit both merged stacks. It is not the single-bed three-stitch fashioned decrease.

## Checks

Strict parsing, machine validator, machine-safety envelope, schedule differential and loop audit pass. 0 errors, warnings or float advisories. Every row has one loop per bed per active column, except the deliberately held empty old rear position between the two increase rows. Zero empty-parent body knits; no empty-source transfers; no C1/C6 body movement. Source/serialized colours, motif margins, live-loop counts, split descendant ancestry, decrease destinations and yarn-path edge joins checked.

Five focused tests pass, including three negative controls: replace split with unsupported knit; restore extra take-down; remove fixed-edge colour alternation. Targeted strict TypeScript check passes. This is an isolated experimental builder, not a production Studio emitter change or full-app release proof.

## Watch and record

First increase split passes125 and130. First decrease begins324 (row43). Observe both beds, new and old edge columns, loop capture, side joining and any yarn snag; record screen pass, edge/bed, stops, interventions and setting changes. Photograph both faces and right-edge increase/decrease sections. No repeat or left-side proof is implied. Keep this file/settings fixed for comparison.

Exact candidate: 514 passes, 624238 bytes; SHA256 `2868d508005e90eab60d2ac609609870bba8f9b2fb13661f5e927a50f481aa1d`.

| Design row | Event | Width | Passes | Split passes |
|---|---|---:|---|---|
| 4 | growth | 9 | 121–126 | 125 |
| 5 | completion | 9 | 127–133 | 130 |
| 7 | growth | 10 | 136–142 | 141 |
| 8 | completion | 10 | 143–149 | 146 |
| 10 | growth | 11 | 152–156 | 155 |
| 11 | completion | 11 | 157–163 | 160 |
| 13 | growth | 12 | 166–172 | 171 |
| 14 | completion | 12 | 173–179 | 176 |
| 16 | growth | 13 | 182–188 | 187 |
| 17 | completion | 13 | 189–195 | 192 |
| 19 | growth | 14 | 198–204 | 203 |
| 20 | completion | 14 | 205–211 | 208 |
| 22 | growth | 15 | 214–220 | 219 |
| 23 | completion | 15 | 221–227 | 224 |
| 25 | growth | 16 | 230–236 | 235 |
| 26 | completion | 16 | 237–243 | 240 |
| 28 | growth | 17 | 246–250 | 249 |
| 29 | completion | 17 | 251–257 | 254 |
| 31 | growth | 18 | 260–266 | 265 |
| 32 | completion | 18 | 267–273 | 270 |
| 34 | growth | 19 | 276–282 | 281 |
| 35 | completion | 19 | 283–289 | 286 |
| 37 | growth | 20 | 292–298 | 297 |
| 38 | completion | 20 | 299–305 | 302 |
| 40 | growth | 21 | 308–314 | 313 |
| 41 | completion | 21 | 315–321 | 318 |
| 43 | decrease | 20 | 324–331 | — |
| 46 | decrease | 19 | 336–343 | — |
| 49 | decrease | 18 | 348–355 | — |
| 52 | decrease | 17 | 360–367 | — |
| 55 | decrease | 16 | 372–379 | — |
| 58 | decrease | 15 | 384–391 | — |
| 61 | decrease | 14 | 396–403 | — |
| 64 | decrease | 13 | 408–415 | — |
| 67 | decrease | 12 | 420–427 | — |
| 70 | decrease | 11 | 432–439 | — |
| 73 | decrease | 10 | 444–451 | — |
| 76 | decrease | 9 | 456–463 | — |
| 79 | decrease | 8 | 468–475 | — |

Rebuild: `node --import tsx scripts/experiments/paisley-split-swatch.ts ../paisley-split-swatch`. Test: `node --import tsx --test scripts/experiments/paisley-split-swatch.test.ts`.
