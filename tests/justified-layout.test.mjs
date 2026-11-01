import assert from "node:assert/strict";
import test from "node:test";

import { justifiedRows } from "../src/lib/justified-layout.ts";

test("justified rows preserve order, ratios, and full width across viewports", () => {
  const albums = [
    Array(85).fill(2 / 3),
    Array(85).fill(3 / 2),
    Array.from({ length: 85 }, (_, index) => (index % 3 ? 2 / 3 : 3 / 2)),
  ];
  for (const width of [272, 342, 652, 1052, 1100, 1872, 2512]) {
    for (const ratios of albums) {
      const rows = justifiedRows(ratios, width);
      let count = 0;
      for (const [index, row] of rows.entries()) {
        assert.equal(row.start, count);
        assert.ok(row.height > 0);
        const used =
          row.widths.reduce((sum, value) => sum + value, 0) +
          16 * (row.widths.length - 1);
        assert.ok(used <= width);
        if (index < rows.length - 1) assert.ok(width - used < 0.1);
        else assert.ok(row.height <= Math.min(300, width * 0.65));
        row.widths.forEach((value, offset) => {
          assert.ok(
            Math.abs(value / row.height - ratios[count + offset]) < 0.00001,
          );
        });
        count += row.widths.length;
      }
      assert.equal(count, ratios.length);
    }
  }
});

test("empty albums and single photos do not stretch the final row", () => {
  assert.deepEqual(justifiedRows([], 1100), []);
  for (const ratio of [2 / 3, 3 / 2]) {
    const [row] = justifiedRows([ratio], 1100);
    assert.ok(row.height <= 300);
    assert.ok(row.widths[0] < 1100);
  }
});

test("invalid layout dimensions and ratios fail explicitly", () => {
  for (const width of [0, -1, NaN, Infinity]) {
    assert.throws(() => justifiedRows([1], width));
  }
  for (const ratio of [0, -1, NaN, Infinity]) {
    assert.throws(() => justifiedRows([ratio], 1100));
  }
  assert.throws(() => justifiedRows([1], 1100, 1100));
  assert.throws(() => justifiedRows([1], 1100, -1));
  assert.throws(() => justifiedRows([1], 1100, 16, 0));
});
