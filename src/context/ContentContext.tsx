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
import {
  obrasPortfolio as seedObrasPortfolio,
  retiredObraIds,
} from "../data/portfolioSeed";
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

export type CmsSyncState =
  | "idle"
  | "loading"
  | "saving"
  | "synced"
  | "local"
  | "error";

export type ContentContextValue = {
  piezas: Pieza[];
  posts: Post[];
  obrasPortfolio: ObraPortfolio[];
  talleres: Taller[];
  deletedIds: string[];
  cmsReady: boolean;
  cmsSyncState: CmsSyncState;
  cmsSyncError: string | null;
  cmsDirty: boolean;
  cmsUsesCloud: boolean;
  setPiezas: React.Dispatch<React.SetStateAction<Pieza[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setObrasPortfolio: React.Dispatch<React.SetStateAction<ObraPortfolio[]>>;
  setTalleres: React.Dispatch<React.SetStateAction<Taller[]>>;
  recordDeletion: (id: string) => void;
  resetToSeed: () => Promise<void>;
  pushCatalogToCloud: (catalog?: StoredCms) => Promise<void>;
  persistCatalog: (catalog: StoredCms) => Promise<void>;
  retrySave: () => Promise<void>;
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
  talleres: Taller[],
  deletedIds: string[] = []
): StoredCms {
  return { piezas, posts, obrasPortfolio, talleres, deletedIds };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const usesCloud = isRemoteCmsEnabled();
  const [cmsReady, setCmsReady] = useState(!usesCloud);
  const [cmsSyncState, setCmsSyncState] = useState<CmsSyncState>(
    usesCloud ? "loading" : "local"
  );
  const [cmsSyncError, setCmsSyncError] = useState<string | null>(null);
  const [cmsDirty, setCmsDirty] = useState(false);
  const hydrated = useRef(false);
  const skipNextAutosave = useRef(false);

  const [piezas, setPiezas] = useState<Pieza[]>(cloneSeedPiezas);
  const [posts, setPosts] = useState<Post[]>(cloneSeedPosts);
  const [obrasPortfolio, setObrasPortfolio] = useState<ObraPortfolio[]>(
    cloneSeedObrasPortfolio
  );
  const [talleres, setTalleres] = useState<Taller[]>(cloneSeedTalleres);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const applyStored = useCallback((stored: StoredCms | null) => {
    // Las obras retiradas se filtran siempre, aunque sigan guardadas en la nube.
    const deleted = new Set([...(stored?.deletedIds ?? []), ...retiredObraIds]);
    setDeletedIds(stored?.deletedIds ?? []);
    setPiezas(
      mergePiezasWithSeed(stored?.piezas ?? null, cloneSeedPiezas(), deleted)
    );
    setPosts(
      mergePostsWithSeed(stored?.posts ?? null, cloneSeedPosts(), deleted)
    );
    setObrasPortfolio(
      mergeObrasPortfolioWithSeed(
        stored?.obrasPortfolio ?? null,
        cloneSeedObrasPortfolio(),
        deleted
      )
    );
    setTalleres(
      mergeTalleresWithSeed(stored?.talleres ?? null, cloneSeedTalleres(), deleted)
    );
  }, []);

  // --- Cola de guardado serializada (evita race conditions y peticiones cruzadas) ---
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const latestCatalogRef = useRef<StoredCms | null>(null);

  const queueSave = useCallback((catalog: StoredCms): Promise<void> => {
    latestCatalogRef.current = catalog;
    setCmsDirty(true);

    const run = saveChainRef.current.then(async () => {
      const toSave = latestCatalogRef.current;
      if (!toSave) return; // ya fue cubierto por un guardado posterior
      latestCatalogRef.current = null;

      setCmsSyncState("saving");
      try {
        await saveRemoteCatalog(toSave);
        setCmsSyncError(null);
        if (!latestCatalogRef.current) {
          setCmsDirty(false);
          setCmsSyncState("synced");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al guardar";
        setCmsSyncError(message);
        setCmsSyncState("error");
        throw err;
      }
    });

    saveChainRef.current = run.catch(() => {});
    return run;
  }, []);

  const pushCatalogToCloud = useCallback(
    async (catalog?: StoredCms) => {
      if (!usesCloud) return;
      const payload =
        catalog ??
        buildCatalog(piezas, posts, obrasPortfolio, talleres, deletedIds);
      await queueSave(payload);
    },
    [piezas, posts, obrasPortfolio, talleres, deletedIds, usesCloud, queueSave]
  );

  const persistCatalog = useCallback(
    async (catalog: StoredCms) => {
      if (usesCloud) {
        await queueSave(catalog);
        return;
      }
      if (!saveCms(catalog)) {
        throw new Error(
          "No se pudo guardar en este navegador (almacenamiento lleno)."
        );
      }
      setCmsDirty(false);
      setCmsSyncState("local");
    },
    [usesCloud, queueSave]
  );

  const retrySave = useCallback(async () => {
    const catalog = buildCatalog(
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      deletedIds
    );
    await persistCatalog(catalog);
  }, [piezas, posts, obrasPortfolio, talleres, deletedIds, persistCatalog]);

  const recordDeletion = useCallback((id: string) => {
    if (!id) return;
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!usesCloud) {
        applyStored(loadCms());
        skipNextAutosave.current = true;
        hydrated.current = true;
        setCmsReady(true);
        setCmsSyncState("local");
        return;
      }

      setCmsSyncState("loading");
      try {
        const remote = await fetchRemoteCatalog();
        if (cancelled) return;

        clearCms();
        applyStored(remote);
        if (remote) saveCms(remote);
        setCmsSyncError(null);
        setCmsDirty(false);
        setCmsSyncState("synced");
      } catch (err) {
        console.warn("[CMS] No se pudo cargar desde la nube:", err);
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Error desconocido al cargar";
          applyStored(null);
          setCmsSyncError(message);
          setCmsSyncState("error");
        }
      } finally {
        if (!cancelled) {
          skipNextAutosave.current = true;
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

    // Ignorar el primer ciclo tras hidratar (no es una edición de la clienta).
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }

    const catalog = buildCatalog(
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      deletedIds
    );

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

    setCmsDirty(true);
    const timer = window.setTimeout(() => {
      void queueSave(catalog).catch(() => {
        /* el estado de error ya se reflejó en el contexto */
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    piezas,
    posts,
    obrasPortfolio,
    talleres,
    deletedIds,
    cmsReady,
    usesCloud,
    queueSave,
  ]);

  const resetToSeed = useCallback(async () => {
    clearCms();
    const seedCatalog = buildCatalog(
      cloneSeedPiezas(),
      cloneSeedPosts(),
      cloneSeedObrasPortfolio(),
      cloneSeedTalleres(),
      []
    );
    setPiezas(seedCatalog.piezas);
    setPosts(seedCatalog.posts);
    setObrasPortfolio(seedCatalog.obrasPortfolio);
    setTalleres(seedCatalog.talleres);
    setDeletedIds([]);
    await persistCatalog(seedCatalog);
  }, [persistCatalog]);

  const value = useMemo(
    (): ContentContextValue => ({
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      deletedIds,
      cmsReady,
      cmsSyncState,
      cmsSyncError,
      cmsDirty,
      cmsUsesCloud: usesCloud,
      setPiezas,
      setPosts,
      setObrasPortfolio,
      setTalleres,
      recordDeletion,
      resetToSeed,
      pushCatalogToCloud,
      persistCatalog,
      retrySave,
    }),
    [
      piezas,
      posts,
      obrasPortfolio,
      talleres,
      deletedIds,
      cmsReady,
      cmsSyncState,
      cmsSyncError,
      cmsDirty,
      usesCloud,
      recordDeletion,
      resetToSeed,
      pushCatalogToCloud,
      persistCatalog,
      retrySave,
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
