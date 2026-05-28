/** Número en formato internacional sin + (Colombia: 57 + celular). */
export const WHATSAPP_PHONE = "573112706016";

export const SITE_NAME = "Diana Villabona";

export const NAV_ITEMS = [
  { to: "/portfolio", label: "Portafolio" },
  { to: "/piezas", label: "Tienda" },
  { to: "/bitacora", label: "Bitácora" },
  { to: "/talleres", label: "Encuentros" },
  { to: "/sobre-mi", label: "Acerca" },
] as const;

/** Sustituir por el correo real de contacto. */
export const CONTACT_EMAIL = "villabonadiana2@gmail.com";

export const INSTAGRAM_URL = "https://www.instagram.com/dianavillabonaceramica";

export const DEVELOPER_NAME = "Enzo Federico";

export const DEVELOPER_PORTFOLIO_URL =
  "https://portfolio-web-11.vercel.app/?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

export function whatsappLink(prefill: string): string {
  const text = encodeURIComponent(prefill.trim());
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
