export function assertAdminAuth(authHeader: string | undefined): boolean {
  const secret = process.env.CMS_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  return token.length > 0 && token === secret;
}
