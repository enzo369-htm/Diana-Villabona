import { getAdminPassphrase } from "../lib/adminAuth";
import {
  getSupabaseBrowser,
  hasSupabaseBrowserEnv,
  isRemoteCmsEnabled,
} from "../lib/supabaseClient";
import {
  normalizeDeletedIds,
  normalizeStoredAcerca,
  normalizeStoredObraPortfolio,
  normalizeStoredPost,
  normalizeStoredTaller,
  type StoredCms,
} from "./contentStore";

export { isRemoteCmsEnabled };

const CATALOG_ID = "main";
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_MAX_MB = IMAGE_MAX_BYTES / (1024 * 1024);
/** Tope del archivo original antes de comprimir (la compresión suele dejarlo muy por debajo). */
export const IMAGE_MAX_SOURCE_BYTES = 30 * 1024 * 1024;
export const IMAGE_MAX_SOURCE_MB = IMAGE_MAX_SOURCE_BYTES / (1024 * 1024);

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
    acerca: normalizeStoredAcerca(data.acerca),
    deletedIds: normalizeDeletedIds(
      (data as { deletedIds?: unknown }).deletedIds
    ),
  };
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const json = JSON.parse(text) as { error?: string };
    if (json.error) return json.error;
  } catch {
    /* respuesta no JSON */
  }
  if (text.includes("FUNCTION_INVOCATION_FAILED")) {
    return "El servidor del CMS falló al arrancar. Revisá el deploy en Vercel y las variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.";
  }
  return text.trim() || fallback;
}

async function fetchCatalogFromApi(): Promise<StoredCms | null> {
  const res = await fetch("/api/cms");
  if (!res.ok) {
    throw new Error(
      await readApiError(res, `Error al cargar catálogo (${res.status})`)
    );
  }
  const payload: unknown = await res.json();
  if (payload === null) return null;
  return normalizeRemotePayload(payload);
}

export async function fetchRemoteCatalog(): Promise<StoredCms | null> {
  if (import.meta.env.PROD) {
    return fetchCatalogFromApi();
  }

  if (hasSupabaseBrowserEnv()) {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase
      .from("site_catalog")
      .select("payload")
      .eq("id", CATALOG_ID)
      .maybeSingle();

    if (error) throw error;
    return normalizeRemotePayload(data?.payload);
  }

  try {
    return await fetchCatalogFromApi();
  } catch {
    return null;
  }
}

export async function saveRemoteCatalog(data: StoredCms): Promise<void> {
  const pass = getAdminPassphrase();
  if (!pass) {
    throw new Error(
      "Sesión expirada. Cerrá esta pestaña, volvé a entrar en /admin e intentá de nuevo."
    );
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
    throw new Error(`La imagen supera ${IMAGE_MAX_MB} MB.`);
  }

  const pass = getAdminPassphrase();
  if (!pass) {
    throw new Error("Iniciá sesión en /admin antes de subir imágenes.");
  }

  const signRes = await fetch("/api/upload-sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pass}`,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "image/jpeg",
      size: file.size,
    }),
  });

  if (!signRes.ok) {
    const err = (await signRes.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Error al preparar subida (${signRes.status})`);
  }

  const signJson = (await signRes.json()) as {
    signedUrl?: string;
    publicUrl?: string;
  };

  if (!signJson.signedUrl || !signJson.publicUrl) {
    throw new Error("El servidor no devolvió datos de subida.");
  }

  const uploadRes = await fetch(signJson.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "image/jpeg",
    },
    body: file,
  });

  if (!uploadRes.ok) {
    const detail = await uploadRes.text().catch(() => "");
    throw new Error(
      detail
        ? `Error al subir imagen: ${detail.slice(0, 200)}`
        : `Error al subir (${uploadRes.status})`
    );
  }

  return signJson.publicUrl;
}
