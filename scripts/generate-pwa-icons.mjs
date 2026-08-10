import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const pwaDir = path.join(dir, "..", "public", "pwa");

const icon = readFileSync(path.join(pwaDir, "icon-source.svg"));
const maskable = readFileSync(path.join(pwaDir, "icon-maskable-source.svg"));

await Promise.all([
  sharp(icon, { density: 384 }).resize(192, 192).png().toFile(path.join(pwaDir, "icon-192.png")),
  sharp(icon, { density: 384 }).resize(512, 512).png().toFile(path.join(pwaDir, "icon-512.png")),
  sharp(icon, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(path.join(pwaDir, "apple-touch-icon.png")),
  sharp(maskable, { density: 384 })
    .resize(512, 512)
    .png()
    .toFile(path.join(pwaDir, "icon-maskable-512.png")),
]);

console.log("PWA icons generated in public/pwa/");
