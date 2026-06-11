import { homeConfig } from "./seed";
import type { ObraPortfolio, Pieza, Post } from "../types/content";
import { TECNICAS_PIEZA } from "../types/content";
import type { PortfolioMosaicCell } from "./portfolioImages";

export function getPiezaById(piezas: Pieza[], id: string): Pieza | undefined {
  return piezas.find((p) => p.id === id);
}

export function getPostById(posts: Post[], id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function getPiezasHome(piezas: Pieza[]): Pieza[] {
  return homeConfig.idsPiezasHome
    .map((id) => getPiezaById(piezas, id))
    .filter((p): p is Pieza => Boolean(p));
}

export function getPostDestacado(posts: Post[]): Post | undefined {
  return (
    getPostById(posts, homeConfig.idPostDestacado) ??
    posts[0]
  );
}

export const tecnicasDisponibles = ["Todas", ...TECNICAS_PIEZA] as const;

export type FiltroTecnica = (typeof tecnicasDisponibles)[number];

export function filtrarPiezas(
  lista: Pieza[],
  filtro: FiltroTecnica
): Pieza[] {
  if (filtro === "Todas") return lista;
  return lista.filter((p) => p.tecnica === filtro);
}

export function postsOrdenados(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const oa = a.orden ?? 9999;
    const ob = b.orden ?? 9999;
    if (oa !== ob) return oa - ob;
    const ta = a.fecha ? new Date(a.fecha).getTime() : 0;
    const tb = b.fecha ? new Date(b.fecha).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return a.id.localeCompare(b.id);
  });
}

export function getObraPortfolioById(
  obras: ObraPortfolio[],
  id: string
): ObraPortfolio | undefined {
  return obras.find((o) => o.id === id);
}

export function obrasPortfolioOrdenadas(obras: ObraPortfolio[]): ObraPortfolio[] {
  return [...obras].sort((a, b) => {
    const oa = a.orden ?? 9999;
    const ob = b.orden ?? 9999;
    if (oa !== ob) return oa - ob;
    return a.id.localeCompare(b.id);
  });
}

export function obrasToMosaicCells(obras: ObraPortfolio[]): PortfolioMosaicCell[] {
  return obrasPortfolioOrdenadas(obras)
    .map((o) => ({
      obraId: o.id,
      titulo: o.titulo,
      src: o.imagenes[0]?.trim() ?? "",
    }))
    .filter((c) => c.src);
}
