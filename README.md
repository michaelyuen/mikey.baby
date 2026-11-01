# mikey.baby

## Getting Started

### Install Dependencies

```bash
npm i -g pnpm
pnpm i
```

### Run Local Server

```bash
pnpm dev
```

## Engagement photo gallery

The engagement post embeds a native Astro gallery with justified, uncropped rows
and a native dialog viewer. Photos read left-to-right, then top-to-bottom.
The gallery is centered with a maximum width of 1280px. On smaller screens it
fills the viewport minus 24px side margins; the surrounding post text keeps its
normal reading width.
A small layout calculation uses each image's dimensions to give all images in
a row the same height and fill the gallery width. Row heights vary around a
300px desktop target and reduce on narrow screens. The final row does not stretch
above the target height, so it may leave space at the right edge. Layout updates
on container resizing and variant changes, without changing document order.
Thumbnail `sizes` tracks actual card widths for responsive image selection.
Without JavaScript, the gallery falls back to a responsive, uncropped CSS grid.
No gallery library or React hydration is required.

### Adding photos

Place browser-viewable originals in `src/images/engagement/colour/` and
`src/images/engagement/bw/`. Each photo needs an exact matching filename in both
folders (including extension and capitalization). Supported formats are JPEG,
PNG, WebP, and AVIF. Keep originals at their supplied resolution; the build
generates WebP thumbnails at up to 360/720/1080 pixels wide and high-quality
viewer previews at up to 1280/1920/2560 pixels wide, without upscaling.

Pairs are naturally sorted by filename and displayed once, initially in colour.
Missing pairs and invalid description entries fail the build. The actual pair
count is shown in the selected-photo viewer.

Optionally add entries to `src/images/engagement/descriptions.json`:

```json
{
  "2W1A2291.JPG": {
    "alt": "Describe the people, setting, and action in this photo.",
    "caption": "Optional visible caption"
  }
}
```

Replace the example description with an accurate one. Photos without entries
use numbered labels; add meaningful descriptions before publishing for better
screen-reader access. Captions are optional.

### Loading and viewing

The gallery displays images only, with accessible alt text. Photo labels,
descriptions/captions, and the B&W switch appear only in the selected-photo viewer.
Thumbnail error messages and retry buttons appear only when loading fails.
Neutral placeholder backgrounds support both themes. Gallery image dimensions
reserve space before lazy loading. The viewer is a centered overlay, 94% of
viewport height and up to 1200px wide (94% width on smaller screens), with the
gallery visible behind its backdrop. Its image area and navigation remain stable.
B&W and View original sit beside Close on the right of the title in a single
top row. Long titles truncate visually on narrow screens. The photo caption sits on the
left of the bottom caption row, with fixed-width Previous/Next buttons on the right.
Portrait and landscape images fit
without cropping inside that area; photo details appear before loading completes.
Caption/status space and secondary controls remain reserved so loading, errors,
and different photo orientations do not move the previous/next buttons.
Only active thumbnails are lazy-loaded while browsing. The viewer's B&W switch
fetches the other version on demand; the viewer and thumbnail share that selection
for the current page visit. Opening a photo loads an optimized responsive
preview. “View original” opens the untouched active original in a new tab.
Previous/next buttons and arrow keys navigate; Escape or a click on the backdrop
outside the lightbox closes it. Clicking inside or dragging from the image onto
the backdrop does not close it.
Mobile navigation uses buttons, not custom swipe/pinch gestures. Without
JavaScript, photo links open the colour originals and switches are hidden.

All originals are public and included in the deployment. Review sensitive EXIF
metadata (especially GPS) before publishing. This album contains roughly 2 GB
of originals, so check your hosting provider's deployment/storage limits.
Keep a separate backup: this gallery is not private archival storage.

Run `pnpm build` after adding photos. The first build processes both variants
at all configured sizes and can take substantially longer than later cached
builds. Verify the post, blog listing, tags, and RSS feed before publishing.

After building, run `node --test tests/photo-gallery.test.mjs` to validate pairing,
responsive image dimensions, original-file integrity, lazy-loading markup, and
blog/tag/RSS discovery using Node's built-in test runner.

Run `node --experimental-strip-types --test tests/justified-layout.test.mjs`
to check justified row widths, aspect ratios, ordering, final-row sizing, and
invalid inputs across mobile and desktop widths (Node 22.6+).
