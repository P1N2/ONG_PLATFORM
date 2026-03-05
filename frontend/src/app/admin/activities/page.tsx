"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getActivitiesWithImages } from "@/lib/api"
import Image from "next/image"

type Activity = {
  id: number
  title: string
  description: string
  activity_date: string
  images: string[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function AdminActivities() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    if (!localStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }
    getActivitiesWithImages()
      .then(setActivities)
      .catch(() => setError("Impossible de récupérer les activités."))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── PAGE HEADER ── */
        .aa-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }
        .aa-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1;
        }
        .aa-title em { font-style: italic; color: #C0392B; }
        .aa-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
        }

        /* ── STATES ── */
        .aa-state {
          padding: 3rem;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #8C7B6B;
          border: 1px dashed rgba(26,22,18,0.15);
          background: #F5F0E8;
        }
        .aa-state.error {
          border-color: #C0392B;
          color: #C0392B;
          background: rgba(192,57,43,0.04);
        }
        .aa-loading-bar {
          width: 40px;
          height: 2px;
          background: #C0392B;
          margin: 0 auto 1rem;
          animation: aa-pulse 1.2s ease-in-out infinite;
        }
        @keyframes aa-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50%       { opacity: 1;   transform: scaleX(1); }
        }

        /* ── LIST ── */
        .aa-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: rgba(26,22,18,0.08);
        }

        /* ── CARD ── */
        .aa-card {
          background: #F5F0E8;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          padding: 1.75rem 2rem;
          align-items: start;
          transition: background 0.25s;
        }
        .aa-card:hover { background: #EDE8DF; }

        .aa-card-left {}

        /* Meta */
        .aa-card-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.6rem;
        }
        .aa-card-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(26,22,18,0.25);
        }
        .aa-card-date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C0392B;
        }
        .aa-card-date::before {
          content: '';
          display: block;
          width: 14px;
          height: 1px;
          background: #C0392B;
        }

        /* Title + desc */
        .aa-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
          margin-bottom: 0.4rem;
          line-height: 1.2;
        }
        .aa-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 1.7;
          color: #8C7B6B;
          max-width: 60ch;
        }

        /* Images strip */
        .aa-card-images {
          display: flex;
          gap: 4px;
          margin-top: 1rem;
        }
        .aa-card-img {
          position: relative;
          width: 64px;
          height: 64px;
          overflow: hidden;
          flex-shrink: 0;
          background: #EDE8DF;
        }
        .aa-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .aa-card:hover .aa-card-img img { transform: scale(1.08); }

        /* Extra count badge */
        .aa-img-more {
          width: 64px;
          height: 64px;
          background: #1A1612;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          color: #F5F0E8;
          flex-shrink: 0;
        }

        /* No image pill */
        .aa-no-img {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.3);
        }

        /* Right: id badge */
        .aa-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          padding-top: 0.2rem;
        }
        .aa-id-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.2);
          border: 1px solid rgba(26,22,18,0.1);
          padding: 3px 8px;
        }
        .aa-img-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 400;
          color: #8C7B6B;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="aa-header">
        <h1 className="aa-title">Nos <em>Activités</em></h1>
        {!loading && !error && (
          <span className="aa-count">{activities.length} activité{activities.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="aa-state">
          <div className="aa-loading-bar" />
          Chargement des activités...
        </div>
      )}

      {/* ── ERROR ── */}
      {error && <div className="aa-state error">{error}</div>}

      {/* ── EMPTY ── */}
      {!loading && !error && activities.length === 0 && (
        <div className="aa-state">Aucune activité enregistrée pour le moment.</div>
      )}

      {/* ── LIST ── */}
      {!loading && !error && activities.length > 0 && (
        <div className="aa-list">
          {activities.map((activity, index) => {
            const previewImgs = activity.images.slice(0, 4)
            const extraCount  = activity.images.length - 4

            return (
              <div key={activity.id} className="aa-card">

                <div className="aa-card-left">
                  {/* Meta */}
                  <div className="aa-card-meta">
                    <span className="aa-card-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="aa-card-date">{formatDate(activity.activity_date)}</span>
                  </div>

                  {/* Titre + description */}
                  <h2 className="aa-card-title">{activity.title}</h2>
                  <p className="aa-card-desc">{activity.description}</p>

                  {/* Images */}
                  {activity.images.length > 0 ? (
                    <div className="aa-card-images">
                      {previewImgs.map((url, i) => (
                        <div key={i} className="aa-card-img">
                          <Image
                            src={url}
                            alt={`${activity.title} — photo ${i + 1}`}
                            fill
                            sizes="64px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ))}
                      {extraCount > 0 && (
                        <div className="aa-img-more">+{extraCount}</div>
                      )}
                    </div>
                  ) : (
                    <span className="aa-no-img">— Aucune photo</span>
                  )}
                </div>

                {/* Right */}
                <div className="aa-card-right">
                  <span className="aa-id-badge">ID #{activity.id}</span>
                  {activity.images.length > 0 && (
                    <span className="aa-img-count">
                      {activity.images.length} photo{activity.images.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </>
  )
}