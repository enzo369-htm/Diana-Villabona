import { getAdminPassphrase } from "../lib/adminAuth";
import { getSupabaseBrowser, isRemoteCmsEnabled } from "../lib/supabaseClient";
import {
  normalizeStoredObraPortfolio,
  normalizeStoredPost,
  normalizeStoredTaller,
  type StoredCms,
} from "./contentStore";

export { isRemoteCmsEnabled };

const CATALOG_ID = "main";
export const IMAGE_MAX_BYTES = 2.5 * 1024 * 1024;

function normalizeRemotePayload(raw: unknown): StoredCms | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<StoredCms>;
  if (!Array.isArray(data.piezas) || !Array.isArray(data.posts)) return null;
  return {
    piezas: data.piezas,
    posts: data.posts.map(normalizeStoredPost),
    obrasPortfolio: Array.isArray(data.obrasPortfolio)
      ? data.obrasPortfolio.map(normalizeStoredObraPortfolio)
      : [],
    talleres: Array.isArray(data.talleres)
      ? data.talleres.map(normalizeStoredTaller)
      : [],
  };
}

export async function fetchRemoteCatalog(): Promise<StoredCms | null> {
  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase
    .from("site_catalog")
    .select("payload")
    .eq("id", CATALOG_ID)
    .maybeSingle();

  if (error) throw error;
  return normalizeRemotePayload(data?.payload);
}

export async function saveRemoteCatalog(data: StoredCms): Promise<void> {
  const pass = getAdminPassphrase();
  if (!pass) {
    throw new Error("Sesión de administración sin contraseña.");
  }

  const res = await fetch("/api/cms", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pass}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Error al guardar (${res.status})`);
  }
}

export async function uploadCmsImage(file: File): Promise<string> {
  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error("La imagen supera 2,5 MB.");
  }

  const pass = getAdminPassphrase();
  if (!pass) {
    throw new Error("Iniciá sesión en /admin antes de subir imágenes.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });

  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1]! : dataUrl;

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pass}`,
    },
    body: JSON.stringify({
      file: base64,
      filename: file.name,
      contentType: file.type || "image/jpeg",
    }),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Error al subir (${res.status})`);
  }

  const json = (await res.json()) as { url?: string };
  if (!json.url) {
    throw new Error("El servidor no devolvió la URL de la imagen.");
  }
  return json.url;
}

export async function pushLocalCatalogToRemote(
  data: StoredCms
): Promise<void> {
  await saveRemoteCatalog(data);
}
