// One-off favicon generator. Source: public/assets/favicon.png (1024x1024).
// Outputs the standard set into public/ (served from site root by Vite/Vercel).
// Run: npm install --no-save sharp png-to-ico && node scripts/gen-favicons.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "public", "assets", "favicon.png");
const out = (f) => join(root, "public", f);
const NAVY = { r: 15, g: 47, b: 80, alpha: 1 }; // #0f2f50

const png = (size, file, bg) =>
  sharp(SRC)
    .resize(size, size, { fit: "contain", background: bg || { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten(bg ? { background: bg } : false)
    .png()
    .toFile(out(file));

// Transparent PNGs (browser tabs, Android, Google)
await png(16, "favicon-16x16.png");
await png(32, "favicon-32x32.png");
await png(48, "favicon-48x48.png");
await png(192, "android-chrome-192x192.png");
await png(512, "android-chrome-512x512.png");
// Apple touch icon — flattened on brand navy (iOS shows no transparency well)
await png(180, "apple-touch-icon.png", NAVY);

// Multi-resolution favicon.ico (16/32/48) — for legacy + Google Search
const ico = await pngToIco([out("favicon-16x16.png"), out("favicon-32x32.png"), out("favicon-48x48.png")]);
await writeFile(out("favicon.ico"), ico);

console.log("favicons generated:", [
  "favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
  "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png",
].join(", "));
