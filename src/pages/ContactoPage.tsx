import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "../siteConfig";

export function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent("Contacto desde la web — Diana Villabona Cerámica");
    const body = encodeURIComponent(
      `Nombre: ${nombre.trim()}\nEmail: ${email.trim()}\n\n${mensaje.trim()}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="contacto-page">
      <div className="contacto-page__inner">
        <form className="contacto-form" onSubmit={handleSubmit} noValidate>
          <div className="contacto-form__field">
            <label className="contacto-form__label" htmlFor="contacto-nombre">
              Tu nombre
            </label>
            <input
              id="contacto-nombre"
              className="contacto-form__input"
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="¿Cómo te llamás?"
              autoComplete="name"
              required
            />
          </div>

          <div className="contacto-form__field">
            <label className="contacto-form__label" htmlFor="contacto-email">
              Email
            </label>
            <input
              id="contacto-email"
              className="contacto-form__input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="contacto-form__field contacto-form__field--message">
            <label className="contacto-form__label" htmlFor="contacto-mensaje">
              Mensaje
            </label>
            <textarea
              id="contacto-mensaje"
              className="contacto-form__input contacto-form__textarea"
              name="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contanos qué te movió a escribir..."
              rows={5}
              required
            />
          </div>

          <button type="submit" className="contacto-form__submit">
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  );
}
