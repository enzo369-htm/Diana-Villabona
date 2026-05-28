/** Sustituir por el número en formato internacional sin + (p. ej. 573104567890). */
export const WHATSAPP_PHONE = "573001234567";

export const SITE_NAME = "Diana Villabona";

export const NAV_ITEMS = [
  { to: "/portfolio", label: "Portafolio" },
  { to: "/piezas", label: "Tienda" },
  { to: "/bitacora", label: "Bitácora" },
  { to: "/talleres", label: "Encuentros" },
  { to: "/sobre-mi", label: "Acerca" },
] as const;

/** Sustituir por el correo real de contacto. */
export const CONTACT_EMAIL = "hola@dianavillabona.com";

export const INSTAGRAM_URL = "https://www.instagram.com/";

export function whatsappLink(prefill: string): string {
  const text = encodeURIComponent(prefill.trim());
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
