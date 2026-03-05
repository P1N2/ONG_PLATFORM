"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAdmin } from "@/lib/api"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const admin = await loginAdmin({ email, password })
      localStorage.setItem("adminLogged", JSON.stringify(admin))
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Identifiants incorrects.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .login-page {
          min-height: 100vh;
          background: #1A1612;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* ── GAUCHE : visuel ── */
        .login-visual {
          position: relative;
          background: #150F0B;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3.5rem;
          overflow: hidden;
        }
        .login-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 30% 60%, rgba(192,57,43,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-visual-bg-text {
          position: absolute;
          top: -2rem;
          left: -1rem;
          font-family: 'Playfair Display', serif;
          font-size: 16rem;
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .login-visual-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C0392B;
          margin-bottom: 1rem;
          position: relative;
        }
        .login-visual-tag::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #C0392B;
        }
        .login-visual-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #F5F0E8;
          line-height: 1.2;
          position: relative;
        }
        .login-visual-title em {
          font-style: italic;
          color: #C0392B;
        }
        .login-visual-sub {
          margin-top: 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          color: #8C7B6B;
          line-height: 1.7;
          max-width: 36ch;
          position: relative;
        }

        /* ── DROITE : formulaire ── */
        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 4rem;
          background: #F5F0E8;
        }

        .login-box {
          width: 100%;
          max-width: 380px;
        }

        .login-box-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C0392B;
          display: block;
          margin-bottom: 0.5rem;
        }
        .login-box-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1A1612;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
          line-height: 1.2;
        }

        /* Champs */
        .login-field {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(26,22,18,0.12);
          margin-top: -1px;
          background: #F5F0E8;
          transition: border-color 0.25s, background 0.25s;
          position: relative;
          z-index: 0;
        }
        .login-field:focus-within {
          border-color: #1A1612;
          background: #fff;
          z-index: 1;
        }
        .login-field label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
          padding: 0.85rem 1.1rem 0;
          transition: color 0.25s;
        }
        .login-field:focus-within label { color: #C0392B; }
        .login-field input {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1A1612;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.35rem 1.1rem 0.85rem;
          width: 100%;
        }
        .login-field input::placeholder { color: rgba(26,22,18,0.22); }

        /* Erreur */
        .login-error {
          margin-top: 1rem;
          padding: 0.85rem 1.1rem;
          background: rgba(192,57,43,0.06);
          border-left: 3px solid #C0392B;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          color: #C0392B;
        }

        /* Bouton */
        .login-btn {
          margin-top: 1.75rem;
          width: 100%;
          padding: 1rem;
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
        }
        .login-btn:hover:not(:disabled) { background: #C0392B; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 768px) {
          .login-page  { grid-template-columns: 1fr; }
          .login-visual { display: none; }
          .login-form-side { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <div className="login-page">

        {/* ── VISUEL GAUCHE ── */}
        <div className="login-visual">
          <div className="login-visual-bg-text">O</div>
          <span className="login-visual-tag">ONG Platform</span>
          <h2 className="login-visual-title">
            Espace<br /><em>Administration</em>
          </h2>
          <p className="login-visual-sub">
            Accédez à votre tableau de bord pour gérer les activités,
            les services et les messages de l'ONG.
          </p>
        </div>

        {/* ── FORMULAIRE DROITE ── */}
        <div className="login-form-side">
          <div className="login-box">

            <span className="login-box-eyebrow">Accès sécurisé</span>
            <h1 className="login-box-title">Connexion<br />administrateur</h1>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@ong-platform.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Connexion en cours..." : "Se connecter →"}
              </button>
            </form>

          </div>
        </div>

      </div>
    </>
  )
}