import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ObraPortfolio, Pieza, Post, Taller } from "../types/content";
import { obrasPortfolio as seedObrasPortfolio } from "../data/portfolioSeed";
import { piezas as seedPiezas, posts as seedPosts, talleres as seedTalleres } from "../data/seed";
import {
  clearCms,
  loadCms,
  mergeObrasPortfolioWithSeed,
  mergePiezasWithSeed,
  mergePostsWithSeed,
  mergeTalleresWithSeed,
  saveCms,
} from "../data/contentStore";

export type ContentContextValue = {
  piezas: Pieza[];
  posts: Post[];
  obrasPortfolio: ObraPortfolio[];
  talleres: Taller[];
  setPiezas: React.Dispatch<React.SetStateAction<Pieza[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setObrasPortfolio: React.Dispatch<React.SetStateAction<ObraPortfolio[]>>;
  setTalleres: React.Dispatch<React.SetStateAction<Taller[]>>;
  resetToSeed: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function cloneSeedPiezas(): Pieza[] {
  return JSON.parse(JSON.stringify(seedPiezas)) as Pieza[];
}

function cloneSeedPosts(): Post[] {
  return JSON.parse(JSON.stringify(seedPosts)) as Post[];
}

function cloneSeedObrasPortfolio(): ObraPortfolio[] {
  return JSON.parse(JSON.stringify(seedObrasPortfolio)) as ObraPortfolio[];
}

function cloneSeedTalleres(): Taller[] {
  return JSON.parse(JSON.stringify(seedTalleres)) as Taller[];
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [piezas, setPiezas] = useState<Pieza[]>(() => {
    const s = loadCms();
    return mergePiezasWithSeed(s?.piezas ?? null, cloneSeedPiezas());
  });
  const [posts, setPosts] = useState<Post[]>(() => {
    const s = loadCms();
    return mergePostsWithSeed(s?.posts ?? null, cloneSeedPosts());
  });
  const [obrasPortfolio, setObrasPortfolio] = useState<ObraPortfolio[]>(() => {
    const s = loadCms();
    return mergeObrasPortfolioWithSeed(
      s?.obrasPortfolio ?? null,
      cloneSeedObrasPortfolio()
    );
  });
  const [talleres, setTalleres] = useState<Taller[]>(() => {
    const s = loadCms();
    return mergeTalleresWithSeed(s?.talleres ?? null, cloneSeedTalleres());
  });

  useEffect(() => {
    saveCms({ piezas, posts, obrasPortfolio, talleres });
  }, [piezas, posts, obrasPortfolio, talleres]);

  const resetToSeed = useCallback(() => {
    clearCms();
    setPiezas(cloneSeedPiezas());
    setPosts(cloneSeedPosts());
    setObrasPortfolio(cloneSeedObrasPortfolio());
    setTalleres(cloneSeedTalleres());
  }, []);

  const value = useMemo(
    (): ContentContextValue => ({
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      setPiezas,
      setPosts,
      setObrasPortfolio,
      setTalleres,
      resetToSeed,
    }),
    [piezas, posts, obrasPortfolio, talleres, resetToSeed]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent debe usarse dentro de ContentProvider");
  }
  return ctx;
}
