/**
 * gen-favicons-v2.mjs
 * ───────────────────
 * Generates a production-ready favicon set from the Meptrasoft master SVG.
 *
 * Source : public/assets/Meptrasoft_Master_V1-01.svg  (2000×2000 viewBox)
 * Output : public/  (served from site root)
 *
 * Produced files
 * ──────────────
 *  favicon.svg              — cleaned SVG with white bg square (link-first modern)
 *  favicon.ico              — multi-res ICO  (16/32/48)
 *  favicon-16x16.png        — transparent-free 16 × 16
 *  favicon-32x32.png        — transparent-free 32 × 32
 *  favicon-48x48.png        — transparent-free 48 × 48
 *  apple-touch-icon.png     — 180 × 180, white bg
 *  android-chrome-192x192.png — 192 × 192, white bg
 *  android-chrome-512x512.png — 512 × 512, white bg  (also used as maskable)
 *
 * Run:
 *   npm install --no-save sharp png-to-ico
 *   node scripts/gen-favicons-v2.mjs
 */

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_SVG = join(root, "public", "assets", "Meptrasoft_Master_V1-01.svg");
const out = (f) => join(root, "public", f);

// ── Design tokens ────────────────────────────────────────────────────────────
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
// Padding factor: 11% on top/bottom -> logo height is 78% of the canvas
const PAD_FACTOR = 0.11;

// ── Helper: render SVG → flat white-bg PNG with trimmed padding ────────────────
async function renderTile(canvasSize, outputFile) {
  const targetSize = Math.round(canvasSize * (1 - PAD_FACTOR * 2));

  // 1. Rasterise the SVG trimmed to remove built-in empty borders
  const logoBuffer = await sharp(SRC_SVG)
    .trim()
    .resize({
      width: targetSize,
      height: targetSize,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // 2. Create white square canvas and composite logo centred on it
  await sharp({
    create: {
      width:      canvasSize,
      height:     canvasSize,
      channels:   4,
      background: WHITE,
    },
  })
    .composite([{ input: logoBuffer, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(outputFile);

  console.log(`  ✓  ${outputFile.replace(root + "\\", "").replace(root + "/", "")}  (${canvasSize}×${canvasSize}, optimized)`);
}

// ── Helper: render SVG → rounded-square PNG with trimmed padding ────────────────
async function renderRounded(canvasSize, cornerRadius, outputFile) {
  const targetSize = Math.round(canvasSize * (1 - PAD_FACTOR * 2));

  // 1. Rasterise the SVG trimmed
  const logoBuffer = await sharp(SRC_SVG)
    .trim()
    .resize({
      width: targetSize,
      height: targetSize,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // SVG mask for rounded corners
  const r = cornerRadius;
  const s = canvasSize;
  const roundedMask = Buffer.from(
    `<svg><rect x="0" y="0" width="${s}" height="${s}" rx="${r}" ry="${r}" fill="white"/></svg>`
  );

  // Build white square, composite logo, then apply rounded mask
  const flatPng = await sharp({
    create: { width: s, height: s, channels: 4, background: WHITE },
  })
    .composite([{ input: logoBuffer, gravity: "centre" }])
    .png()
    .toBuffer();

  await sharp(flatPng)
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(outputFile);

  console.log(`  ✓  ${outputFile.replace(root + "\\", "").replace(root + "/", "")}  (${s}×${s}, rounded r=${r}, optimized)`);
}

// ── favicon.svg ───────────────────────────────────────────────────────────────
async function buildSvgFavicon() {
  const original = await readFile(SRC_SVG, "utf-8");

  // Adjust the viewBox to zoom in and match the 11% padding (logo height is 78% of viewBox)
  // Master SVG dimensions of path bounds are: left=203, top=143, width=1594, height=1713
  // Target viewBox size = 1713 / 0.78 = 2196.15 -> round to 2196
  // min-y = 143 - (2196 - 1713)/2 = -98.5
  // min-x = 203 - (2196 - 1594)/2 = -98
  const updatedViewBox = original
    .replace('viewBox="0 0 2000 2000"', 'viewBox="-98 -98.5 2196 2196"')
    .replace(
      /(<svg[^>]*>)/,
      `$1\n  <rect x="-150" y="-150" width="2300" height="2300" fill="#ffffff"/>`
    );

  await writeFile(out("favicon.svg"), updatedViewBox, "utf-8");
  console.log(`  ✓  public/favicon.svg  (SVG with optimized viewBox & white bg)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("\n🎨  Meptrasoft favicon generator v2 (Optimized for small sizes)");
console.log("    Source :", SRC_SVG);
console.log("    Output : public/\n");

// 1. Flat white-bg PNGs for browser tabs
await renderTile(16,  out("favicon-16x16.png"));
await renderTile(32,  out("favicon-32x32.png"));
await renderTile(48,  out("favicon-48x48.png"));

// 2. Apple touch icon
await renderTile(180, out("apple-touch-icon.png"));

// 3. Android / PWA
const r192 = Math.round(192 * 0.20);   // ~20% corner radius
const r512 = Math.round(512 * 0.20);
await renderRounded(192, r192, out("android-chrome-192x192.png"));
await renderRounded(512, r512, out("android-chrome-512x512.png"));

// 4. Multi-res favicon.ico (16/32/48)
const ico = await pngToIco([
  out("favicon-16x16.png"),
  out("favicon-32x32.png"),
  out("favicon-48x48.png"),
]);
await writeFile(out("favicon.ico"), ico);
console.log(`  ✓  public/favicon.ico  (16+32+48 multi-res)`);

// 5. SVG favicon
await buildSvgFavicon();

console.log("\n✅  All favicon files generated and optimized successfully.\n");
