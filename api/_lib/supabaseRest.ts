export function getSupabaseConfig(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el servidor.");
  }
  return { url: url.replace(/\/$/, ""), key };
}

function serviceHeaders(key: string, extra?: Record<string, string>): HeadersInit {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra,
  };
}

export async function fetchCatalogPayload(): Promise<unknown | null> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(
    `${url}/rest/v1/site_catalog?id=eq.main&select=payload`,
    {
      headers: {
        ...serviceHeaders(key),
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase respondió ${res.status}`);
  }

  const rows = (await res.json()) as Array<{ payload?: unknown }>;
  return rows[0]?.payload ?? null;
}

export async function upsertCatalogPayload(payload: unknown): Promise<void> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/site_catalog`, {
    method: "POST",
    headers: {
      ...serviceHeaders(key, { "Content-Type": "application/json" }),
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: "main",
      payload,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase respondió ${res.status}`);
  }
}

export async function createSignedUploadUrl(
  storagePath: string
): Promise<{ signedUrl: string; path: string }> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(
    `${url}/storage/v1/object/upload/sign/cms-media/${storagePath}`,
    {
      method: "POST",
      headers: serviceHeaders(key, { "Content-Type": "application/json" }),
      body: "{}",
    }
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Storage respondió ${res.status}`);
  }

  const data = (await res.json()) as {
    signedUrl?: string;
    signedURL?: string;
    path?: string;
    url?: string;
  };

  const signedUrl = data.signedUrl ?? data.signedURL ?? data.url;
  if (!signedUrl) {
    throw new Error("Storage no devolvió URL firmada.");
  }

  return { signedUrl, path: data.path ?? storagePath };
}

export function publicMediaUrl(storagePath: string): string {
  const { url } = getSupabaseConfig();
  return `${url}/storage/v1/object/public/cms-media/${storagePath}`;
}

export async function uploadMediaBuffer(
  storagePath: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const { url, key } = getSupabaseConfig();
  const res = await fetch(`${url}/storage/v1/object/cms-media/${storagePath}`, {
    method: "POST",
    headers: {
      ...serviceHeaders(key, { "Content-Type": contentType }),
      "x-upsert": "false",
    },
    body: buffer,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Storage respondió ${res.status}`);
  }
}
