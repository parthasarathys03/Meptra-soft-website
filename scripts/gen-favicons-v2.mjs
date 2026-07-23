/**
 * gen-favicons-v2.mjs
 * ───────────────────
 * Generates a production-ready favicon set with ChatGPT-style rounded white square backgrounds (20% radius).
 *
 * Source : public/assets/Meptrasoft_Master_V1-01.svg  (2000×2000 viewBox)
 * Output : public/  (served from site root)
 *
 * Produced files
 * ──────────────
 *  favicon.svg              — SVG with 20% rounded white square background
 *  favicon.ico              — multi-res ICO  (16/32/48) with 20% rounded white square
 *  favicon-16x16.png        — 16 × 16 PNG, 20% rounded white bg, transparent corners
 *  favicon-32x32.png        — 32 × 32 PNG, 20% rounded white bg, transparent corners
 *  favicon-48x48.png        — 48 × 48 PNG, 20% rounded white bg, transparent corners
 *  apple-touch-icon.png     — 180 × 180 PNG, 20% rounded white bg, transparent corners
 *  android-chrome-192x192.png — 192 × 192 PNG, 20% rounded white bg, transparent corners
 *  android-chrome-512x512.png — 512 × 512 PNG, 20% rounded white bg, transparent corners
 *
 * Run:
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
// Padding factor: 11% on each side -> logo height/width is 78% of canvas
const PAD_FACTOR = 0.11;
// Corner radius factor: 20% of canvas size (ChatGPT icon style)
const RADIUS_FACTOR = 0.20;

// ── Helper: render SVG → rounded-square PNG with white background & transparent outer corners ──
async function renderRounded(canvasSize, outputFile) {
  const targetSize = Math.round(canvasSize * (1 - PAD_FACTOR * 2));
  const cornerRadius = Math.round(canvasSize * RADIUS_FACTOR);

  // 1. Rasterise the SVG trimmed to remove empty borders
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

  // 2. SVG mask for rounded corners
  const r = cornerRadius;
  const s = canvasSize;
  const roundedMask = Buffer.from(
    `<svg width="${s}" height="${s}"><rect x="0" y="0" width="${s}" height="${s}" rx="${r}" ry="${r}" fill="white"/></svg>`
  );

  // 3. Build solid white canvas, composite centered logo, apply rounded corner mask
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

  console.log(`  ✓  ${outputFile.replace(root + "\\", "").replace(root + "/", "")}  (${s}×${s}, 20% rounded corner radius: ${r}px)`);
}

// ── favicon.svg ───────────────────────────────────────────────────────────────
async function buildSvgFavicon() {
  const original = await readFile(SRC_SVG, "utf-8");

  // Adjust viewBox to zoom in and match 11% padding (viewBox size = 2196)
  // 20% rounded corner radius for viewBox 2196 is Math.round(2196 * 0.20) = 439
  const updatedViewBox = original
    .replace('viewBox="0 0 2000 2000"', 'viewBox="-98 -98.5 2196 2196"')
    .replace(
      /(<svg[^>]*>)/,
      `$1\n  <rect x="-98" y="-98.5" width="2196" height="2196" rx="439" ry="439" fill="#ffffff"/>`
    );

  await writeFile(out("favicon.svg"), updatedViewBox, "utf-8");
  console.log(`  ✓  public/favicon.svg  (SVG with 20% rounded white square background)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("\n🎨  Meptrasoft favicon generator (ChatGPT Style - 20% Rounded White Square)");
console.log("    Source :", SRC_SVG);
console.log("    Output : public/\n");

// 1. All PNG sizes rendered with 20% rounded white square background & transparent outer corners
await renderRounded(16,  out("favicon-16x16.png"));
await renderRounded(32,  out("favicon-32x32.png"));
await renderRounded(48,  out("favicon-48x48.png"));
await renderRounded(180, out("apple-touch-icon.png"));
await renderRounded(192, out("android-chrome-192x192.png"));
await renderRounded(512, out("android-chrome-512x512.png"));

// 2. Multi-resolution favicon.ico (16/32/48)
const ico = await pngToIco([
  out("favicon-16x16.png"),
  out("favicon-32x32.png"),
  out("favicon-48x48.png"),
]);
await writeFile(out("favicon.ico"), ico);
console.log(`  ✓  public/favicon.ico  (16+32+48 multi-res with rounded corners)`);

// 3. SVG favicon
await buildSvgFavicon();

console.log("\n✅  All ChatGPT-style rounded white favicons generated successfully.\n");
