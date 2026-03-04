import { getServices } from "@/lib/api"
import Image from "next/image"

type Service = {
  id: number
  title: string
  description: string
}

const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "Formation informatique"  : { src: "/assets/info.jpg",  alt: "Formation informatique" },
  "Aide alimentaire"        : { src: "/assets/aide.jpg",  alt: "Aide alimentaire" },
  "Sensibilisation santé"   : { src: "/assets/sante.jpg", alt: "Sensibilisation santé" },
  "Accompagnement scolaire" : { src: "/assets/edu.jpg",   alt: "Accompagnement scolaire" },
}

const FALLBACK_IMAGE = "/assets/info.jpg"

export default async function Services() {
  const services: Service[] = await getServices()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HERO ── */
        .srv-hero {
          background: #1A1612;
          padding: 6rem 5vw 4rem;
          position: relative;
          overflow: hidden;
        }
        .srv-hero::after {
          content: 'Services';
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
        .srv-eyebrow {
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
        .srv-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #C0392B;
        }
        .srv-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 900;
          color: #F5F0E8;
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .srv-hero-title em {
          font-style: italic;
          color: #C0392B;
        }
        .srv-hero-sub {
          margin-top: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
          max-width: 50ch;
        }

        /* ── BODY ── */
        .srv-body {
          background: #F5F0E8;
          padding: 5rem 5vw;
        }

        /* ── GRID : 4 colonnes max ── */
        .srv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 2px;
          background: rgba(26,22,18,0.10);
        }

        /* ── CARD ── */
        .srv-card {
          background: #F5F0E8;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background 0.3s;
        }
        .srv-card:hover { background: #EDE8DF; }
        .srv-card:hover .srv-card-img img { transform: scale(1.05); }
        .srv-card:hover .srv-card-img::after { background: rgba(192,57,43,0.12); }
        .srv-card:hover .srv-card-body { border-color: #C0392B; }

        /* IMAGE — hauteur réduite */
        .srv-card-img {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 2;   /* ← était 16/10, maintenant plus compact */
          overflow: hidden;
          background: #EDE8DF;
        }
        .srv-card-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(192,57,43,0);
          transition: background 0.4s;
          pointer-events: none;
          z-index: 1;
        }
        .srv-card-img img {
          transition: transform 0.6s ease;
        }

        /* Badge numéro */
        .srv-card-num {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #1A1612;
          color: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          padding: 3px 7px;
          z-index: 2;
        }

        /* CONTENU */
        .srv-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          border-top: 2px solid transparent;
          transition: border-color 0.3s;
        }
        .srv-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1.2;
          margin-bottom: 0.6rem;
        }
        .srv-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
        }

        /* ── EMPTY STATE ── */
        .srv-empty {
          padding: 5rem;
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: #8C7B6B;
          border: 1px dashed rgba(26,22,18,0.15);
        }

        @media (max-width: 600px) {
          .srv-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="srv-hero">
        <div className="srv-eyebrow">Ce que nous faisons</div>
        <h1 className="srv-hero-title">
          Nos <em>Services</em>
        </h1>
        <p className="srv-hero-sub">
          Découvrez l'ensemble de nos programmes et initiatives
          pensés pour transformer des vies, partout où le besoin se fait sentir.
        </p>
      </div>

      {/* ── GRID ── */}
      <div className="srv-body">
        {services.length === 0 ? (
          <div className="srv-empty">Aucun service disponible pour le moment.</div>
        ) : (
          <div className="srv-grid">
            {services.map((service, index) => {
              const image = SERVICE_IMAGES[service.title] ?? { src: FALLBACK_IMAGE, alt: service.title }

              return (
                <div key={service.id} className="srv-card">

                  {/* Image */}
                  <div className="srv-card-img">
                    <span className="srv-card-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 600px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Contenu */}
                  <div className="srv-card-body">
                    <h2 className="srv-card-title">{service.title}</h2>
                    <p className="srv-card-desc">{service.description}</p>
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