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
// Padding factor: 12% on each side  →  logo occupies 76% of the tile
const PAD_FACTOR = 0.12;

// ── Helper: render SVG → flat white-bg PNG at given canvas size ───────────────
async function renderTile(canvasSize, outputFile) {
  const logoSize = Math.round(canvasSize * (1 - PAD_FACTOR * 2));
  const offset   = Math.round((canvasSize - logoSize) / 2);

  // 1. Rasterise the SVG at logoSize (sharp can read SVG natively via librsvg)
  const logoBuffer = await sharp(SRC_SVG)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
    .composite([{ input: logoBuffer, left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toFile(outputFile);

  console.log(`  ✓  ${outputFile.replace(root + "\\", "").replace(root + "/", "")}  (${canvasSize}×${canvasSize})`);
}

// ── Helper: render SVG → rounded-square PNG ───────────────────────────────────
async function renderRounded(canvasSize, cornerRadius, outputFile) {
  const logoSize = Math.round(canvasSize * (1 - PAD_FACTOR * 2));
  const offset   = Math.round((canvasSize - logoSize) / 2);

  const logoBuffer = await sharp(SRC_SVG)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
    .composite([{ input: logoBuffer, left: offset, top: offset }])
    .png()
    .toBuffer();

  await sharp(flatPng)
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(outputFile);

  console.log(`  ✓  ${outputFile.replace(root + "\\", "").replace(root + "/", "")}  (${s}×${s}, rounded r=${r})`);
}

// ── favicon.svg ───────────────────────────────────────────────────────────────
async function buildSvgFavicon() {
  const original = await readFile(SRC_SVG, "utf-8");

  // Inject a white background rect before the existing path, and tighten viewBox
  // The original viewBox is "0 0 2000 2000"
  // We wrap in a group and prepend the white rect
  const withBg = original.replace(
    /(<svg[^>]*>)/,
    `$1\n  <rect width="2000" height="2000" fill="#ffffff"/>`
  );

  await writeFile(out("favicon.svg"), withBg, "utf-8");
  console.log(`  ✓  public/favicon.svg  (SVG with white bg rect)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log("\n🎨  Meptrasoft favicon generator v2");
console.log("    Source :", SRC_SVG);
console.log("    Output : public/\n");

// 1. Flat white-bg PNGs for browser tabs (small sizes — no rounding needed; shape is implied by OS chrome)
await renderTile(16,  out("favicon-16x16.png"));
await renderTile(32,  out("favicon-32x32.png"));
await renderTile(48,  out("favicon-48x48.png"));

// 2. Apple touch icon — iOS adds its own rounding mask, so use flat white square
await renderTile(180, out("apple-touch-icon.png"));

// 3. Android / PWA — use rounded square to look good as standalone app icon
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

// 5. SVG favicon (modern browsers first choice)
await buildSvgFavicon();

console.log("\n✅  All favicon files generated successfully.\n");
