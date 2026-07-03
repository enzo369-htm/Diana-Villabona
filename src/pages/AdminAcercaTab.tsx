import { useEffect, useRef, useState } from "react";
import type { AcercaContent } from "../types/content";
import { IMAGE_MAX_SOURCE_BYTES, IMAGE_MAX_SOURCE_MB } from "../data/remoteCms";
import { cmsImageHelpText, resolveCmsImageFromFile } from "../utils/cmsImage";

type Props = {
  acerca: AcercaContent;
  setAcerca: React.Dispatch<React.SetStateAction<AcercaContent>>;
};

export function AdminAcercaTab({ acerca, setAcerca }: Props) {
  const [draft, setDraft] = useState(acerca);
  const imagenFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(acerca);
  }, [acerca]);

  const save = () => {
    setAcerca({
      texto: draft.texto.trim(),
      imagen: draft.imagen.trim(),
    });
  };

  const pickImagen = async (file: File | null) => {
    if (!file) return;
    if (file.size > IMAGE_MAX_SOURCE_BYTES) {
      window.alert(
        `"${file.name}" supera ~${IMAGE_MAX_SOURCE_MB} MB. Usa una imagen más liviana.`
      );
      return;
    }
    try {
      const url = await resolveCmsImageFromFile(file);
      setDraft((prev) => ({ ...prev, imagen: url }));
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : `No se pudo subir "${file.name}".`
      );
    } finally {
      if (imagenFileRef.current) imagenFileRef.current.value = "";
    }
  };

  return (
    <div className="admin-panel">
      <p className="admin-placeholder">
        Editá la foto y el texto de la página <strong>Acerca</strong>. Los párrafos se
        separan con una línea en blanco.
      </p>

      <form
        className="admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="admin-field">
          <span className="admin-field__label-text">Foto</span>
          <p className="admin-field__help">{cmsImageHelpText()}</p>
          <div className="admin-portada-row">
            <label className="admin-file-label admin-file-label--inline">
              Elegir imagen…
              <input
                ref={imagenFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="admin-file-input"
                onChange={(e) => {
                  void pickImagen(e.target.files?.[0] ?? null);
                }}
              />
            </label>
            {draft.imagen ? (
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => setDraft((prev) => ({ ...prev, imagen: "" }))}
              >
                Quitar foto
              </button>
            ) : null}
          </div>
          {draft.imagen ? (
            <div className="admin-portada-preview">
              <img src={draft.imagen} alt="" />
            </div>
          ) : null}
          <label className="admin-field">
            URL de imagen (opcional)
            <input
              value={draft.imagen.startsWith("data:") ? "" : draft.imagen}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, imagen: e.target.value }))
              }
              placeholder="https://…"
            />
          </label>
        </div>

        <label className="admin-field">
          Texto de la página
          <p className="admin-field__help">
            Solo texto, sin HTML. Una línea en blanco separa párrafos; un solo salto de
            línea hace un salto dentro del mismo párrafo.
          </p>
          <textarea
            value={draft.texto}
            onChange={(e) => setDraft((prev) => ({ ...prev, texto: e.target.value }))}
            rows={18}
            placeholder="Escribe aquí el texto de Acerca."
          />
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn--primary">
            Guardar Acerca
          </button>
        </div>
      </form>
    </div>
  );
}
