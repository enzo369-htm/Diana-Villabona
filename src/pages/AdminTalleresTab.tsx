import type { EstadoTaller, Taller } from "../types/content";

const ESTADOS: { value: EstadoTaller; label: string }[] = [
  { value: "proximo", label: "Próximo" },
  { value: "en_curso", label: "En curso" },
  { value: "archivo", label: "Archivo" },
];

export function newEmptyTaller(): Taller {
  return {
    id: `t-${Date.now()}`,
    titulo: "",
    fecha: "",
    descripcion: "",
    estado: "proximo",
    enlace: "",
    orden: 999,
  };
}

type AdminTalleresTabProps = {
  talleres: Taller[];
  draft: Taller | null;
  setDraft: (taller: Taller | null) => void;
  onSave: () => void;
  onDelete: () => void;
};

export function AdminTalleresTab({
  talleres,
  draft,
  setDraft,
  onSave,
  onDelete,
}: AdminTalleresTabProps) {
  return (
    <div className="admin-split">
      <aside className="admin-list-panel">
        <div className="admin-list-head">
          <h2 className="admin-h2">Talleres ({talleres.length})</h2>
          <button
            type="button"
            className="admin-btn"
            onClick={() => setDraft(newEmptyTaller())}
          >
            Nuevo taller
          </button>
        </div>
        <p className="admin-field__help" style={{ margin: "0 0 0.75rem" }}>
          En la web se muestran hasta 6 tarjetas, ordenadas por el campo Orden.
        </p>
        <ul className="admin-id-list">
          {talleres.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={
                  draft?.id === t.id
                    ? "admin-id-list__btn admin-id-list__btn--on"
                    : "admin-id-list__btn"
                }
                onClick={() => setDraft({ ...t, enlace: t.enlace ?? "" })}
              >
                <span className="admin-id-list__title">{t.titulo || t.id}</span>
                <span className="admin-id-list__meta">{t.estado}</span>
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
              <strong>ID</strong> (no cambiar si ya está publicado):{" "}
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
              Descripción
              <textarea
                value={draft.descripcion}
                onChange={(e) =>
                  setDraft({ ...draft, descripcion: e.target.value })
                }
                rows={6}
                placeholder="Texto que aparece en la tarjeta."
              />
            </label>
            <label className="admin-field">
              Enlace (Explorar)
              <input
                type="url"
                value={draft.enlace ?? ""}
                onChange={(e) => setDraft({ ...draft, enlace: e.target.value })}
                placeholder="https://wa.me/... o dejar vacío para WhatsApp automático"
              />
              <span className="admin-field__help">
                URL completa. Si está vacío, el botón abre WhatsApp con el nombre
                del taller.
              </span>
            </label>
            <label className="admin-field">
              Fecha (opcional, YYYY-MM-DD)
              <input
                value={draft.fecha}
                onChange={(e) => setDraft({ ...draft, fecha: e.target.value })}
                placeholder="2026-06-07"
              />
            </label>
            <label className="admin-field">
              Estado
              <select
                value={draft.estado}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    estado: e.target.value as EstadoTaller,
                  })
                }
              >
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              Orden en la grilla (número menor = más arriba)
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
            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary">
                Guardar taller
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
          <p className="admin-placeholder">Elige un taller o crea uno nuevo.</p>
        )}
      </div>
    </div>
  );
}
