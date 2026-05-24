import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Pieza, Post } from "../types/content";
import { piezas as seedPiezas, posts as seedPosts } from "../data/seed";
import { clearCms, loadCms, mergePiezasWithSeed, mergePostsWithSeed, saveCms } from "../data/contentStore";

export type ContentContextValue = {
  piezas: Pieza[];
  posts: Post[];
  setPiezas: React.Dispatch<React.SetStateAction<Pieza[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  resetToSeed: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function cloneSeedPiezas(): Pieza[] {
  return JSON.parse(JSON.stringify(seedPiezas)) as Pieza[];
}

function cloneSeedPosts(): Post[] {
  return JSON.parse(JSON.stringify(seedPosts)) as Post[];
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

  useEffect(() => {
    saveCms({ piezas, posts });
  }, [piezas, posts]);

  const resetToSeed = useCallback(() => {
    clearCms();
    setPiezas(cloneSeedPiezas());
    setPosts(cloneSeedPosts());
  }, []);

  const value = useMemo(
    (): ContentContextValue => ({
      piezas,
      posts,
      setPiezas,
      setPosts,
      resetToSeed,
    }),
    [piezas, posts, resetToSeed]
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
