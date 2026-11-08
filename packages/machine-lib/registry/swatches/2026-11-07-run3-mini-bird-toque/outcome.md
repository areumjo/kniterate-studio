# Outcome narrative

`run.json` is the authoritative structured record for operator, timing, exact
outcome, placement verification, interventions, inspections, and dimensions.
Use this file only for explanatory context.

Run 3 of the machine handoff in issue #9: the mini bird toque as issued
(`a5000f5f…`), knitted on 2026-10-30 and reported in
[issue #9, comment 6711473394](https://github.com/xjhc/kniterate-studio/issues/9#issuecomment-6711473394).
Development evidence only. It qualifies nothing for `1.0.0`.

## What worked

- Nothing was completed with this file. See the related run below.

## What failed or changed

- Stitches were missed near the first needles, and the waste yarn tangled while
  C3 and C4 were brought in. The attempt was not completed.
- The file's start comes from Kniterate's own 2×2 rib beanie and differs from
  the fairisle start (run 2) exactly where it failed:
  - the waste section steps up from speed 300 to 700, with no roller pull on
    every other pass, where the fairisle file runs steadily at 300;
  - the main and contrast yarns come in at speed 200, against 100;
  - 7 waste passes follow the main yarn's introduction, against 2.
- The gauges are labelled measured, but they were assumed placeholders: the
  issue's commands left out `--gauge-source assumed`.

## Related run, different file (not this entry's evidence)

The completed run 3 used a hand-edited copy, `3-mini-toque-slow-v1/program.kc`
(`ecb46fb62d0aaa3672b7efcf16de1de7715d536c94ccb4fc5f3ec5ed6b14f60c`). It sets
all 436 movement passes to speed 100 (431 speed fields changed; nothing else).
It is not a Studio artifact and cannot be registered. It does not validate this
file's speeds. Its observations guide the next candidate:

- The 2×2 cast-on looked neat, with no edge drops in the rib or crown.
- Occasional drops at the left edge during the waste section, and at the right
  edge during the jacquard.
- The waste section felt unnecessarily long. The operator prefers run 1 and 2's
  yarn introduction.
- The crown is tight and stiff. The file knits the join row at stitch 9, one
  decrease round from 62 to 46 stitches, one row at stitch 6 / roller 450, then
  19 rows at stitch 5 / roller 300.
- The 46 live crown stitches are dropped at the end, which is impractical to
  catch. Knit waste yarn over them before release instead.
- The bird, 12 × 10 stitches at 3 cm, is too coarse to read. Use a larger motif
  and a taller body.
- Design preference: an all-rib beanie, or a double-jacquard beanie with a
  matching brim and crown, rather than rib plus jacquard.

## Follow-up

- Fix the beanie start, the top and the crown settings in the engine, then knit
  a new hash-bound candidate. Never edit a knitted `.kc`.
- Record the machine serial, software version, displayed pass count, yarn
  brands and lots, and stop rows on the next run.

## Photos

None of run 3 yet.

(Photos are gitignored; keep them locally only.)
