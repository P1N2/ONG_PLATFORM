"use client"

import { useState } from "react"
import { createContact } from "@/lib/api"

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      await createContact(form)
      setSuccess(true)
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setError("Une erreur est survenue lors de l'envoi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HERO ── */
        .ct-hero {
          background: #1A1612;
          padding: 6rem 5vw 4rem;
          position: relative;
          overflow: hidden;
        }
        .ct-hero::after {
          content: 'Contact';
          position: absolute;
          right: -1rem;
          bottom: -2rem;
          font-family: 'Playfair Display', serif;
          font-size: 11rem;
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .ct-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C0392B;
          margin-bottom: 1.5rem;
        }
        .ct-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #C0392B;
        }
        .ct-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 900;
          color: #F5F0E8;
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .ct-hero-title em {
          font-style: italic;
          color: #C0392B;
        }
        .ct-hero-sub {
          margin-top: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
          max-width: 48ch;
        }

        /* ── BODY ── */
        .ct-body {
          background: #F5F0E8;
          padding: 5rem 5vw;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 6rem;
          align-items: start;
        }

        /* ── INFOS GAUCHE ── */
        .ct-info {}

        .ct-info-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8C7B6B;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }

        .ct-info-block {
          margin-bottom: 2rem;
        }
        .ct-info-block-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C0392B;
          margin-bottom: 0.4rem;
          display: block;
        }
        .ct-info-block-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          color: #1A1612;
          line-height: 1.6;
        }

        .ct-info-quote {
          margin-top: 3rem;
          padding: 1.5rem;
          background: #1A1612;
          border-left: 3px solid #C0392B;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: #F5F0E8;
          line-height: 1.6;
        }

        /* ── FORMULAIRE ── */
        .ct-form-wrap {}

        .ct-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1A1612;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }

        .ct-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Ligne à 2 colonnes */
        .ct-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        /* Champ générique */
        .ct-field {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(26,22,18,0.12);
          margin-top: -1px;
          margin-left: -1px;
          transition: border-color 0.25s, background 0.25s;
          background: #F5F0E8;
        }
        .ct-field:focus-within {
          border-color: #1A1612;
          background: #fff;
          z-index: 1;
          position: relative;
        }

        .ct-field label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
          padding: 0.9rem 1.2rem 0;
          transition: color 0.25s;
        }
        .ct-field:focus-within label {
          color: #C0392B;
        }

        .ct-field input,
        .ct-field textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          color: #1A1612;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.4rem 1.2rem 0.9rem;
          resize: none;
          width: 100%;
        }
        .ct-field input::placeholder,
        .ct-field textarea::placeholder {
          color: rgba(26,22,18,0.25);
        }

       

        /* Bouton */
        .ct-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 1.5rem;
          padding: 1rem 2.5rem;
          background: #1A1612;
          color: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: background 0.3s;
          align-self: flex-start;
        }
        .ct-submit:hover:not(:disabled) { background: #C0392B; }
        .ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Feedback */
        .ct-success {
          margin-top: 1.25rem;
          padding: 1rem 1.25rem;
          background: rgba(26,22,18,0.04);
          border-left: 3px solid #2ecc71;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          color: #1A1612;
        }
        .ct-error {
          margin-top: 1.25rem;
          padding: 1rem 1.25rem;
          background: rgba(192,57,43,0.06);
          border-left: 3px solid #C0392B;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          color: #C0392B;
        }

        @media (max-width: 900px) {
          .ct-body { grid-template-columns: 1fr; gap: 3rem; }
          .ct-row  { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="ct-hero">
        <div className="ct-eyebrow">Parlons-nous</div>
        <h1 className="ct-hero-title">
          Nous <em>contacter</em>
        </h1>
        <p className="ct-hero-sub">
          Une question, une suggestion ou une envie de rejoindre notre mission ?
          Écrivez-nous, nous vous répondons sous 48h.
        </p>
      </div>

      {/* ── BODY ── */}
      <div className="ct-body">

        {/* ── Infos ── */}
        <div className="ct-info">
          <div className="ct-info-label">Nos coordonnées</div>

          <div className="ct-info-block">
            <span className="ct-info-block-label">Email</span>
            <span className="ct-info-block-value">contact@ong-platform.org</span>
          </div>

          <div className="ct-info-block">
            <span className="ct-info-block-label">Téléphone</span>
            <span className="ct-info-block-value">+00 00 00 00</span>
          </div>

          <div className="ct-info-block">
            <span className="ct-info-block-label">Adresse</span>
            <span className="ct-info-block-value">
              Aeroport <br />Niamey
            </span>
          </div>

          <div className="ct-info-block">
            <span className="ct-info-block-label">Horaires</span>
            <span className="ct-info-block-value">
              Lun – Ven : 9h00 – 18h00
            </span>
          </div>

          <div className="ct-info-quote">
            Chaque message reçu est une opportunité de faire avancer notre mission commune.
          </div>
        </div>

        {/* ── Formulaire ── */}
        <div className="ct-form-wrap">
          <div className="ct-form-title">Envoyez-nous un message</div>

          <form className="ct-form" onSubmit={handleSubmit}>

            {/* Nom + Email */}
            <div className="ct-row">
              <div className="ct-field">
                <label htmlFor="name">Nom</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ct-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Sujet */}
            <div className="ct-field">
              <label htmlFor="subject">Sujet</label>
              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="Objet de votre message"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div className="ct-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Écrivez votre message ici..."
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="ct-submit" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le message →"}
            </button>

            {/* Feedback */}
            {success && (
              <div className="ct-success">
                ✓ Votre message a bien été envoyé. Nous vous répondrons sous 48h.
              </div>
            )}
            {error && (
              <div className="ct-error">
                {error}
              </div>
            )}

          </form>
        </div>

      </div>
    </>
  )
}