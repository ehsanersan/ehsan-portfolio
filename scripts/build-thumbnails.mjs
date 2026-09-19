import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
await mkdir("public/images/responsive", { recursive: true });
for (const file of await readdir("public/images")) {
  if (!file.endsWith(".webp")) continue;
  for (const width of [320, 640, 960, 1440, 1920]) {
    await sharp(`public/images/${file}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(
        `public/images/responsive/${file.replace(".webp", "")}-${width}.webp`,
      );
  }
}
console.log("Responsive WebP thumbnails generated.");
