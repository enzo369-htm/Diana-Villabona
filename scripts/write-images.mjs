/**
 * @deprecated Tras el renombre a nombres cortos, las rutas están en
 * src/images.ts. Si vuelves a usar jpg con nombres largos, ejecuta antes:
 *   node scripts/rename-images-to-public.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.join(fileURLToPath(new URL("..", import.meta.url)), "public");
const expected = [
  "hero.jpg",
  "fuegos.jpg",
  "barro.jpg",
  "revelado.jpg",
  "revelado-copia.jpg",
  "podcast.jpg",
  "podcast-copia.jpg",
  "quien-soy.jpg",
];
for (const f of expected) {
  if (!fs.existsSync(path.join(publicDir, f))) {
    console.warn("Falta:", f);
  }
}
console.log("Comprobación en", publicDir, "hecha.");
console.log("Mapeo: ver src/images.ts y scripts/rename-images-to-public.mjs");
