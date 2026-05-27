import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ObraPortfolio, Pieza, Post } from "../types/content";
import { obrasPortfolio as seedObrasPortfolio } from "../data/portfolioSeed";
import { piezas as seedPiezas, posts as seedPosts } from "../data/seed";
import {
  clearCms,
  loadCms,
  mergeObrasPortfolioWithSeed,
  mergePiezasWithSeed,
  mergePostsWithSeed,
  saveCms,
} from "../data/contentStore";

export type ContentContextValue = {
  piezas: Pieza[];
  posts: Post[];
  obrasPortfolio: ObraPortfolio[];
  setPiezas: React.Dispatch<React.SetStateAction<Pieza[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setObrasPortfolio: React.Dispatch<React.SetStateAction<ObraPortfolio[]>>;
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

  useEffect(() => {
    saveCms({ piezas, posts, obrasPortfolio });
  }, [piezas, posts, obrasPortfolio]);

  const resetToSeed = useCallback(() => {
    clearCms();
    setPiezas(cloneSeedPiezas());
    setPosts(cloneSeedPosts());
    setObrasPortfolio(cloneSeedObrasPortfolio());
  }, []);

  const value = useMemo(
    (): ContentContextValue => ({
      piezas,
      posts,
      obrasPortfolio,
      setPiezas,
      setPosts,
      setObrasPortfolio,
      resetToSeed,
    }),
    [piezas, posts, obrasPortfolio, resetToSeed]
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
