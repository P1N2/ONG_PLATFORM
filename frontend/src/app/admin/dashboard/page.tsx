"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getActivitiesWithImages, getServices } from "@/lib/api"

type Stats = {
  activities: number
  services: number
  messages: number
}

const quickLinks = [
  { href: "/admin/activities", label: "Activités",  desc: "Gérer les événements terrain" },
  { href: "/admin/services",   label: "Services",   desc: "Gérer les programmes proposés" },
  { href: "/admin/messages",   label: "Messages",   desc: "Consulter les contacts reçus" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats]     = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }

    // Charge les compteurs en parallèle
    Promise.all([getActivitiesWithImages(), getServices()])
      .then(([activities, services]) => {
        setStats({
          activities: activities.length,
          services:   services.length,
          messages:   0,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HEADER ── */
        .dash-header {
          margin-bottom: 3rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }
        .dash-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C0392B;
          margin-bottom: 0.75rem;
        }
        .dash-eyebrow::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #C0392B;
        }
        .dash-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1.1;
        }
        .dash-title em { font-style: italic; color: #C0392B; }
        .dash-sub {
          margin-top: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          color: #8C7B6B;
        }

        /* ── STATS GRID ── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: rgba(26,22,18,0.08);
          margin-bottom: 3rem;
        }

        .dash-stat {
          background: #F5F0E8;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          border-top: 2px solid transparent;
          transition: background 0.25s, border-color 0.25s;
        }
        .dash-stat:hover {
          background: #EDE8DF;
          border-color: #C0392B;
        }

        .dash-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
        }
        .dash-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: #1A1612;
          line-height: 1;
        }
        .dash-stat-value.loading {
          background: rgba(26,22,18,0.07);
          color: transparent;
          width: 60px;
          height: 2.8rem;
          border-radius: 2px;
          animation: dash-shimmer 1.2s ease-in-out infinite;
        }
        @keyframes dash-shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        .dash-stat-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          color: #8C7B6B;
        }

        /* ── QUICK LINKS ── */
        .dash-section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8C7B6B;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(26,22,18,0.10);
        }

        .dash-links {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: rgba(26,22,18,0.08);
        }

        .dash-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F5F0E8;
          padding: 1.25rem 1.75rem;
          text-decoration: none;
          transition: background 0.25s;
          group: true;
        }
        .dash-link:hover { background: #EDE8DF; }
        .dash-link:hover .dash-link-arrow { opacity: 1; transform: translateX(0); }

        .dash-link-left {}
        .dash-link-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1A1612;
          display: block;
          margin-bottom: 2px;
        }
        .dash-link-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 300;
          color: #8C7B6B;
        }
        .dash-link-arrow {
          font-size: 0.9rem;
          color: #C0392B;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.25s, transform 0.25s;
        }

        @media (max-width: 640px) {
          .dash-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="dash-header">
        <div className="dash-eyebrow">Administration</div>
        <h1 className="dash-title">Tableau de <em>bord</em></h1>
        <p className="dash-sub">Bienvenue dans l'espace d'administration de l'ONG Platform.</p>
      </div>

      {/* ── STATS ── */}
      <div className="dash-stats">
        {[
          { label: "Activités",  value: stats?.activities, hint: "événements enregistrés" },
          { label: "Services",   value: stats?.services,   hint: "programmes actifs" },
          { label: "Messages",   value: stats?.messages,   hint: "contacts reçus" },
        ].map((s) => (
          <div key={s.label} className="dash-stat">
            <span className="dash-stat-label">{s.label}</span>
            <span className={`dash-stat-value ${loading ? "loading" : ""}`}>
              {loading ? "" : s.value}
            </span>
            <span className="dash-stat-hint">{s.hint}</span>
          </div>
        ))}
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="dash-section-label">Accès rapide</div>
      <div className="dash-links">
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href} className="dash-link">
            <div className="dash-link-left">
              <span className="dash-link-name">{link.label}</span>
              <span className="dash-link-desc">{link.desc}</span>
            </div>
            <span className="dash-link-arrow">→</span>
          </a>
        ))}
      </div>
    </>
  )
}