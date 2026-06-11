import { useCallback, useRef } from "react";
import type { ObraPortfolio } from "../types/content";
import { OBRAS_PORTFOLIO_IMAGENES } from "../types/content";
import { IMAGE_MAX_BYTES } from "../data/remoteCms";
import { resolveCmsImageFromFile } from "../utils/cmsImage";

export function newEmptyObraPortfolio(): ObraPortfolio {
  return {
    id: `pf-${Date.now()}`,
    titulo: "",
    texto: "",
    imagenes: Array.from({ length: OBRAS_PORTFOLIO_IMAGENES }, () => ""),
    orden: 999,
  };
}

type AdminPortfolioTabProps = {
  obras: ObraPortfolio[];
  draft: ObraPortfolio | null;
  setDraft: (obra: ObraPortfolio | null) => void;
  onSave: () => void;
  onDelete: () => void;
};

export function AdminPortfolioTab({
  obras,
  draft,
  setDraft,
  onSave,
  onDelete,
}: AdminPortfolioTabProps) {
  const slotRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setSlotImage = useCallback(
    async (index: number, file: File | null) => {
      if (!draft || !file) return;
      if (file.size > IMAGE_MAX_BYTES) {
        window.alert(
          `"${file.name}" supera ~2,5 MB. Comprímela o usa otra imagen.`
        );
        return;
      }
      try {
        const url = await resolveCmsImageFromFile(file);
        const imagenes = [...draft.imagenes];
        while (imagenes.length < OBRAS_PORTFOLIO_IMAGENES) imagenes.push("");
        imagenes[index] = url;
        setDraft({
          ...draft,
          imagenes: imagenes.slice(0, OBRAS_PORTFOLIO_IMAGENES),
        });
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "No se pudo subir la imagen."
        );
      }
    },
    [draft, setDraft]
  );

  const clearSlot = useCallback(
    (index: number) => {
      if (!draft) return;
      const imagenes = [...draft.imagenes];
      while (imagenes.length < OBRAS_PORTFOLIO_IMAGENES) imagenes.push("");
      imagenes[index] = "";
      setDraft({
        ...draft,
        imagenes: imagenes.slice(0, OBRAS_PORTFOLIO_IMAGENES),
      });
      if (slotRefs.current[index]) slotRefs.current[index]!.value = "";
    },
    [draft, setDraft]
  );

  return (
    <div className="admin-split">
      <aside className="admin-list-panel">
        <div className="admin-list-head">
          <h2 className="admin-h2">Obras ({obras.length})</h2>
          <button
            type="button"
            className="admin-btn"
            onClick={() => setDraft(newEmptyObraPortfolio())}
          >
            Nueva obra
          </button>
        </div>
        <ul className="admin-id-list">
          {obras.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                className={
                  draft?.id === o.id
                    ? "admin-id-list__btn admin-id-list__btn--on"
                    : "admin-id-list__btn"
                }
                onClick={() => setDraft({ ...o })}
              >
                <span className="admin-id-list__title">{o.titulo || o.id}</span>
                <span className="admin-id-list__meta">{o.id}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="admin-form-panel">
        {draft ? (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
            <p className="admin-form__hint">
              <strong>ID</strong> (no cambiar si ya está publicada):{" "}
              <code>{draft.id}</code>
            </p>
            <label className="admin-field">
              Título
              <input
                value={draft.titulo}
                onChange={(e) => setDraft({ ...draft, titulo: e.target.value })}
                required
              />
            </label>
            <label className="admin-field">
              Texto breve
              <textarea
                value={draft.texto}
                onChange={(e) => setDraft({ ...draft, texto: e.target.value })}
                rows={4}
              />
            </label>
            <label className="admin-field">
              Orden en el mosaico (número menor = más arriba)
              <input
                type="number"
                value={draft.orden ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    orden:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </label>
            <div className="admin-field">
              <span className="admin-field__label-text">6 fotos del portafolio</span>
              <p className="admin-field__help">
                Fila superior: fotos 1–3. Fila inferior: 4–6. La foto 1 es la que
                aparece en el mosaico.
              </p>
              <div className="admin-portfolio-slots">
                {Array.from({ length: OBRAS_PORTFOLIO_IMAGENES }, (_, index) => {
                  const src = draft.imagenes[index] ?? "";
                  return (
                    <div key={index} className="admin-portfolio-slot">
                      <span className="admin-portfolio-slot__label">
                        Foto {index + 1}
                        {index === 0 ? " (portada mosaico)" : ""}
                      </span>
                      {src ? (
                        <div className="admin-portfolio-slot__preview">
                          <img src={src} alt="" />
                        </div>
                      ) : (
                        <div className="admin-portfolio-slot__empty" aria-hidden />
                      )}
                      <div className="admin-portada-row">
                        <label className="admin-file-label admin-file-label--inline">
                          Elegir…
                          <input
                            ref={(el) => {
                              slotRefs.current[index] = el;
                            }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="admin-file-input"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              void setSlotImage(index, file);
                            }}
                          />
                        </label>
                        {src ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--secondary"
                            onClick={() => clearSlot(index)}
                          >
                            Quitar
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary">
                Guardar obra
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={onDelete}
              >
                Eliminar
              </button>
            </div>
          </form>
        ) : (
          <p className="admin-placeholder">Elige una obra o crea una nueva.</p>
        )}
      </div>
    </div>
  );
}
