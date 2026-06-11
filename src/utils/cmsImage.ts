import {
  IMAGE_MAX_BYTES,
  IMAGE_MAX_MB,
  isRemoteCmsEnabled,
  uploadCmsImage,
} from "../data/remoteCms";

/** Lado mayor máximo (px) tras el redimensionado. */
const MAX_DIMENSION = 1800;
/** Calidad WebP/JPEG del recomprimido. */
const COMPRESS_QUALITY = 0.82;
/** Por debajo de esto no vale la pena recomprimir. */
const COMPRESS_MIN_BYTES = 320 * 1024;

function readImageAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo decodificar la imagen."));
    img.src = src;
  });
}

/**
 * Redimensiona y recomprime en el navegador para que las fotos de cámara
 * (varios MB) no fallen al subir ni ocupen de más. Devuelve el archivo original
 * si la compresión no ayuda o si el formato no es recomprimible (gif, etc.).
 */
export async function compressImageFile(file: File): Promise<File> {
  const recompressible =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp";

  if (!recompressible) return file;
  if (file.size < COMPRESS_MIN_BYTES) return file;
  if (typeof document === "undefined") return file;

  try {
    const dataUrl = await readImageAsDataUrl(file);
    const img = await loadImage(dataUrl);

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", COMPRESS_QUALITY)
    );

    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    return file;
  }
}

/** Sube al almacenamiento en la nube si está configurado; si no, data URL local (solo este navegador). */
export async function resolveCmsImageFromFile(file: File): Promise<string> {
  if (isRemoteCmsEnabled()) {
    const optimized = await compressImageFile(file);
    if (optimized.size > IMAGE_MAX_BYTES) {
      throw new Error(`La imagen supera ${IMAGE_MAX_MB} MB incluso comprimida.`);
    }
    return uploadCmsImage(optimized);
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error(`La imagen supera ${IMAGE_MAX_MB} MB.`);
  }
  return readImageAsDataUrl(file);
}

export function cmsImageHelpText(): string {
  if (isRemoteCmsEnabled()) {
    return "Las fotos se guardan en la nube y se ven en todos los dispositivos. Se optimizan automáticamente al subir.";
  }
  return "Modo local: las fotos solo se ven en este navegador hasta configurar Supabase en el despliegue.";
}
