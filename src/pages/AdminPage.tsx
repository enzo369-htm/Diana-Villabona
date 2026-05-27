import { Link } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import type { ObraPortfolio, Pieza, Post, TecnicaPieza } from "../types/content";
import { OBRAS_PORTFOLIO_IMAGENES } from "../types/content";
import { useContent } from "../context/ContentContext";
import {
  normalizeStoredObraPortfolio,
  normalizeStoredPost,
} from "../data/contentStore";
import { AdminPortfolioTab } from "./AdminPortfolioTab";

const TECNICAS: TecnicaPieza[] = [
  "Raku",
  "Saggar",
  "Obvara",
  "Esmaltes",
  "Modelado",
  "Otro",
];

function newEmptyPieza(): Pieza {
  return {
    id: `p-${Date.now()}`,
    titulo: "",
    descripcion: "",
    dimensiones: "",
    tecnica: "Raku",
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
  };
}

const IMAGE_MAX_BYTES = 2.5 * 1024 * 1024;

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AdminPage() {
  const { piezas, posts, obrasPortfolio, setPiezas, setPosts, setObrasPortfolio, resetToSeed } =
    useContent();
  const [tab, setTab] = useState<"piezas" | "bitacora" | "portfolio">("piezas");
  const [piezaDraft, setPiezaDraft] = useState<Pieza | null>(null);
  const [postDraft, setPostDraft] = useState<Post | null>(null);
  const [obraDraft, setObraDraft] = useState<ObraPortfolio | null>(null);
  const portadaFileRef = useRef<HTMLInputElement>(null);
  const piezaImagesFileRef = useRef<HTMLInputElement>(null);

  const addPiezaImagesFromFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !piezaDraft) return;

      const next = [...piezaDraft.imagenes];
      for (const file of Array.from(files)) {
        if (file.size > IMAGE_MAX_BYTES) {
          window.alert(
            `"${file.name}" supera ~2,5 MB. Comprímela o usa otra imagen.`
          );
          continue;
        }
        try {
          next.push(await readImageFile(file));
        } catch {
          window.alert(`No se pudo leer "${file.name}".`);
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
    setPiezas(piezas.filter((p) => p.id !== piezaDraft.id));
    setPiezaDraft(null);
  }, [piezaDraft, piezas, setPiezas]);

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
    };
    const v = postDraft.videoUrl?.trim();
    if (v) next.videoUrl = v;
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
    setPosts(posts.filter((p) => p.id !== postDraft.id));
    setPostDraft(null);
  }, [postDraft, posts, setPosts]);

  const saveObra = useCallback(() => {
    if (!obraDraft) return;
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
    if (idx >= 0) {
      const copy = [...obrasPortfolio];
      copy[idx] = next;
      setObrasPortfolio(copy);
    } else {
      setObrasPortfolio([...obrasPortfolio, next]);
    }
  }, [obraDraft, obrasPortfolio, setObrasPortfolio]);

  const deleteObra = useCallback(() => {
    if (!obraDraft || !window.confirm("¿Eliminar esta obra del portfolio?")) return;
    setObrasPortfolio(obrasPortfolio.filter((o) => o.id !== obraDraft.id));
    setObraDraft(null);
  }, [obraDraft, obrasPortfolio, setObrasPortfolio]);

  const exportJson = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify({ piezas, posts, obrasPortfolio }, null, 2)],
      {
      type: "application/json",
    }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diana-villabona-catalogo-bitacora.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [piezas, posts, obrasPortfolio]);

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
          }>;
          if (Array.isArray(d.piezas) && Array.isArray(d.posts)) {
            setPiezas(d.piezas);
            setPosts(d.posts.map(normalizeStoredPost));
            setObrasPortfolio(
              Array.isArray(d.obrasPortfolio)
                ? d.obrasPortfolio.map(normalizeStoredObraPortfolio)
                : []
            );
            setPiezaDraft(null);
            setPostDraft(null);
            setObraDraft(null);
          }
        } catch {
          window.alert("No se pudo leer el JSON.");
        }
      };
      reader.readAsText(file);
    },
    [setPiezas, setPosts, setObrasPortfolio]
  );

  return (
    <div className="page-content page-content--pad admin-hub">
      <header className="page-header">
        <h1>Administración</h1>
        <p className="page-header__lede">
          Edición del catálogo, portfolio y bitácora. Los cambios se guardan en
          este navegador (localStorage). Las imágenes se eligen desde tu equipo.
        </p>
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
        <button
          type="button"
          className="admin-btn admin-btn--danger"
          onClick={() => {
            if (
              window.confirm(
                "¿Volver a los datos por defecto del proyecto? Se borrará lo guardado en este navegador."
              )
            ) {
              resetToSeed();
              setPiezaDraft(null);
              setPostDraft(null);
              setObraDraft(null);
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
          Portfolio
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
                  Técnica
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
                  <p className="admin-field__help">
                    Elegí una o más fotos desde tu equipo. Se guardan en este
                    navegador (como la portada de la bitácora).
                  </p>
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
                  <p className="admin-field__help">
                    Puedes subir una imagen desde tu equipo (se guarda en este
                    navegador) o escribir una ruta de archivo en{" "}
                    <code>public/</code>.
                  </p>
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
                          if (file.size > IMAGE_MAX_BYTES) {
                            window.alert(
                              "La imagen supera ~2,5 MB. Comprímela o coloca el archivo en public/ y usa la ruta."
                            );
                            e.target.value = "";
                            return;
                          }
                          try {
                            const dataUrl = await readImageFile(file);
                            setPostDraft({ ...postDraft, portada: dataUrl });
                          } catch {
                            window.alert("No se pudo leer la imagen.");
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
                    Ruta en public (si no subes archivo)
                    <input
                      type="text"
                      value={
                        postDraft.portada.startsWith("data:") ? "" : postDraft.portada
                      }
                      onChange={(e) =>
                        setPostDraft({ ...postDraft, portada: e.target.value })
                      }
                      placeholder="/portada.jpg"
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
                  URL de vídeo embebido (YouTube/Vimeo, opcional)
                  <input
                    value={postDraft.videoUrl ?? ""}
                    onChange={(e) =>
                      setPostDraft({ ...postDraft, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/embed/..."
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
