import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

import descriptions from "../images/engagement/descriptions.json";

export type PhotoVariant = "bw" | "colour";

interface ImageSource {
  height: number;
  src: string;
  srcset: string;
  width: number;
}

export interface GalleryImage {
  original: string;
  thumbnail: ImageSource;
  viewer: ImageSource;
}

export interface GalleryPhoto {
  alt: string;
  bw: GalleryImage;
  caption?: string;
  colour: GalleryImage;
  filename: string;
}

const sources = import.meta.glob<{ default: ImageMetadata }>(
  "../images/engagement/{bw,colour}/*.{avif,AVIF,jpeg,JPEG,jpg,JPG,png,PNG,webp,WEBP}",
  { eager: true },
);

function inventory(variant: PhotoVariant): Map<string, ImageMetadata> {
  const images = new Map<string, ImageMetadata>();
  for (const [path, image] of Object.entries(sources)) {
    if (!path.includes(`/${variant}/`)) continue;
    const filename = path.slice(path.lastIndexOf("/") + 1);
    if (images.has(filename)) {
      throw new Error(`Engagement gallery: duplicate ${variant}/${filename}.`);
    }
    images.set(filename, image.default);
  }
  return images;
}

async function resize(
  image: ImageMetadata,
  requestedWidths: number[],
  quality: number,
): Promise<ImageSource> {
  const widths = [
    ...new Set(requestedWidths.map((width) => Math.min(width, image.width))),
  ];
  const results = await Promise.all(
    widths.map((width) =>
      getImage({ format: "webp", quality, src: image, width }),
    ),
  );
  return {
    height: Math.round((widths[0] * image.height) / image.width),
    src: results[0].src,
    srcset: results
      .map((result, index) => `${result.src} ${widths[index]}w`)
      .join(", "),
    width: widths[0],
  };
}

async function prepare(image: ImageMetadata): Promise<GalleryImage> {
  return {
    original: image.src,
    thumbnail: await resize(image, [360, 720, 1080], 80),
    viewer: await resize(image, [1280, 1920, 2560], 90),
  };
}

export async function getEngagementPhotos(): Promise<GalleryPhoto[]> {
  const colour = inventory("colour");
  const bw = inventory("bw");
  const missingBW = [...colour.keys()].filter((name) => !bw.has(name));
  const missingColour = [...bw.keys()].filter((name) => !colour.has(name));
  if (!colour.size || missingBW.length || missingColour.length) {
    throw new Error(
      `Engagement gallery: expected matching colour/B&W pairs. Missing bw: ${missingBW.join(", ") || "none"}; missing colour: ${missingColour.join(", ") || "none"}; colour count: ${colour.size}.`,
    );
  }

  const metadata: Record<string, { alt: string; caption?: string }> =
    descriptions;
  for (const [filename, description] of Object.entries(metadata)) {
    if (!colour.has(filename) || !description.alt?.trim()) {
      throw new Error(
        `Engagement gallery: invalid description for ${filename}. Supply a matching filename and non-empty alt text.`,
      );
    }
  }

  const collator = new Intl.Collator("en", { numeric: true });
  const names = [...colour.keys()].sort(
    (a, b) => collator.compare(a, b) || a.localeCompare(b, "en"),
  );
  const photos: GalleryPhoto[] = [];
  for (const [index, filename] of names.entries()) {
    const colourImage = colour.get(filename);
    const bwImage = bw.get(filename);
    if (!colourImage || !bwImage) {
      throw new Error(`Engagement gallery: incomplete pair ${filename}.`);
    }
    photos.push({
      alt: metadata[filename]?.alt ?? `Engagement photo ${index + 1}`,
      bw: await prepare(bwImage),
      caption: metadata[filename]?.caption,
      colour: await prepare(colourImage),
      filename,
    });
  }
  return photos;
}
