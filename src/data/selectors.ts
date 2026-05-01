import { homeConfig, piezas, posts } from "./seed";
import type { Pieza, Post } from "../types/content";

export function getPiezaById(id: string): Pieza | undefined {
  return piezas.find((p) => p.id === id);
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function getPiezasHome(): Pieza[] {
  return homeConfig.idsPiezasHome
    .map((id) => getPiezaById(id))
    .filter((p): p is Pieza => Boolean(p));
}

export function getPostDestacado(): Post | undefined {
  return getPostById(homeConfig.idPostDestacado) ?? posts[0];
}

export const tecnicasDisponibles = [
  "Todas",
  "Raku",
  "Saggar",
  "Obvara",
  "Esmaltes",
  "Modelado",
  "Otro",
] as const;

export type FiltroTecnica = (typeof tecnicasDisponibles)[number];

export function filtrarPiezas(
  lista: Pieza[],
  filtro: FiltroTecnica
): Pieza[] {
  if (filtro === "Todas") return lista;
  return lista.filter((p) => p.tecnica === filtro);
}

export function postsOrdenados(): Post[] {
  return [...posts].sort((a, b) => {
    const ta = a.fecha ? new Date(a.fecha).getTime() : 0;
    const tb = b.fecha ? new Date(b.fecha).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return a.id.localeCompare(b.id);
  });
}
