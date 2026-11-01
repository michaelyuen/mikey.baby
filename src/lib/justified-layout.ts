export interface JustifiedRow {
  height: number;
  start: number;
  widths: number[];
}

export function justifiedRows(
  ratios: number[],
  containerWidth: number,
  gap = 16,
  targetHeight = 300,
): JustifiedRow[] {
  if (
    !Number.isFinite(containerWidth) ||
    containerWidth <= 0 ||
    !Number.isFinite(gap) ||
    gap < 0 ||
    gap >= containerWidth ||
    !Number.isFinite(targetHeight) ||
    targetHeight <= 0 ||
    ratios.some((ratio) => !Number.isFinite(ratio) || ratio <= 0)
  ) {
    throw new Error(
      "Justified gallery: expected positive dimensions and aspect ratios, with a gap smaller than the container.",
    );
  }
  const target = Math.min(targetHeight, containerWidth * 0.65);
  const rows: JustifiedRow[] = [];
  let start = 0;
  while (start < ratios.length) {
    let end = start + 1;
    let sum = ratios[start];
    let height = containerWidth / sum;
    while (height > target && end < ratios.length) {
      const nextSum = sum + ratios[end];
      const available = containerWidth - gap * (end - start);
      if (available <= 0) break;
      const nextHeight = available / nextSum;
      if (nextHeight < target && target - nextHeight > height - target) break;
      sum = nextSum;
      height = nextHeight;
      end++;
    }
    if (end === ratios.length) height = Math.min(height, target);
    // Leave a subpixel allowance so flex rounding cannot push a card to another row.
    height -= 0.02 / sum;
    rows.push({
      height,
      start,
      widths: ratios.slice(start, end).map((ratio) => ratio * height),
    });
    start = end;
  }
  return rows;
}
