import type { Taller } from "../types/content";
import { TALLERES_GRILLA_MAX } from "../types/content";

export function talleresOrdenados(talleres: Taller[]): Taller[] {
  return [...talleres].sort((a, b) => {
    const oa = a.orden ?? 9999;
    const ob = b.orden ?? 9999;
    if (oa !== ob) return oa - ob;
    return a.id.localeCompare(b.id);
  });
}

export function talleresParaGrilla(
  talleres: Taller[],
  max = TALLERES_GRILLA_MAX
): Taller[] {
  return talleresOrdenados(talleres).slice(0, max);
}
