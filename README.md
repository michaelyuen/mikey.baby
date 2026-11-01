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

The engagement post embeds a native Astro gallery with an uncropped CSS-column
layout and a native dialog viewer. Columns read top-to-bottom, then left-to-right.
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
count is shown in the gallery.

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

Only active thumbnails are lazy-loaded while browsing. Per-photo B&W switches
fetch the other thumbnail on demand; the viewer and card share that selection
for the current page visit. Opening a photo loads an optimized responsive
preview. “View original” opens the untouched active original in a new tab.
Previous/next buttons and arrow keys navigate; Escape closes the dialog.
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
