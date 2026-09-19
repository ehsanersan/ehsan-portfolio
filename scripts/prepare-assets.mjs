import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const base = "C:/Users/CP-PC/Downloads/";
const sources = {
  hero:
    base +
    "u3976147425_a_side_profile_photograph_of_a_bearded_man_captur_8fd95eaa-6f98-41f0-b999-5458ba32a440_0.png",
  portrait: "C:/Users/CP-PC/Desktop/Desktop Shahrivar 1405/DS907051.jpg",
  noir:
    base +
    "u3976147425_a_minimalist_monochrome_low_key_portrait_of_a_man_0d8bc5c4-db33-43a7-b20e-b5c6e841d6c8_2.png",
  peanut: base + "Max_a_PEANUT_DREAM._“Ever.png",
  rice: base + "Max_a_Ultra-high-quality,_ (1).png",
  chicken:
    base +
    "u3976147425_Create_a_premium_advertising_hero_shot_of_the_exa_7d14ab28-d071-4eca-b300-ef3fc76b668c_0.png",
  dolmeh: base + "Max_a_Create_a_3x3_grid_of.png",
  lentil: base + "Max_a_Create_a_premium_lux (3).png",
  kushka: base + "Max_a_Create_a_premium_lux (1).png",
  shrimp: base + "Max_a_Create_a_premium_lux.png",
  stew: base + "Max_a_Create_a_3×3_grid_in.png",
  writer: base + "Man_writing_at_desk_2K_202607291149.jpeg",
};
await mkdir("public/images", { recursive: true });
for (const [name, path] of Object.entries(sources)) {
  const result = await sharp(path)
    .rotate()
    .resize({
      width: 1800,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 88, effort: 5 })
    .toFile(`public/images/${name}.webp`);
  console.log(
    name,
    result.width,
    result.height,
    Math.round(result.size / 1024) + " KB",
  );
}
