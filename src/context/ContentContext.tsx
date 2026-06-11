import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  type StoredCms,
} from "../data/contentStore";
import { getAdminPassphrase } from "../lib/adminAuth";
import {
  fetchRemoteCatalog,
  isRemoteCmsEnabled,
  saveRemoteCatalog,
} from "../data/remoteCms";

export type CmsSyncState = "idle" | "loading" | "synced" | "local" | "error";

export type ContentContextValue = {
  piezas: Pieza[];
  posts: Post[];
  obrasPortfolio: ObraPortfolio[];
  talleres: Taller[];
  cmsReady: boolean;
  cmsSyncState: CmsSyncState;
  cmsUsesCloud: boolean;
  setPiezas: React.Dispatch<React.SetStateAction<Pieza[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setObrasPortfolio: React.Dispatch<React.SetStateAction<ObraPortfolio[]>>;
  setTalleres: React.Dispatch<React.SetStateAction<Taller[]>>;
  resetToSeed: () => Promise<void>;
  pushCatalogToCloud: (catalog?: StoredCms) => Promise<void>;
  persistCatalog: (catalog: StoredCms) => Promise<void>;
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

export function buildCatalog(
  piezas: Pieza[],
  posts: Post[],
  obrasPortfolio: ObraPortfolio[],
  talleres: Taller[]
): StoredCms {
  return { piezas, posts, obrasPortfolio, talleres };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const usesCloud = isRemoteCmsEnabled();
  const [cmsReady, setCmsReady] = useState(!usesCloud);
  const [cmsSyncState, setCmsSyncState] = useState<CmsSyncState>(
    usesCloud ? "loading" : "local"
  );
  const hydrated = useRef(false);

  const [piezas, setPiezas] = useState<Pieza[]>(cloneSeedPiezas);
  const [posts, setPosts] = useState<Post[]>(cloneSeedPosts);
  const [obrasPortfolio, setObrasPortfolio] = useState<ObraPortfolio[]>(
    cloneSeedObrasPortfolio
  );
  const [talleres, setTalleres] = useState<Taller[]>(cloneSeedTalleres);

  const applyStored = useCallback((stored: StoredCms | null) => {
    setPiezas(mergePiezasWithSeed(stored?.piezas ?? null, cloneSeedPiezas()));
    setPosts(mergePostsWithSeed(stored?.posts ?? null, cloneSeedPosts()));
    setObrasPortfolio(
      mergeObrasPortfolioWithSeed(
        stored?.obrasPortfolio ?? null,
        cloneSeedObrasPortfolio()
      )
    );
    setTalleres(
      mergeTalleresWithSeed(stored?.talleres ?? null, cloneSeedTalleres())
    );
  }, []);

  const pushCatalogToCloud = useCallback(
    async (catalog?: StoredCms) => {
      if (!usesCloud) return;
      const payload =
        catalog ??
        buildCatalog(piezas, posts, obrasPortfolio, talleres);
      await saveRemoteCatalog(payload);
      setCmsSyncState("synced");
    },
    [piezas, posts, obrasPortfolio, talleres, usesCloud]
  );

  const persistCatalog = useCallback(
    async (catalog: StoredCms) => {
      if (usesCloud) {
        await pushCatalogToCloud(catalog);
        return;
      }
      if (!saveCms(catalog)) {
        throw new Error(
          "No se pudo guardar en este navegador (almacenamiento lleno)."
        );
      }
      setCmsSyncState("local");
    },
    [pushCatalogToCloud, usesCloud]
  );

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!usesCloud) {
        applyStored(loadCms());
        hydrated.current = true;
        setCmsReady(true);
        setCmsSyncState("local");
        return;
      }

      setCmsSyncState("loading");
      try {
        const remote = await fetchRemoteCatalog();
        if (cancelled) return;

        if (remote) {
          clearCms();
          applyStored(remote);
          saveCms(remote);
          setCmsSyncState("synced");
        } else {
          clearCms();
          applyStored(null);
          setCmsSyncState("synced");
        }
      } catch (err) {
        console.warn("[CMS] No se pudo cargar desde la nube:", err);
        if (!cancelled) {
          applyStored(null);
          setCmsSyncState("error");
        }
      } finally {
        if (!cancelled) {
          hydrated.current = true;
          setCmsReady(true);
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [applyStored, usesCloud]);

  useEffect(() => {
    if (!cmsReady || !hydrated.current) return;

    const catalog = buildCatalog(piezas, posts, obrasPortfolio, talleres);

    if (!usesCloud) {
      if (!saveCms(catalog)) {
        setCmsSyncState("error");
      }
      return;
    }

    // Solo sincronizar cuando hay sesión de /admin (evita errores al recargar sin login).
    if (!getAdminPassphrase()) {
      return;
    }

    const timer = window.setTimeout(() => {
      void saveRemoteCatalog(catalog)
        .then(() => setCmsSyncState("synced"))
        .catch((err) => {
          console.error("[CMS] Error al sincronizar:", err);
          setCmsSyncState("error");
        });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [piezas, posts, obrasPortfolio, talleres, cmsReady, usesCloud]);

  const resetToSeed = useCallback(async () => {
    clearCms();
    const seedCatalog = buildCatalog(
      cloneSeedPiezas(),
      cloneSeedPosts(),
      cloneSeedObrasPortfolio(),
      cloneSeedTalleres()
    );
    setPiezas(seedCatalog.piezas);
    setPosts(seedCatalog.posts);
    setObrasPortfolio(seedCatalog.obrasPortfolio);
    setTalleres(seedCatalog.talleres);
    await persistCatalog(seedCatalog);
  }, [persistCatalog]);

  const value = useMemo(
    (): ContentContextValue => ({
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      cmsReady,
      cmsSyncState,
      cmsUsesCloud: usesCloud,
      setPiezas,
      setPosts,
      setObrasPortfolio,
      setTalleres,
      resetToSeed,
      pushCatalogToCloud,
      persistCatalog,
    }),
    [
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      cmsReady,
      cmsSyncState,
      usesCloud,
      resetToSeed,
      pushCatalogToCloud,
      persistCatalog,
    ]
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
