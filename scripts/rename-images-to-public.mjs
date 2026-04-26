/**
 * Renombra jpg con nombres largos/unicode a nombres ASCII en public/
 * (evita 404 por NFC/NFD y codificación de URL en el dev server).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.join(fileURLToPath(new URL("..", import.meta.url)), "public");
const finalNames = {
  hero: "hero.jpg",
  fuegos: "fuegos.jpg",
  barro: "barro.jpg",
  revelado: "revelado.jpg",
  reveladoCopia: "revelado-copia.jpg",
  podcast: "podcast.jpg",
  podcastCopia: "podcast-copia.jpg",
  quienSoy: "quien-soy.jpg",
};

function mapFile(f) {
  if (f === "quiensoy.jpg") return "quienSoy";
  if (f.startsWith("Los ")) return "hero";
  if (f.startsWith("Hoy agradezco")) return "fuegos";
  if (f.startsWith("El barro")) return "barro";
  if (f.startsWith("Revelado de")) return "revelado";
  if (f.startsWith("Copia de Revelado")) return "reveladoCopia";
  if (f.startsWith("Estos ") && !f.startsWith("Copia de Estos")) return "podcast";
  if (f.startsWith("Copia de Estos")) return "podcastCopia";
  return null;
}

const files = fs.readdirSync(publicDir).filter((f) => f.toLowerCase().endsWith(".jpg"));
const fromKey = new Map();
for (const f of files) {
  if (f === "hero.jpg" || f === "fuegos.jpg" /* etc - already normalized */) continue;
  const key = mapFile(f);
  if (key) {
    if (fromKey.has(key)) {
      console.warn("Duplicate for", key, f);
    }
    fromKey.set(key, f);
  }
}

for (const [key, destName] of Object.entries(finalNames)) {
  const from = fromKey.get(key);
  if (!from) {
    if (fs.existsSync(path.join(publicDir, destName))) {
      continue;
    }
    throw new Error("No mapeo para " + key);
  }
  const toPath = path.join(publicDir, destName);
  const fromPath = path.join(publicDir, from);
  if (from === destName) continue;
  if (fs.existsSync(toPath) && from !== destName) {
    fs.rmSync(toPath);
  }
  fs.renameSync(fromPath, toPath);
  console.log("OK:", from, "->", destName);
}

console.log("Listo en", publicDir);
