import { getActivitiesWithImages } from "@/lib/api"
import Image from "next/image"

// ── Type ──────────────────────────────────────────────────────────────────────

type Activity = {
  id: number
  title: string
  description: string
  activity_date: string
  images: string[] // URLs directement dans l'objet activité
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function Activities() {
  const activities: Activity[] = await getActivitiesWithImages()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HERO ── */
        .act-hero {
          background: #1A1612;
          padding: 6rem 5vw 4rem;
          position: relative;
          overflow: hidden;
        }
        .act-hero::after {
          content: 'Activités';
          position: absolute;
          right: -1rem;
          bottom: -2rem;
          font-family: 'Playfair Display', serif;
          font-size: 10rem;
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .act-eyebrow {
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
        .act-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #C0392B;
        }
        .act-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 900;
          color: #F5F0E8;
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .act-hero-title em {
          font-style: italic;
          color: #C0392B;
        }
        .act-hero-sub {
          margin-top: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
          max-width: 50ch;
        }

        /* ── BODY ── */
        .act-body {
          background: #F5F0E8;
          padding: 5rem 5vw;
        }

        /* ── LIST ── */
        .act-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(26,22,18,0.12);
        }

        /* ── CARD ── */
        .act-card {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          border-bottom: 1px solid rgba(26,22,18,0.12);
          background: #F5F0E8;
          transition: background 0.3s;
          min-height: 300px;
        }
        .act-card:nth-child(even) {
          direction: rtl;
        }
        .act-card:nth-child(even) > * {
          direction: ltr;
        }
        .act-card:hover { background: #EDE8DF; }

        /* ── TEXTE ── */
        .act-content {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .act-card-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(26,22,18,0.25);
          margin-bottom: 0.5rem;
        }
        .act-date {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C0392B;
          margin-bottom: 1.25rem;
        }
        .act-date::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: #C0392B;
        }
        .act-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          font-weight: 700;
          color: #1A1612;
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }
        .act-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.8;
          color: #8C7B6B;
        }

        /* ── IMAGES ── */
        .act-images {
          position: relative;
          overflow: hidden;
          background: #EDE8DF;
        }
        /* 1 image → plein format */
        .act-images.count-1 .img-slot {
          position: absolute;
          inset: 0;
        }
        /* 2 images → côte à côte */
        .act-images.count-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        /* 3+ images → 1 grande + colonne 2 */
        .act-images.count-3 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }
        .act-images.count-3 .img-slot:first-child {
          grid-row: 1 / 3;
        }
        .img-slot {
          position: relative;
          overflow: hidden;
        }
        .img-slot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .act-card:hover .img-slot img { transform: scale(1.04); }

        .act-images.count-2 .img-slot + .img-slot,
        .act-images.count-3 .img-slot:not(:first-child) {
          border-left: 2px solid #F5F0E8;
        }
        .act-images.count-3 .img-slot:last-child {
          border-top: 2px solid #F5F0E8;
        }

        .act-no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 200px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: rgba(26,22,18,0.2);
        }

        /* ── EMPTY STATE ── */
        .act-empty {
          padding: 5rem;
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: #8C7B6B;
          border: 1px dashed rgba(26,22,18,0.15);
        }

        @media (max-width: 768px) {
          .act-card,
          .act-card:nth-child(even) {
            grid-template-columns: 1fr;
            direction: ltr;
          }
          .act-images { height: 220px; }
          .act-images.count-1 .img-slot { position: absolute; inset: 0; height: auto; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="act-hero">
        <div className="act-eyebrow">Sur le terrain</div>
        <h1 className="act-hero-title">
          Nos <em>Activités</em>
        </h1>
        <p className="act-hero-sub">
          Retrouvez ici toutes nos actions passées et à venir —
          ateliers, distributions, campagnes de sensibilisation et bien plus.
        </p>
      </div>

      {/* ── LISTE ── */}
      <div className="act-body">
        {activities.length === 0 ? (
          <div className="act-empty">Aucune activité disponible pour le moment.</div>
        ) : (
          <div className="act-list">
            {activities.map((activity, index) => {
              // On limite à 3 slots max pour la mise en page
              const displayedImages = activity.images.slice(0, 3)
              const imgCount = displayedImages.length

              return (
                <div key={activity.id} className="act-card">

                  {/* ── Texte ── */}
                  <div className="act-content">
                    <span className="act-card-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="act-date">
                      {formatDate(activity.activity_date)}
                    </span>
                    <h2 className="act-title">{activity.title}</h2>
                    <p className="act-desc">{activity.description}</p>
                  </div>

                  {/* ── Images ── */}
                  <div className={`act-images${imgCount > 0 ? ` count-${imgCount}` : ""}`}>
                    {imgCount === 0 ? (
                      <div className="act-no-image">Aucune photo</div>
                    ) : (
                      displayedImages.map((url, i) => (
                        <div key={i} className="img-slot">
                          <Image
                            src={url}
                            alt={`${activity.title} — photo ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}