"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getServices } from "@/lib/api"

type Service = {
  id: number
  title: string
  description: string
}

export default function AdminServices() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }
    getServices()
      .then(setServices)
      .catch(() => setError("Impossible de récupérer les services."))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HEADER ── */
        .as-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }
        .as-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1;
        }
        .as-title em { font-style: italic; color: #C0392B; }
        .as-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
        }

        /* ── STATES ── */
        .as-state {
          padding: 3rem;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #8C7B6B;
          border: 1px dashed rgba(26,22,18,0.15);
          background: #F5F0E8;
        }
        .as-state.error {
          border-color: #C0392B;
          color: #C0392B;
          background: rgba(192,57,43,0.04);
        }
        .as-loading-bar {
          width: 40px;
          height: 2px;
          background: #C0392B;
          margin: 0 auto 1rem;
          animation: as-pulse 1.2s ease-in-out infinite;
        }
        @keyframes as-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50%       { opacity: 1;   transform: scaleX(1); }
        }

        /* ── GRID ── */
        .as-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
          background: rgba(26,22,18,0.08);
        }

        /* ── CARD ── */
        .as-card {
          background: #F5F0E8;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 2px solid transparent;
          transition: background 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }
        .as-card:hover {
          background: #EDE8DF;
          border-color: #C0392B;
        }
        .as-card:hover .as-card-icon {
          color: #C0392B;
        }

        /* Watermark letter */
        .as-card-watermark {
          position: absolute;
          bottom: -1rem;
          right: -0.5rem;
          font-family: 'Playfair Display', serif;
          font-size: 6rem;
          font-weight: 900;
          color: rgba(26,22,18,0.04);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: color 0.25s;
        }
        .as-card:hover .as-card-watermark {
          color: rgba(192,57,43,0.06);
        }

        /* Top row */
        .as-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .as-card-icon {
          width: 38px;
          height: 38px;
          border: 1px solid rgba(26,22,18,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1A1612;
          transition: color 0.25s, border-color 0.25s;
          flex-shrink: 0;
        }
        .as-card:hover .as-card-icon {
          border-color: #C0392B;
        }
        .as-card-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(26,22,18,0.22);
          padding-top: 2px;
        }

        /* Content */
        .as-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1.2;
          margin-bottom: 0.6rem;
        }
        .as-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
          flex: 1;
        }

        /* Footer */
        .as-card-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(26,22,18,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .as-id-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.22);
          border: 1px solid rgba(26,22,18,0.1);
          padding: 3px 8px;
        }
        .as-card-arrow {
          font-size: 0.75rem;
          color: #C0392B;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.25s, transform 0.25s;
        }
        .as-card:hover .as-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="as-header">
        <h1 className="as-title">Nos <em>Services</em></h1>
        {!loading && !error && (
          <span className="as-count">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="as-state">
          <div className="as-loading-bar" />
          Chargement des services...
        </div>
      )}

      {/* ── ERROR ── */}
      {error && <div className="as-state error">{error}</div>}

      {/* ── EMPTY ── */}
      {!loading && !error && services.length === 0 && (
        <div className="as-state">Aucun service enregistré pour le moment.</div>
      )}

      {/* ── GRID ── */}
      {!loading && !error && services.length > 0 && (
        <div className="as-grid">
          {services.map((service, index) => (
            <div key={service.id} className="as-card">

              <div className="as-card-watermark">
                {service.title.charAt(0)}
              </div>

              <div className="as-card-top">
                <div className="as-card-icon">{service.title.charAt(0)}</div>
                <span className="as-card-num">{String(index + 1).padStart(2, "0")}</span>
              </div>

              <h2 className="as-card-title">{service.title}</h2>
              <p className="as-card-desc">{service.description}</p>

              <div className="as-card-footer">
                <span className="as-id-badge">ID #{service.id}</span>
                <span className="as-card-arrow">→</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </>
  )
}