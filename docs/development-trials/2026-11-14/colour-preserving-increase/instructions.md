# Colour-preserving right increase / tuck-join diagnostic

**2026-11-14 update: hold for investigation.** The operator reports the latest increase looked worse than the previous method. The supplied images show the earlier paisley; exact specimen identification is pending. See [operator feedback](operator-feedback.md). Preparation-time statements below describe the original candidate, not its current acceptance.

Prepared 2026-11-14. Experimental physical candidate, not a proven recipe. User requested matching face-colour shaping and a cleaner increase, authorised research/validation then a short two-colour test. The preceding 514-pass paisley was reported better but imperfect; contrasting increase stitches were explicitly unwanted. This is not another paisley run or a startup-fault fix.

## What this test can establish

16 → 17 → 18 columns, 12 body cycles, right edge only, two increases on cycles4 and8. Grey front / orange rear ground. No decreases, no pattern. Right-side knit-loop colours stay on their original faces after each complete cycle; each split works through a parent of its own colour. A small grey tuck into the rear outer needle joins the layers on ordinary cycles; orange then knits through that tuck. No tuck on a growth cycle; the next ordinary cycle joins the widened edge. The left edge keeps the previous alternating-colour join as a reference, not the new colour treatment.

**Do not promise an invisible join.** The tuck is a contrasting grey strand at the orange edge and may show a small fleck or add bulk. Software establishes a knitted connection, not the finished look. This is a compromise candidate for keeping the main visible knit stitches in the correct colour, not proof of absolutely zero opposite-colour yarn. Colour-preserving increases without any joining operation leave the sides separate; the no-tuck negative control intentionally fails.

## Setup / observation

C3 previous orange single 2/14 acrylic; C4 previous grey single 2/14 acrylic. C1 previous draw; C6 previous waste (two strands2/30). C2/C5 unused. Start empty needle bed, feeders home left. Body stitch7, speed200, two roller450 advances per cycle (first cycle100); tuck-only portions roller0. Transfer speed100, stitch5, roller0. Temporary reach up to two columns beyond the old edge; rack magnitude≤2.

First increase splits: **133 (grey), 138 (orange)**. Second: **161 (grey), 166 (orange)**. Stop and record the screen pass if a loop drops, stays on a temporary needle, or a snag/stack occurs. Photograph both faces and both edges with cast-on below; mark machine-right before flipping. Compare same-colour knit columns, continuity under gentle stretch, tuck visibility, edge bulk, and holes/elongation. Whether it looks more like the previous decrease remains a physical question.

Eight tubular top-waste courses, then release. Secure live stitches before removing waste. C6 has an informational 15-needle carry from pass80 to86 during yarn introduction; observe the reported introduction-stage waste drops separately. Startup uses the shared recipe at16 columns, not a claimed repair of those drops. No SD copy has been made for this candidate.

## Same-colour loop construction (abstract source columns)

Start F(n)=grey a and R(n)=orange b. Columns n+1 and n+2 are empty. All splits are the captured front→rear, rack-zero form. No rear-delivering or racked split is used.

| Step | Operation | Purpose |
|---|---|---|
| 1 | R(n)→F(n+1), rack+1 | Park orange loop on a spare front needle |
| 2 | Grey split F(n)→R(n), rack0 | New grey stays F(n); old grey goes R(n) |
| 3 | R(n)→F(n+2), rack+2 | Park old grey outside the work |
| 4 | Orange split F(n+1)→R(n+1), rack0 | Old orange goes to new rear edge; new orange stays on temporary front |
| 5 | F(n+1)→R(n), rack+1 | Put new orange back on the original rear column |
| 6 | F(n+2)→R(n+2), rack0 | First leg of returning old grey |
| 7 | R(n+2)→F(n+1), rack−1 | Put old grey on the new front edge |

Result F(n),F(n+1) grey and R(n),R(n+1) orange, one loop each; temporary column empty. Carrier positioning clears the temporary work envelope. Other front and rear stitches knit during the split cycles; the old loops moved to the new outer column are retained until the next ordinary row, not knitted empty. Five transfer actions plus two splits per event. This differs from the earlier crossed-colour two-cycle increase and has not been knitted.

## Verification and limits

Strict parsing, canonical machine validator, machine-safety envelope, scheduled-pass differential and loop audit pass. Per-cycle live counts, final face colours, same-colour split parents, empty temporary needles, no empty-source/occupied-target transfers, both-side connections and exactly two prescribed take-down advances per cycle checked. Zero C1/C6 body movements. One known startup carry advisory, no errors/warnings.

Five focused tests pass: positive candidate; missing tucks must fail joining; missing front restoration must fail; wrong split yarn must fail colour ancestry; missing rear return must fail. Targeted strict TypeScript check passes. Experimental scripts only; no production Studio emitter, converter or existing machine file changed. No full-app release or formal Knit-proven promotion.

The first attempt exposed an unsafe carrier relocation across attached yarn and duplicate take-down with mixed knit/tuck operations. Both were corrected in scheduling without relaxing safety limits. Source provenance now assigns combined move/knit passes from their working operations, and rejects genuinely mixed working-row labels.

## References and evidence boundary

- Kniterate split primitive: https://support.kniterate.com/hc/en-us/articles/360012868178-Split-stitch
- Kniterate jacquard Border Close, inner/outer colour settings, and knit/tuck pass restriction: https://support.kniterate.com/hc/en-us/articles/39032141113757-Global-Local-commands
- STOLL cross-tubular double-face needs a special closing selvedge: https://nfc.stoll.com/faq/ckc_userguide/en/9303416331.html
- Local official Customist split captures and Gate2 conformance: docs/SPLIT-INCREASE-GATE2.md.

These sources support primitives and the need for a separate selvedge; none supplies this exact temporary-loop/tuck recipe. The sequence is our derivation. Moving a rear-origin loop onto a temporary front needle before splitting, its physical orientation, repeated rack2 handling, extra transfer time and tuck appearance require a supervised knit.

Rebuild from repository root: `node --import tsx scripts/experiments/colour-preserving-increase.ts ../colour-preserving-research`.
Tests: `node --import tsx --test scripts/experiments/colour-preserving-increase.test.ts`.

Exact candidate: 234 passes, 283387 bytes, SHA256 `912b9bc66264396cb5a79a079f23d969a46083f1c928ac0eeb2feca355cf7a18`.
