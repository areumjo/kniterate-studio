# Atelier paisley triangle — first product design study

Status: **design only; no machine program and no physical approval**. Prepared 2026-11-14.

The operator asked to start a realistic final product with much better paisley artwork, aiming toward Kujten, then specified a triangle like the [Tafi Organic Beige](https://www.kujten.com/en-us/products/bandana-tafi-beige-organic-2). This replaces the provisional elongated-diamond direction. It runs alongside the small colour-preserving-increase diagnostic in issue #18; the diagnostic is still awaiting operator feedback.

The selected product page lists 141 cm width, 62.5 cm length, 100% cashmere, two-ply loose-tension jersey, reversible and two-toned printed. These are reference specifications, not claims about our construction. It is not evidence that Kujten uses our reversible jacquard structure. Printed fine detail and loose jersey handfeel cannot be promised by a double-bed chart preview.

## Design

Original, editable floral paisleys with nested contours, internal rosettes and leaf details. Two large paired motifs anchor the centre, two smaller echoes lead toward the corners, and a continuous leaf-vine border frames all three sides. Background ornaments have deliberate spacing. No Kujten logo, tracing or copied image is included.

Midnight/butter is the current design palette. Final fibre, count, colours and stitch settings remain open. Orange/grey 2/14 acrylic is the construction-test pair, not a claim of cashmere-equivalent drape.

- `index.html`: interactive local preview; switch artwork/stitch draft, flip faces, zoom.
- `design-board.png` / `.svg`: full composition and both binary-chart faces.
- `composition-master.svg`, `paisley-master.svg`: editable vector artwork.
- `chart.json`: Studio ColorworkChartV1 planning chart, **232 columns × 480 design courses**.
- `shape.json`: companion active-needle mask, one fixed boundary and one shaped boundary, eight-column provisional tips.
- `front.svg`, `reverse.svg`: binary chart with the mask applied. Opposite face swaps colours and mirrors course direction in the displayed triangle.

Importing `chart.json` alone does NOT import the shaped outline: cells outside the mask are ordinary colour zero in the chart contract. Keep the companion mask and do not export this as a rectangular program. This is a design asset, not an integrated shaped Studio project.

## Construction concept and outstanding sizing work

Knit from one long-edge tip to the other. In the machine's coordinate system the left boundary stays fixed, and the right boundary grows to the triangle depth then contracts. Display orientation rotates courses into the long horizontal edge. This uses the one-sided shaping concept already explored; it does not establish physical success for this size or cadence.

141 × 62.5 cm is a reference target. The 232 × 480 grid is only a resolution study, not a measured-gauge pattern. The earlier acrylic body measured 68 columns across 18.5 cm (about 36.8 columns/10 cm), but the reported height included upper waste, so it is not a reliable course gauge. Final yarn requires a washed, relaxed reversible swatch measured within the body in both directions.

At this provisional grid the active width is 8 → 232 → 8 over 480 courses. This requires increases/decreases nearly every design course (224 changes over 239 transitions per half), faster than a once-every-two-course test. **Do not silently reuse the earlier cadence or claim this draft is executable.** Recalculate the grid from washed gauge, then explicitly validate the required cadence/direction/carrier parking or revise orientation/size. Bed capacity, needle offset, transfer scratch space, take-down, tip finish and long-edge finish also need checking.

The decorative vine is chart artwork, not a structural join. Construction must retain a proven linked edge on both sides and respect the operator's request for each face's own colour at increases. The new colour-preserving increase is a separate diagnostic; its physical result cannot be inferred from this preview. Trim engineering remains tracked in #19.

## Next product step

1. Review this full triangle composition; refine the smallest paisleys and thin contour details that lose clarity on the binary grid.
2. Select the final yarn and wash a reversible gauge/drape sample, including the accepted edge construction.
3. Recalculate motif scale, triangle dimensions and cadence. Then knit an actual-scale motif-and-border section, rather than shrinking the entire artwork into another tiny swatch.
4. Integrate the approved chart and shaped mask into a Studio project, validate every shaping/edge/startup operation and carrier path, and only then export a full garment candidate.

## Rebuild

Python 3, Node, ImageMagick, and `@resvg/resvg-js` are required. The SVG renderer is isolated from Studio dependencies:

```sh
npm install --prefix /tmp/atelier-render --no-audit --no-fund @resvg/resvg-js
NODE_PATH=/tmp/atelier-render/node_modules python3 designs/atelier-paisley/build.py
```

The script asserts rasterized artwork coverage, writes a binary palette and zeroes inactive cells. Chart-contract parsing, mask dimensions and mirrored-face checks were run separately. These checks validate design files, not knitting safety or fabric appearance.
