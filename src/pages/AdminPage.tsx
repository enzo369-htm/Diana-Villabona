import { Link } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import type { ObraPortfolio, Pieza, Post, Taller, TecnicaPieza } from "../types/content";

import { OBRAS_PORTFOLIO_IMAGENES, POST_IMAGENES_MAX, TECNICAS_PIEZA } from "../types/content";
import { buildCatalog, useContent } from "../context/ContentContext";
import {
  normalizeStoredObraPortfolio,
  normalizeStoredPost,
  normalizeStoredTaller,
} from "../data/contentStore";
import { IMAGE_MAX_SOURCE_BYTES, IMAGE_MAX_SOURCE_MB } from "../data/remoteCms";
import { cmsImageHelpText, resolveCmsImageFromFile } from "../utils/cmsImage";
import { AdminPortfolioTab } from "./AdminPortfolioTab";
import { AdminTalleresTab } from "./AdminTalleresTab";

const TECNICAS: TecnicaPieza[] = [...TECNICAS_PIEZA];

function newEmptyPieza(): Pieza {
  return {
    id: `p-${Date.now()}`,
    titulo: "",
    descripcion: "",
    dimensiones: "",
    tecnica: "Objetos",
    imagenes: [],
    destacadaHome: false,
    disponible: true,
    historia: "",
  };
}

function newEmptyPost(): Post {
  return {
    id: `post-${Date.now()}`,
    titulo: "",
    extracto: "",
    portada: "",
    fecha: "",
    cuerpo: "",
    destacado: false,
    imagenes: [],
  };
}

function cmsSyncLabel(
  state: string,
  usesCloud: boolean,
  error: string | null,
  dirty: boolean
): string {
  if (!usesCloud) {
    return import.meta.env.PROD
      ? "Error: el CMS en la nube no está disponible"
      : "Modo local (solo este navegador)";
  }
  switch (state) {
    case "loading":
      return "Cargando desde la nube…";
    case "saving":
      return "Guardando…";
    case "synced":
      return dirty ? "● Cambios sin guardar" : "Guardado en la nube ✓";
    case "error":
      return error
        ? `Error al guardar: ${error}`
        : "No se pudo conectar con la nube — revisá Supabase en Vercel";
    case "local":
      return "Datos locales pendientes de subir a la nube";
    default:
      return dirty ? "● Cambios sin guardar" : "";
  }
}

function cmsSyncTone(state: string, dirty: boolean): string {
  if (state === "error") return "admin-sync--error";
  if (state === "saving" || state === "loading") return "admin-sync--busy";
  if (dirty) return "admin-sync--dirty";
  return "admin-sync--ok";
}

export function AdminPage() {
  const {
    piezas,
    posts,
    obrasPortfolio,
    talleres,
    deletedIds,
    cmsSyncState,
    cmsSyncError,
    cmsDirty,
    cmsUsesCloud,
    setPiezas,
    setPosts,
    setObrasPortfolio,
    setTalleres,
    recordDeletion,
    resetToSeed,
    pushCatalogToCloud,
    persistCatalog,
    retrySave,
  } = useContent();
  const [savingObra, setSavingObra] = useState(false);
  const [tab, setTab] = useState<
    "piezas" | "bitacora" | "portfolio" | "talleres"
  >("piezas");
  const [piezaDraft, setPiezaDraft] = useState<Pieza | null>(null);
  const [postDraft, setPostDraft] = useState<Post | null>(null);
  const [obraDraft, setObraDraft] = useState<ObraPortfolio | null>(null);
  const [tallerDraft, setTallerDraft] = useState<Taller | null>(null);
  const portadaFileRef = useRef<HTMLInputElement>(null);
  const piezaImagesFileRef = useRef<HTMLInputElement>(null);
  const postImagesFileRef = useRef<HTMLInputElement>(null);

  const addPiezaImagesFromFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !piezaDraft) return;

      const next = [...piezaDraft.imagenes];
      for (const file of Array.from(files)) {
        if (file.size > IMAGE_MAX_SOURCE_BYTES) {
          window.alert(
            `"${file.name}" supera ~${IMAGE_MAX_SOURCE_MB} MB. Usa una imagen más liviana.`
          );
          continue;
        }
        try {
          next.push(await resolveCmsImageFromFile(file));
        } catch (err) {
          window.alert(
            err instanceof Error ? err.message : `No se pudo subir "${file.name}".`
          );
        }
      }

      setPiezaDraft({ ...piezaDraft, imagenes: next });
      if (piezaImagesFileRef.current) piezaImagesFileRef.current.value = "";
    },
    [piezaDraft]
  );

  const removePiezaImage = useCallback(
    (index: number) => {
      if (!piezaDraft) return;
      setPiezaDraft({
        ...piezaDraft,
        imagenes: piezaDraft.imagenes.filter((_, i) => i !== index),
      });
    },
    [piezaDraft]
  );

  const addPostImagesFromFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !postDraft) return;

      const current = postDraft.imagenes ?? [];
      const room = POST_IMAGENES_MAX - current.length;
      if (room <= 0) {
        window.alert(`Máximo ${POST_IMAGENES_MAX} imágenes en la entrada.`);
        if (postImagesFileRef.current) postImagesFileRef.current.value = "";
        return;
      }

      const next = [...current];
      for (const file of Array.from(files).slice(0, room)) {
        if (file.size > IMAGE_MAX_SOURCE_BYTES) {
          window.alert(
            `"${file.name}" supera ~${IMAGE_MAX_SOURCE_MB} MB. Usa una imagen más liviana.`
          );
          continue;
        }
        try {
          next.push(await resolveCmsImageFromFile(file));
        } catch (err) {
          window.alert(
            err instanceof Error ? err.message : `No se pudo subir "${file.name}".`
          );
        }
      }

      setPostDraft({ ...postDraft, imagenes: next.slice(0, POST_IMAGENES_MAX) });
      if (postImagesFileRef.current) postImagesFileRef.current.value = "";
    },
    [postDraft]
  );

  const removePostImage = useCallback(
    (index: number) => {
      if (!postDraft) return;
      setPostDraft({
        ...postDraft,
        imagenes: (postDraft.imagenes ?? []).filter((_, i) => i !== index),
      });
    },
    [postDraft]
  );

  const savePieza = useCallback(() => {
    if (!piezaDraft) return;
    const imagenes = piezaDraft.imagenes.map((s) => s.trim()).filter(Boolean);
    if (imagenes.length === 0) {
      window.alert("Añade al menos una imagen.");
      return;
    }
    const next = { ...piezaDraft, imagenes };
    const idx = piezas.findIndex((p) => p.id === next.id);
    if (idx >= 0) {
      const copy = [...piezas];
      copy[idx] = next;
      setPiezas(copy);
    } else {
      setPiezas([...piezas, next]);
    }
  }, [piezaDraft, piezas, setPiezas]);

  const deletePieza = useCallback(() => {
    if (!piezaDraft || !window.confirm("¿Eliminar esta pieza del catálogo?")) return;
    recordDeletion(piezaDraft.id);
    setPiezas(piezas.filter((p) => p.id !== piezaDraft.id));
    setPiezaDraft(null);
  }, [piezaDraft, piezas, setPiezas, recordDeletion]);

  const savePost = useCallback(() => {
    if (!postDraft) return;
    const next: Post = {
      id: postDraft.id,
      titulo: postDraft.titulo,
      extracto: postDraft.extracto,
      portada: postDraft.portada,
      fecha: postDraft.fecha,
      cuerpo: postDraft.cuerpo,
      destacado: postDraft.destacado,
      imagenes: (postDraft.imagenes ?? [])
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, POST_IMAGENES_MAX),
    };
    const v = postDraft.videoUrl?.trim();
    if (v) next.videoUrl = v;
    if (typeof postDraft.orden === "number" && Number.isFinite(postDraft.orden)) {
      next.orden = postDraft.orden;
    }
    const idx = posts.findIndex((p) => p.id === next.id);
    if (idx >= 0) {
      const copy = [...posts];
      copy[idx] = next;
      setPosts(copy);
    } else {
      setPosts([...posts, next]);
    }
  }, [postDraft, posts, setPosts]);

  const deletePost = useCallback(() => {
    if (!postDraft || !window.confirm("¿Eliminar esta entrada?")) return;
    recordDeletion(postDraft.id);
    setPosts(posts.filter((p) => p.id !== postDraft.id));
    setPostDraft(null);
  }, [postDraft, posts, setPosts, recordDeletion]);

  const saveObra = useCallback(async () => {
    if (!obraDraft || savingObra) return;
    const imagenes = obraDraft.imagenes.map((s) => s.trim());
    const filled = imagenes.filter(Boolean);
    if (filled.length !== OBRAS_PORTFOLIO_IMAGENES) {
      window.alert(`Añade exactamente ${OBRAS_PORTFOLIO_IMAGENES} imágenes.`);
      return;
    }
    const next = normalizeStoredObraPortfolio({
      ...obraDraft,
      imagenes,
    });
    const idx = obrasPortfolio.findIndex((o) => o.id === next.id);
    const nextObras =
      idx >= 0
        ? obrasPortfolio.map((o, i) => (i === idx ? next : o))
        : [...obrasPortfolio, next];

    const catalog = buildCatalog(piezas, posts, nextObras, talleres, deletedIds);

    setSavingObra(true);
    try {
      setObrasPortfolio(nextObras);
      await persistCatalog(catalog);
      setObraDraft(next);
    } catch {
      /* el banner de estado muestra el error y permite reintentar */
    } finally {
      setSavingObra(false);
    }
  }, [
    obraDraft,
    obrasPortfolio,
    piezas,
    posts,
    talleres,
    deletedIds,
    persistCatalog,
    savingObra,
    setObrasPortfolio,
  ]);

  const deleteObra = useCallback(async () => {
    if (!obraDraft || savingObra) return;
    if (!window.confirm("¿Eliminar esta obra del portafolio?")) return;

    const removed = obraDraft;
    const nextObras = obrasPortfolio.filter((o) => o.id !== obraDraft.id);
    const nextDeleted = deletedIds.includes(removed.id)
      ? deletedIds
      : [...deletedIds, removed.id];
    const catalog = buildCatalog(piezas, posts, nextObras, talleres, nextDeleted);

    setSavingObra(true);
    try {
      recordDeletion(removed.id);
      setObrasPortfolio(nextObras);
      setObraDraft(null);
      await persistCatalog(catalog);
    } catch {
      setObrasPortfolio(obrasPortfolio);
      setObraDraft(removed);
      /* el banner de estado muestra el error y permite reintentar */
    } finally {
      setSavingObra(false);
    }
  }, [
    obraDraft,
    obrasPortfolio,
    piezas,
    posts,
    talleres,
    deletedIds,
    recordDeletion,
    persistCatalog,
    savingObra,
    setObrasPortfolio,
  ]);

  const saveTaller = useCallback(() => {
    if (!tallerDraft) return;
    const titulo = tallerDraft.titulo.trim();
    if (!titulo) {
      window.alert("Escribe un título.");
      return;
    }
    const next = normalizeStoredTaller({
      ...tallerDraft,
      titulo,
      descripcion: tallerDraft.descripcion.trim(),
      enlace: tallerDraft.enlace?.trim() || undefined,
    });
    const idx = talleres.findIndex((t) => t.id === next.id);
    if (idx >= 0) {
      const copy = [...talleres];
      copy[idx] = next;
      setTalleres(copy);
    } else {
      setTalleres([...talleres, next]);
    }
  }, [tallerDraft, talleres, setTalleres]);

  const deleteTaller = useCallback(() => {
    if (!tallerDraft || !window.confirm("¿Eliminar este taller?")) return;
    recordDeletion(tallerDraft.id);
    setTalleres(talleres.filter((t) => t.id !== tallerDraft.id));
    setTallerDraft(null);
  }, [tallerDraft, talleres, setTalleres, recordDeletion]);

  const exportJson = useCallback(() => {
    const blob = new Blob(
      [
        JSON.stringify(
          { piezas, posts, obrasPortfolio, talleres, deletedIds },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diana-villabona-catalogo-bitacora.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [piezas, posts, obrasPortfolio, talleres, deletedIds]);

  const importJson = useCallback(
    (file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(String(reader.result)) as Partial<{
            piezas: Pieza[];
            posts: Post[];
            obrasPortfolio: ObraPortfolio[];
            talleres: Taller[];
          }>;
          if (Array.isArray(d.piezas) && Array.isArray(d.posts)) {
            setPiezas(d.piezas);
            setPosts(d.posts.map(normalizeStoredPost));
            setObrasPortfolio(
              Array.isArray(d.obrasPortfolio)
                ? d.obrasPortfolio.map(normalizeStoredObraPortfolio)
                : []
            );
            setTalleres(
              Array.isArray(d.talleres)
                ? d.talleres.map(normalizeStoredTaller)
                : []
            );
            setPiezaDraft(null);
            setPostDraft(null);
            setObraDraft(null);
            setTallerDraft(null);
          }
        } catch {
          window.alert("No se pudo leer el JSON.");
        }
      };
      reader.readAsText(file);
    },
    [setPiezas, setPosts, setObrasPortfolio, setTalleres]
  );

  return (
    <div className="page-content page-content--pad admin-hub">
      <header className="page-header">
        <h1>Administración</h1>
        <p className="page-header__lede">
          Edición del catálogo, portafolio, encuentros y bitácora. Los cambios y las fotos
          quedan guardados para todo el sitio (celular y computadora).
        </p>
        <div
          className={`admin-sync-status ${cmsSyncTone(cmsSyncState, cmsDirty)}`}
          role="status"
          aria-live="polite"
        >
          <span>{cmsSyncLabel(cmsSyncState, cmsUsesCloud, cmsSyncError, cmsDirty)}</span>
          {cmsUsesCloud && cmsSyncState === "error" ? (
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-sync-status__retry"
              onClick={() => {
                void retrySave();
              }}
            >
              Reintentar
            </button>
          ) : null}
        </div>
      </header>

      <div className="admin-toolbar" role="group" aria-label="Acciones globales">
        <button type="button" className="admin-btn admin-btn--secondary" onClick={exportJson}>
          Descargar respaldo JSON
        </button>
        <label className="admin-file-label">
          Importar JSON
          <input
            type="file"
            accept="application/json,.json"
            className="admin-file-input"
            onChange={(e) => importJson(e.target.files?.[0] ?? null)}
          />
        </label>
        {cmsUsesCloud ? (
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => {
              void pushCatalogToCloud()
                .then(() => window.alert("Catálogo subido a la nube."))
                .catch((err) =>
                  window.alert(
                    err instanceof Error ? err.message : "No se pudo subir el catálogo."
                  )
                );
            }}
          >
            Subir catálogo a la nube
          </button>
        ) : null}
        <button
          type="button"
          className="admin-btn admin-btn--danger"
          onClick={() => {
            if (
              window.confirm(
                "¿Volver a los datos por defecto del proyecto? Se borrará el contenido guardado."
              )
            ) {
              void resetToSeed();
              setPiezaDraft(null);
              setPostDraft(null);
              setObraDraft(null);
              setTallerDraft(null);
            }
          }}
        >
          Restaurar datos por defecto
        </button>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Módulos">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "piezas"}
          className={tab === "piezas" ? "admin-tab admin-tab--on" : "admin-tab"}
          onClick={() => setTab("piezas")}
        >
          Catálogo de piezas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "portfolio"}
          className={tab === "portfolio" ? "admin-tab admin-tab--on" : "admin-tab"}
          onClick={() => setTab("portfolio")}
        >
          Portafolio
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "talleres"}
          className={tab === "talleres" ? "admin-tab admin-tab--on" : "admin-tab"}
          onClick={() => setTab("talleres")}
        >
          Encuentros
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "bitacora"}
          className={tab === "bitacora" ? "admin-tab admin-tab--on" : "admin-tab"}
          onClick={() => setTab("bitacora")}
        >
          Bitácora
        </button>
      </div>

      {tab === "piezas" ? (
        <div className="admin-split">
          <aside className="admin-list-panel">
            <div className="admin-list-head">
              <h2 className="admin-h2">Piezas ({piezas.length})</h2>
              <button
                type="button"
                className="admin-btn"
                onClick={() => setPiezaDraft(newEmptyPieza())}
              >
                Nueva pieza
              </button>
            </div>
            <ul className="admin-id-list">
              {piezas.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={
                      piezaDraft?.id === p.id
                        ? "admin-id-list__btn admin-id-list__btn--on"
                        : "admin-id-list__btn"
                    }
                    onClick={() => setPiezaDraft({ ...p })}
                  >
                    <span className="admin-id-list__title">{p.titulo || p.id}</span>
                    <span className="admin-id-list__meta">{p.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="admin-form-panel">
            {piezaDraft ? (
              <form
                className="admin-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  savePieza();
                }}
              >
                <p className="admin-form__hint">
                  <strong>ID</strong> (no cambiar si ya está publicada):{" "}
                  <code>{piezaDraft.id}</code>
                </p>
                <label className="admin-field">
                  Título
                  <input
                    value={piezaDraft.titulo}
                    onChange={(e) =>
                      setPiezaDraft({ ...piezaDraft, titulo: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="admin-field">
                  Descripción
                  <textarea
                    value={piezaDraft.descripcion}
                    onChange={(e) =>
                      setPiezaDraft({ ...piezaDraft, descripcion: e.target.value })
                    }
                    rows={4}
                  />
                </label>
                <label className="admin-field">
                  Dimensiones
                  <input
                    value={piezaDraft.dimensiones}
                    onChange={(e) =>
                      setPiezaDraft({ ...piezaDraft, dimensiones: e.target.value })
                    }
                  />
                </label>
                <label className="admin-field">
                  Sección
                  <select
                    value={piezaDraft.tecnica}
                    onChange={(e) =>
                      setPiezaDraft({
                        ...piezaDraft,
                        tecnica: e.target.value as TecnicaPieza,
                      })
                    }
                  >
                    {TECNICAS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="admin-field">
                  <span className="admin-field__label-text">Imágenes</span>
                  <p className="admin-field__help">{cmsImageHelpText()}</p>
                  <div className="admin-portada-row">
                    <label className="admin-file-label admin-file-label--inline">
                      Elegir imágenes…
                      <input
                        ref={piezaImagesFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        className="admin-file-input"
                        onChange={(e) => {
                          void addPiezaImagesFromFiles(e.target.files);
                        }}
                      />
                    </label>
                    {piezaDraft.imagenes.length > 0 ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          setPiezaDraft({ ...piezaDraft, imagenes: [] });
                          if (piezaImagesFileRef.current) {
                            piezaImagesFileRef.current.value = "";
                          }
                        }}
                      >
                        Quitar todas
                      </button>
                    ) : null}
                  </div>
                  {piezaDraft.imagenes.length > 0 ? (
                    <ul className="admin-imagenes-grid" role="list">
                      {piezaDraft.imagenes.map((src, index) => (
                        <li key={`${src.slice(0, 48)}-${index}`} className="admin-imagenes-thumb">
                          <img src={src} alt="" />
                          <button
                            type="button"
                            className="admin-imagenes-thumb__remove"
                            onClick={() => removePiezaImage(index)}
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <label className="admin-field admin-field--inline">
                  <input
                    type="checkbox"
                    checked={piezaDraft.destacadaHome}
                    onChange={(e) =>
                      setPiezaDraft({
                        ...piezaDraft,
                        destacadaHome: e.target.checked,
                      })
                    }
                  />
                  Marcar como destacada (referencia; la vitrina del home sigue usando IDs en{" "}
                  <code>seed.ts</code> → <code>homeConfig.idsPiezasHome</code>)
                </label>
                <label className="admin-field admin-field--inline">
                  <input
                    type="checkbox"
                    checked={piezaDraft.disponible}
                    onChange={(e) =>
                      setPiezaDraft({
                        ...piezaDraft,
                        disponible: e.target.checked,
                      })
                    }
                  />
                  Disponible
                </label>
                <label className="admin-field">
                  Historia (opcional)
                  <textarea
                    value={piezaDraft.historia ?? ""}
                    onChange={(e) =>
                      setPiezaDraft({ ...piezaDraft, historia: e.target.value })
                    }
                    rows={3}
                  />
                </label>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    Guardar pieza
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    onClick={deletePieza}
                  >
                    Eliminar
                  </button>
                </div>
              </form>
            ) : (
              <p className="admin-placeholder">Elige una pieza o crea una nueva.</p>
            )}
          </div>
        </div>
      ) : tab === "portfolio" ? (
        <AdminPortfolioTab
          obras={obrasPortfolio}
          draft={obraDraft}
          setDraft={setObraDraft}
          onSave={saveObra}
          onDelete={deleteObra}
          saving={savingObra}
        />
      ) : tab === "talleres" ? (
        <AdminTalleresTab
          talleres={talleres}
          draft={tallerDraft}
          setDraft={setTallerDraft}
          onSave={saveTaller}
          onDelete={deleteTaller}
        />
      ) : (
        <div className="admin-split">
          <aside className="admin-list-panel">
            <div className="admin-list-head">
              <h2 className="admin-h2">Entradas ({posts.length})</h2>
              <button type="button" className="admin-btn" onClick={() => setPostDraft(newEmptyPost())}>
                Nueva entrada
              </button>
            </div>
            <ul className="admin-id-list">
              {posts.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={
                      postDraft?.id === p.id
                        ? "admin-id-list__btn admin-id-list__btn--on"
                        : "admin-id-list__btn"
                    }
                    onClick={() => setPostDraft({ ...p, videoUrl: p.videoUrl ?? "" })}
                  >
                    <span className="admin-id-list__title">{p.titulo || p.id}</span>
                    <span className="admin-id-list__meta">{p.id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="admin-form-panel">
            {postDraft ? (
              <form
                className="admin-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  savePost();
                }}
              >
                <p className="admin-form__hint">
                  <strong>ID</strong>: <code>{postDraft.id}</code>
                </p>
                <label className="admin-field">
                  Título
                  <input
                    value={postDraft.titulo}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, titulo: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="admin-field">
                  Extracto
                  <textarea
                    value={postDraft.extracto}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, extracto: e.target.value })
                    }
                    rows={2}
                  />
                </label>
                <div className="admin-field">
                  <span className="admin-field__label-text">Portada</span>
                  <p className="admin-field__help">{cmsImageHelpText()}</p>
                  {postDraft.portada.startsWith("data:") ? (
                    <p className="admin-field__warn" role="status">
                      Esta portada es antigua (solo este navegador). Volvé a elegir
                      la imagen para subirla a la nube.
                    </p>
                  ) : null}
                  <div className="admin-portada-row">
                    <label className="admin-file-label admin-file-label--inline">
                      Elegir imagen…
                      <input
                        ref={portadaFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="admin-file-input"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !postDraft) return;
                          if (file.size > IMAGE_MAX_SOURCE_BYTES) {
                            window.alert(
                              `La imagen supera ~${IMAGE_MAX_SOURCE_MB} MB. Usa una imagen más liviana.`
                            );
                            e.target.value = "";
                            return;
                          }
                          try {
                            const url = await resolveCmsImageFromFile(file);
                            setPostDraft({ ...postDraft, portada: url });
                          } catch (err) {
                            window.alert(
                              err instanceof Error
                                ? err.message
                                : "No se pudo subir la imagen."
                            );
                          }
                        }}
                      />
                    </label>
                    {postDraft.portada ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          setPostDraft({ ...postDraft, portada: "" });
                          if (portadaFileRef.current) portadaFileRef.current.value = "";
                        }}
                      >
                        Quitar portada
                      </button>
                    ) : null}
                  </div>
                  {postDraft.portada ? (
                    <div className="admin-portada-preview">
                      <img src={postDraft.portada} alt="" />
                    </div>
                  ) : null}
                  <label className="admin-field admin-field--tight">
                    O pegá una URL de imagen (opcional)
                    <input
                      type="text"
                      value={
                        postDraft.portada.startsWith("data:") ? "" : postDraft.portada
                      }
                      onChange={(e) =>
                        setPostDraft({ ...postDraft, portada: e.target.value })
                      }
                      placeholder="https://… o /ruta-en-sitio.jpg"
                    />
                  </label>
                </div>
                <label className="admin-field">
                  Fecha (YYYY-MM-DD o vacío)
                  <input
                    value={postDraft.fecha}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, fecha: e.target.value })
                    }
                  />
                </label>
                <label className="admin-field">
                  Orden en la vitrina
                  <p className="admin-field__help">
                    Número de posición: <code>1</code> es la primera entrada que
                    se muestra, <code>2</code> la siguiente, y así. Si lo dejás
                    vacío, se ordena por fecha (más reciente primero).
                  </p>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={
                      typeof postDraft.orden === "number" ? postDraft.orden : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setPostDraft({
                        ...postDraft,
                        orden: raw === "" ? undefined : Number(raw),
                      });
                    }}
                    placeholder="1"
                  />
                </label>
                <label className="admin-field">
                  URL de vídeo (YouTube/Vimeo, opcional)
                  <p className="admin-field__help">
                    Pegá el enlace normal del video (por ejemplo
                    <code> youtube.com/watch?v=… </code> o
                    <code> youtu.be/… </code>). Se convierte solo al formato
                    correcto para mostrarlo.
                  </p>
                  <input
                    value={postDraft.videoUrl ?? ""}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </label>
                <label className="admin-field">
                  Cuerpo de la entrada (texto)
                  <p className="admin-field__help">
                    Solo texto, sin etiquetas HTML. Una línea en blanco separa
                    párrafos; un solo salto de línea hace un salto dentro del mismo
                    párrafo.
                  </p>
                  <textarea
                    value={postDraft.cuerpo}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, cuerpo: e.target.value })
                    }
                    rows={14}
                    placeholder="Escribe aquí el texto de la entrada."
                  />
                </label>
                <div className="admin-field">
                  <span className="admin-field__label-text">
                    Imágenes de la entrada (hasta {POST_IMAGENES_MAX})
                  </span>
                  <p className="admin-field__help">
                    Se muestran a la derecha del texto en escritorio (una debajo
                    de otra) y debajo del texto en móvil. {cmsImageHelpText()}
                  </p>
                  <div className="admin-portada-row">
                    <label className="admin-file-label admin-file-label--inline">
                      Elegir imágenes…
                      <input
                        ref={postImagesFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        className="admin-file-input"
                        disabled={(postDraft.imagenes?.length ?? 0) >= POST_IMAGENES_MAX}
                        onChange={(e) => {
                          void addPostImagesFromFiles(e.target.files);
                        }}
                      />
                    </label>
                    {(postDraft.imagenes?.length ?? 0) > 0 ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          setPostDraft({ ...postDraft, imagenes: [] });
                          if (postImagesFileRef.current) {
                            postImagesFileRef.current.value = "";
                          }
                        }}
                      >
                        Quitar todas
                      </button>
                    ) : null}
                  </div>
                  {(postDraft.imagenes?.length ?? 0) > 0 ? (
                    <ul className="admin-imagenes-grid" role="list">
                      {(postDraft.imagenes ?? []).map((src, index) => (
                        <li
                          key={`${src.slice(0, 48)}-${index}`}
                          className="admin-imagenes-thumb"
                        >
                          <img src={src} alt="" />
                          <button
                            type="button"
                            className="admin-imagenes-thumb__remove"
                            onClick={() => removePostImage(index)}
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <label className="admin-field admin-field--inline">
                  <input
                    type="checkbox"
                    checked={Boolean(postDraft.destacado)}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, destacado: e.target.checked })
                    }
                  />
                  Destacada (el home usa <code>homeConfig.idPostDestacado</code> en código)
                </label>
                <div className="admin-form-actions">
                  <button type="submit" className="admin-btn admin-btn--primary">
                    Guardar entrada
                  </button>
                  <button type="button" className="admin-btn admin-btn--danger" onClick={deletePost}>
                    Eliminar
                  </button>
                </div>
              </form>
            ) : (
              <p className="admin-placeholder">Elige una entrada o crea una nueva.</p>
            )}
          </div>
        </div>
      )}

      <Link className="btn-pill btn-pill--ghost" to="/">
        Volver al sitio
      </Link>
    </div>
  );
}
