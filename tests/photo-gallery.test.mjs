import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

import sharp from "sharp";

const root = new URL("../", import.meta.url);
const html = await readFile(
  new URL("dist/posts/i-got-engaged/index.html", root),
  "utf8",
);
const manifest = html.match(
  /<script[^>]*data-gallery-photos[^>]*>(.*?)<\/script>/s,
);
assert.ok(
  manifest,
  "Build the site with pnpm build before running these tests.",
);
const photos = JSON.parse(manifest[1]);
const asset = (src) => new URL(`dist${src}`, root);
const widths = (source) =>
  source.srcset.split(", ").map((entry) => {
    const [src, width] = entry.split(" ");
    return { src, width: Number.parseInt(width, 10) };
  });

test("every source pair appears once in natural filename order", async () => {
  const colour = await readdir(new URL("src/images/engagement/colour/", root));
  const bw = await readdir(new URL("src/images/engagement/bw/", root));
  const supported = /\.(avif|jpeg|jpg|png|webp)$/i;
  const collator = new Intl.Collator("en", { numeric: true });
  const names = colour
    .filter((name) => supported.test(name))
    .sort((a, b) => collator.compare(a, b) || a.localeCompare(b, "en"));
  assert.deepEqual(
    [...names].sort(),
    bw.filter((name) => supported.test(name)).sort(),
  );
  assert.deepEqual(
    photos.map((photo) => photo.filename),
    names,
  );
  assert.equal((html.match(/<figure /g) ?? []).length, names.length);
});

test("derivatives have the promised widths and originals remain untouched", async () => {
  for (const photo of photos) {
    for (const variant of ["colour", "bw"]) {
      const image = photo[variant];
      const source = await readFile(
        new URL(`src/images/engagement/${variant}/${photo.filename}`, root),
      );
      const delivered = await readFile(asset(image.original));
      const hash = (buffer) =>
        createHash("sha256").update(buffer).digest("hex");
      assert.equal(
        hash(source),
        hash(delivered),
        `${variant}/${photo.filename} original`,
      );
      const original = await sharp(source).metadata();
      for (const [tier, sizes] of [
        ["thumbnail", [360, 720, 1080]],
        ["viewer", [1280, 1920, 2560]],
      ]) {
        const derivatives = widths(image[tier]);
        assert.deepEqual(
          derivatives.map((entry) => entry.width),
          [...new Set(sizes.map((size) => Math.min(size, original.width)))],
        );
        for (const derivative of derivatives) {
          const path = fileURLToPath(asset(derivative.src));
          const metadata = await sharp(path).metadata();
          assert.equal(metadata.format, "webp");
          assert.equal(metadata.width, derivative.width);
          assert.equal(
            metadata.exif,
            undefined,
            "Derivatives should not retain EXIF.",
          );
          assert.ok(
            (await stat(path)).size < source.length,
            "Derivative should be smaller than original.",
          );
        }
      }
    }
  }
});

test("initial HTML contains only lazy colour thumbnails and native original links", () => {
  const cards = [...html.matchAll(/<figure\b.*?<\/figure>/gs)];
  assert.equal(cards.length, photos.length);
  for (const [index, card] of cards.entries()) {
    const markup = card[0];
    assert.equal((markup.match(/<img /g) ?? []).length, 1);
    assert.match(markup, /loading="lazy"/);
    assert.ok(markup.includes(photos[index].colour.thumbnail.src));
    assert.ok(markup.includes(`href="${photos[index].colour.original}"`));
    assert.ok(!markup.includes(photos[index].bw.thumbnail.src));
    assert.doesNotMatch(markup, /data-toggle|card-controls|<figcaption/);
    assert.match(markup, /data-thumbnail-retry[^>]*hidden/);
  }
  assert.match(html, /<dialog /);
  assert.match(html, /data-viewer-toggle/);
  assert.match(html, /data-viewer-caption/);
  assert.match(html, /<noscript>/);
});

test("MDX post retains its blog, tag, and RSS discovery", async () => {
  for (const path of [
    "blog/index.html",
    "tags/engagement/index.html",
    "rss.xml",
  ]) {
    const text = await readFile(new URL(`dist/${path}`, root), "utf8");
    assert.ok(text.includes("/posts/i-got-engaged"), `Post missing in ${path}`);
  }
  const tags = await readFile(new URL("dist/tags/index.html", root), "utf8");
  assert.ok(tags.includes("/tags/engagement"));
});
