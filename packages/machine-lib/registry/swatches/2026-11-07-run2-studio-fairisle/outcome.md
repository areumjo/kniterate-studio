# Outcome narrative

`run.json` is the authoritative structured record for operator, timing, exact
outcome, placement verification, interventions, inspections, and dimensions.
Use this file only for explanatory context.

Run 2 of the machine handoff in issue #9: Studio's Customist-matched fairisle
(`3607b0ff…`), knitted on 2026-10-30 and reported in
[issue #9, comment 6711473394](https://github.com/xjhc/kniterate-studio/issues/9#issuecomment-6711473394).
Development evidence only. It qualifies nothing for `1.0.0`.

## What worked

- Knitted to the end.
- The two pattern colours look matched in stitch size, and the later patterned
  fabric looked good.

## What failed or changed

- **Waste start:** C6 travelled, but its first row did not catch yarn. The
  second row caught the loose span from the first row and tangled. The operator
  paused, cleared it and continued without restarting, and later put it down to
  a loose, unsecured yarn tail. The cause is not confirmed.
- **Draw thread:** C1 sometimes missed its entire first pass while later passes
  worked. Initial delivery angle or slack is a hypothesis only. A thicker draw
  thread was not adopted as a fix.
- **First fairisle row:** the yarn broke there. Kniterate's own `fairisle.kc`
  (run 1) broke at the same place, and the two files are identical there. The
  break is not a Studio difference. Run 1 was not clean and used different
  yarns, so setup is not ruled out. Re-knitting run 1 in this run's yarns is the
  cheapest way to separate yarn/setup from the shared program.

## Follow-up

- Re-knit Kniterate's `fairisle.kc` with these yarns (one strand of 2/14 acrylic
  per colour, two strands of 2/30 waste) before changing the fairisle frame.
- Record the machine serial, software version, displayed pass count, yarn
  brands and lots, and stop rows on the next run.

## Photos

Kept on the issue, not in this entry:

- IMG_1010 — the C6 startup miss caught on the next pass.
- IMG_1011 — close-up of the same tangle.
- IMG_1009 (run 1, Kniterate's file, beside an older Holst Garn Supersoft
  sample) is context for this run, not a photo of it.

(Photos are gitignored; keep them locally only.)
