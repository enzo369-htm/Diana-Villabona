import {
  IMAGE_MAX_BYTES,
  IMAGE_MAX_MB,
  isRemoteCmsEnabled,
  uploadCmsImage,
} from "../data/remoteCms";

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

/** Sube al almacenamiento en la nube si está configurado; si no, data URL local (solo este navegador). */
export async function resolveCmsImageFromFile(file: File): Promise<string> {
  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error(`La imagen supera ${IMAGE_MAX_MB} MB.`);
  }

  if (isRemoteCmsEnabled()) {
    return uploadCmsImage(file);
  }

  return readImageAsDataUrl(file);
}

export function cmsImageHelpText(): string {
  if (isRemoteCmsEnabled()) {
    return "Las fotos se guardan en la nube y se ven en todos los dispositivos.";
  }
  return "Modo local: las fotos solo se ven en este navegador hasta configurar Supabase en el despliegue.";
}
