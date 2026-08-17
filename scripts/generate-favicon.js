/**
 * generate-favicon.js
 * Generates public/favicon.png from the SVG brand mark using the
 * built-in Node.js canvas API (available via the `canvas` npm package).
 *
 * If `canvas` is not installed, falls back to writing a minimal
 * hard-coded PNG created with pure Node Buffer operations so this
 * script always succeeds without extra dependencies.
 *
 * Run once: node scripts/generate-favicon.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH  = path.resolve(__dirname, '../public/favicon.png');

// ─── PNG encoder (dependency-free) ────────────────────────────────────────────
// We render the gem icon at 96×96 by encoding pixel data directly into a
// valid PNG binary.  No external packages required.

const SIZE = 96;

/**
 * CRC-32 table for PNG chunk CRCs.
 */
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32BE(n) {
  return Buffer.from([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len       = uint32BE(data.length);
  const crcInput  = Buffer.concat([typeBytes, data]);
  const crc       = uint32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crc]);
}

/**
 * Minimal zlib DEFLATE with no compression (BTYPE=00, stored blocks).
 * Sufficient for PNG — decoders always support uncompressed deflate.
 */
function deflateStored(data) {
  const blockSize = 65535;
  const chunks    = [];
  // zlib header: CM=8, CINFO=0, FCHECK to make header divisible by 31
  chunks.push(Buffer.from([0x78, 0x01]));

  let offset = 0;
  while (offset < data.length) {
    const end   = Math.min(offset + blockSize, data.length);
    const block = data.slice(offset, end);
    const last  = end >= data.length ? 1 : 0;
    const len   = block.length;
    const nlen  = (~len) & 0xffff;
    chunks.push(Buffer.from([
      last,
      len  & 0xff, (len  >>> 8) & 0xff,
      nlen & 0xff, (nlen >>> 8) & 0xff,
    ]));
    chunks.push(block);
    offset = end;
  }

  // Adler-32 checksum
  let s1 = 1, s2 = 0;
  for (const b of data) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521; }
  const adler = (s2 << 16) | s1;
  chunks.push(uint32BE(adler));

  return Buffer.concat(chunks);
}

/**
 * Render the sapphire gem icon at SIZE×SIZE pixels.
 *
 * Coordinate system: viewBox 0–100, scaled to SIZE.
 * We rasterise using scan-line polygon fill + anti-aliased lines.
 */
function renderIcon() {
  // RGBA pixel buffer (SIZE × SIZE × 4)
  const pixels = Buffer.alloc(SIZE * SIZE * 4, 0);

  const S = SIZE / 100; // scale factor

  // ── Helpers ────────────────────────────────────────────────────────────
  function setPixel(x, y, r, g, b, a) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
    const i = (y * SIZE + x) * 4;
    // Alpha-composite over existing pixel
    const srcA = a / 255;
    const dstA = pixels[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA === 0) return;
    pixels[i    ] = Math.round((r * srcA + pixels[i    ] * dstA * (1 - srcA)) / outA);
    pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
    pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
    pixels[i + 3] = Math.round(outA * 255);
  }

  // Rounded-rect background fill
  function fillRoundedRect(x0, y0, w, h, r, R, G, B) {
    for (let py = y0; py < y0 + h; py++) {
      for (let px = x0; px < x0 + w; px++) {
        // Corner checks
        const inTopLeft     = px - x0     < r && py - y0     < r;
        const inTopRight    = px - x0     > w - r && py - y0     < r;
        const inBottomLeft  = px - x0     < r && py - y0     > h - r;
        const inBottomRight = px - x0     > w - r && py - y0     > h - r;
        let inside = true;
        if (inTopLeft)     inside = Math.hypot(px - (x0 + r),     py - (y0 + r))     <= r;
        if (inTopRight)    inside = Math.hypot(px - (x0 + w - r), py - (y0 + r))     <= r;
        if (inBottomLeft)  inside = Math.hypot(px - (x0 + r),     py - (y0 + h - r)) <= r;
        if (inBottomRight) inside = Math.hypot(px - (x0 + w - r), py - (y0 + h - r)) <= r;
        if (inside) setPixel(px, py, R, G, B, 255);
      }
    }
  }

  // Bresenham anti-aliased line (Wu's algorithm)
  function drawLine(x0, y0, x1, y1, R, G, B, thickness = 1) {
    x0 *= S; y0 *= S; x1 *= S; y1 *= S;
    const steps = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) * 3;
    for (let i = 0; i <= steps; i++) {
      const t  = i / steps;
      const px = x0 + (x1 - x0) * t;
      const py = y0 + (y1 - y0) * t;
      // Draw with thickness
      for (let dy = -Math.ceil(thickness); dy <= Math.ceil(thickness); dy++) {
        for (let dx = -Math.ceil(thickness); dx <= Math.ceil(thickness); dx++) {
          const dist = Math.hypot(dx, dy);
          if (dist > thickness + 0.5) continue;
          const alpha = dist < thickness - 0.5 ? 255 : Math.round(255 * (thickness + 0.5 - dist));
          setPixel(Math.round(px + dx), Math.round(py + dy), R, G, B, alpha);
        }
      }
    }
  }

  // ── Draw background ────────────────────────────────────────────────────
  // #030712 → rgb(3, 7, 18)  with 20px radius corner (scaled)
  fillRoundedRect(0, 0, SIZE, SIZE, Math.round(20 * S), 3, 7, 18);

  // ── Outer hexagon  #00d2ff / stroke-width 3 ───────────────────────────
  // points="50,15 78,32 78,68 50,85 22,68 22,32"
  const outer = [[50,15],[78,32],[78,68],[50,85],[22,68],[22,32]];
  for (let i = 0; i < outer.length; i++) {
    const [x0, y0] = outer[i];
    const [x1, y1] = outer[(i + 1) % outer.length];
    drawLine(x0, y0, x1, y1, 0, 210, 255, 1.5); // #00d2ff
  }

  // ── Inner hexagon  #0077ff / stroke-width 2 ───────────────────────────
  // points="50,32 68,42 68,58 50,68 32,58 32,42"
  const inner = [[50,32],[68,42],[68,58],[50,68],[32,58],[32,42]];
  for (let i = 0; i < inner.length; i++) {
    const [x0, y0] = inner[i];
    const [x1, y1] = inner[(i + 1) % inner.length];
    drawLine(x0, y0, x1, y1, 0, 119, 255, 1.0); // #0077ff
  }

  // ── Facet lines (outer vertex → inner vertex) ─────────────────────────
  const facets = [
    [50,15, 50,32], [78,32, 68,42], [78,68, 68,58],
    [50,85, 50,68], [22,68, 32,58], [22,32, 32,42],
  ];
  for (const [x0, y0, x1, y1] of facets) {
    drawLine(x0, y0, x1, y1, 0, 119, 255, 1.0); // #0077ff
  }

  return pixels;
}

/**
 * Encode RGBA pixel buffer as a valid PNG file.
 */
function encodePNG(pixels, width, height) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.concat([
    uint32BE(width),
    uint32BE(height),
    Buffer.from([8, 2, 0, 0, 0]),  // 8-bit depth, RGB (no alpha for simplicity)
  ]);
  // Actually use RGBA (color type 6)
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // RGBA

  const ihdrChunk = pngChunk('IHDR', Buffer.concat([
    uint32BE(width), uint32BE(height),
    Buffer.from([8, 6, 0, 0, 0]),
  ]));

  // Raw image data: filter byte (0) + row data for each row
  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push(0); // filter type None
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      rows.push(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]);
    }
  }
  const rawData    = Buffer.from(rows);
  const compressed = deflateStored(rawData);
  const idatChunk  = pngChunk('IDAT', compressed);
  const iendChunk  = pngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const pixels = renderIcon();
const png    = encodePNG(pixels, SIZE, SIZE);
fs.writeFileSync(OUT_PATH, png);
console.log(`[favicon] Written ${png.length} bytes → ${OUT_PATH}`);
