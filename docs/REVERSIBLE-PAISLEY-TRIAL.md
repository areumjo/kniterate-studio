# Reversible paisley development swatch

The user requested a first reversible paisley swatch inspired by Guest in
Residence's Wild Rag, using the previous orange/grey 2/14 acrylic pair. This
is a simplified authored chart, not an exact reconstruction of the photographed
cashmere scarf. The supplied Midnight/Butter URL currently shows Burnt Cocoa/Dune;
the design preview intentionally keeps midnight and butter.

## Candidate

- 68 needles × 95 design rows; one-based needles 93–160, centered.
- Predicted 26.2 × 27.9 cm at **assumed** 26 stitches / 34 rows per 10 cm.
  Readiness remains false until reversible-fabric gauge is measured.
- C3 orange, C4 grey: one strand of the previous 2/14 acrylic each.
  C1 draw thread; C6 waste. Preview palette colours are not yarn identities.
- 426 passes. SHA-256:
  `6373e2c66fcb12a5325ea406c0f71c5f2965d6d05375023c0c0e0f92a5e09f3f`.
- Main body stitch 7, speed 200, roller 450; cast-on stitch 3, speed 100,
  roller 450, tubular roller 200. These are development settings, not
  experimentally established settings for this fabric.
- Eight top waste rows **per bed**, then drop both beds. Keep waste attached
  during measurement. Secure both faces on lifelines/needles before removing
  waste; finish by hand. This is a fabric trial, not another bind-off trial.

The cast-on joins the layers in the cast-on colour. Motif changes join the
layers; large plain areas and plain side margins may separate. This is not
yet a finished scarf with designed side edges. Watch the previously reported
early waste bunching and persistent left-edge failure from the beginning;
record the first affected pass rather than assuming the new construction
fixes that physical problem.

## Implementation and evidence

Normal Studio chart compilation now accepts the existing `complement` strategy.
It uses the repaired waste/carrier introduction, a full-bed zigzag and two
tubular rows at half rack (pinned to `reference/jacquard.kc`), complementary
body selections, no rear-to-front collapse, and tubular top waste. The body
mechanism uses the existing inverse-colour emitter; whole-program parity with
Kniterate's reference programs is not claimed.

`reversibleChart.test.ts` checks every body selection on both beds at widths
19, 32, 33 and 68, the full-bed cast-on, reference cast-on rack, absence of
transfers, eight waste loops per needle on each bed, and grouped drop passes.
It rejects one-colour and machine-bind-off requests. Restoring the old rear-bed
collapse made the regression tests fail. The 46-file construction matrix and
the final candidate's loop audit pass. Physical validation is pending.

The editable project and normal CLI package are in the workspace's
`paisley-swatch/` directory, beside this repository. The source chart is
`fixtures/colorwork-chart-v1/paisley-border.json`. Re-export the editable project:

```sh
pnpm studio package ../paisley-swatch/project.json -o ../paisley-swatch/package
pnpm studio audit ../paisley-swatch/package
```

## Agent and user experience

1. The typed edit/plan/render/export workflow works well: one project supplies
   the browser and CLI, preserving carrier assignments and assumed gauge.
   The new construction is exposed as **Invert colours** with its limits.
2. The strategy schema previously accepted complement while authored exports
   rejected it. Implementing the full construction closes that gap for
   two-colour rectangular charts; it does not add reversible beanies.
3. There is no useful photograph-to-paisley tracing workflow. The motif needed
   a deterministic authored redraw and visual review. Small paisleys lose
   detail at this resolution; judge the physical sample before scaling up.
4. The status still tells a swatch project to “Knit a swatch”, and generated
   sizing guidance says “hat” for a rectangle. A dedicated trial-project flow
   and object-specific wording would make the next action clearer.
5. The chart's first-needle field can disagree with centered KCode lowering
   after resizing. This candidate was aligned explicitly to 93–160; the
   general coordinate consistency issue still needs a separate fix.
6. The back design rendering needs an explicit viewing convention: an actual
   turned-over fabric is mirrored as well as colour-inverted. An authored
   side-by-side preview is included, but it is not a fabric simulation.
7. Machine-time estimates are heuristics, not measured duration. Studio shows
   about 53 minutes for this candidate; do not treat that as a promise.
8. Prior-run registration requires yarn/measurement facts that were not
   recorded. Preserve incomplete evidence without inventing values; a partial
   trial intake would improve the agent and operator workflow.

The complete release proof also depends on the repository's mutation and
physical-registry gates. Candidate Surface-proven status is software evidence,
not a claim that the full repository release gate or physical gate has passed.
