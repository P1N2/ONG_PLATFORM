"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"


const services = [
  {
    title: "Éducation",
    number: "01",
    desc: "Nous croyons que chaque enfant mérite un accès à une éducation de qualité, où qu'il soit.",
    icon: "✦",
  },
  {
    title: "Aide humanitaire",
    number: "02",
    desc: "Intervention rapide et durable dans les zones en crise pour répondre aux besoins fondamentaux.",
    icon: "◈",
  },
  {
    title: "Formation",
    number: "03",
    desc: "Des programmes de formation qui donnent aux communautés les outils pour s'autonomiser.",
    icon: "◇",
  },
]

const fallbackQuotes = [
  {
    author: "Mère Teresa",
    text: "On ne peut pas toujours faire de grandes choses, mais on peut faire de petites choses avec un grand amour.",
  },
  {
    author: "Nelson Mandela",
    text: "L'éducation est l'arme la plus puissante que l'on puisse utiliser pour changer le monde.",
  },
  {
    author: "Martin Luther King Jr.",
    text: "La question la plus persistante et urgente de la vie est : Que faites-vous pour les autres ?",
  },
]

type Testimonial = {
  id: number
  name: string
  subject: string
  message: string
}

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #F5F0E8;
          --ink: #1A1612;
          --rouge: #C0392B;
          --warm-gray: #8C7B6B;
          --pale: #EDE8DF;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--cream);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
        }

        .page {
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 6rem 5vw 4rem;
          gap: 4rem;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 70% at 70% 50%, rgba(192,57,43,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-left {
          position: relative;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rouge);
          margin-bottom: 2rem;
        }

        .hero-tag::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--rouge);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 6vw, 6rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--ink);
        }

        .hero-title em {
          font-style: italic;
          color: var(--rouge);
        }

        .hero-desc {
          margin-top: 2rem;
          font-size: 1rem;
          line-height: 1.75;
          color: var(--warm-gray);
          max-width: 38ch;
          font-weight: 300;
        }

        .hero-cta {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 2.2rem;
          background: var(--ink);
          color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.3s, transform 0.3s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }

        .btn-primary:hover {
          background: var(--rouge);
          transform: translateY(-2px);
        }

        .btn-primary::after {
          content: '→';
          font-size: 1rem;
        }

        .hero-stat {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: var(--warm-gray);
          letter-spacing: 0.05em;
        }

        .hero-stat strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 4px;
        }

        /* Right side visual */
        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-visual {
          position: relative;
          width: 100%;
          max-width: 460px;
          aspect-ratio: 4/5;
        }

        .visual-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--pale) 0%, #DED5C5 100%);
          border-radius: 2px;
        }

        .visual-line {
          position: absolute;
          top: -20px;
          left: -20px;
          right: 20px;
          bottom: 20px;
          border: 1.5px solid var(--rouge);
          border-radius: 2px;
          opacity: 0.4;
        }

        .visual-quote {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          background: rgba(26,22,18,0.92);
          color: var(--cream);
          padding: 1.5rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          line-height: 1.5;
        }

        .visual-quote::before {
          content: '"';
          display: block;
          font-size: 3rem;
          color: var(--rouge);
          line-height: 0.7;
          margin-bottom: 0.5rem;
        }

        .visual-number {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-family: 'Playfair Display', serif;
          font-size: 7rem;
          font-weight: 900;
          color: var(--rouge);
          opacity: 0.12;
          line-height: 1;
          user-select: none;
        }

        /* ─── SERVICES ─── */
        .services {
          padding: 8rem 5vw;
          position: relative;
        }

        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-top: 1px solid rgba(26,22,18,0.15);
          padding-top: 2rem;
          margin-bottom: 5rem;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--warm-gray);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: var(--ink);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        .service-card {
          position: relative;
          padding: 3rem 2.5rem;
          border-left: 1px solid rgba(26,22,18,0.12);
          transition: background 0.4s;
          cursor: default;
        }

        .service-card:last-child {
          border-right: 1px solid rgba(26,22,18,0.12);
        }

        .service-card:hover {
          background: var(--pale);
        }

        .service-card:hover .service-icon {
          color: var(--rouge);
          transform: rotate(90deg);
        }

        .service-number {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--warm-gray);
          margin-bottom: 2rem;
        }

        .service-icon {
          font-size: 1.5rem;
          color: var(--ink);
          display: block;
          margin-bottom: 1.5rem;
          transition: color 0.3s, transform 0.5s;
        }

        .service-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .service-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--warm-gray);
          font-weight: 300;
        }

        .service-arrow {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 36px;
          height: 36px;
          border: 1px solid var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s, transform 0.3s;
        }

        .service-card:hover .service-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        /* ─── TÉMOIGNAGES ─── */
        .testimonials {
          padding: 0 5vw 6rem;
          background: #F5F0E8;
        }
        .testimonials-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }
        .testimonials-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--ink);
        }
        .testimonials-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--warm-gray);
        }
        .testimonials-strip {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
        }
        .testimonial-card {
          min-width: 260px;
          max-width: 320px;
          background: #FFFFFF;
          border: 1px solid rgba(26,22,18,0.08);
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .testimonial-subject {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C0392B;
        }
        .testimonial-message {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1A1612;
          line-height: 1.7;
        }
        .testimonial-author {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--warm-gray);
        }

        /* ─── CTA ─── */
        .cta-section {
          margin: 0 5vw 8rem;
          background: var(--ink);
          padding: 6rem 5vw;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 4rem;
        }

        .cta-section::before {
          content: 'ONG';
          position: absolute;
          right: -1rem;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Playfair Display', serif;
          font-size: 18rem;
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .cta-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rouge);
          margin-bottom: 1.5rem;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: var(--cream);
          line-height: 1.15;
        }

        .cta-title em {
          font-style: italic;
          color: var(--rouge);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 1.1rem 2.5rem;
          border: 1.5px solid var(--cream);
          color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
          flex-shrink: 0;
        }

        .btn-outline:hover {
          background: var(--rouge);
          border-color: var(--rouge);
        }

        .btn-outline::after { content: '→'; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 5rem; }
          .hero-right { display: none; }
          .services-grid { grid-template-columns: 1fr; }
          .service-card { border-left: none; border-top: 1px solid rgba(26,22,18,0.12); }
          .service-card:last-child { border-right: none; border-bottom: 1px solid rgba(26,22,18,0.12); }
          .cta-section { grid-template-columns: 1fr; }
          .section-header { flex-direction: column; gap: 1rem; }
        }
      `}</style>

      <div className="page">

        {/* ─── HERO ─── */}
        <section className="hero">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-tag">ONG — Depuis 2009</div>

            <h1 className="hero-title">
              Agir pour<br />
              un avenir<br />
              <em>meilleur.</em>
            </h1>

            <p className="hero-desc">
              Notre ONG sengage à transformer des vies à travers
              léducation, la solidarité et linnovation sociale — 
              partout où le besoin est le plus grand.
            </p>

            <div className="hero-cta">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              <div className="hero-stat">
                <strong>12K+</strong>
                vies transformées
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-visual">
              <div className="visual-bg" />
              <div className="visual-line" />
              <div className="visual-number">09</div>
              <div className="visual-quote">
                Le changement commence par une seule action décidée.
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── SERVICES ─── */}
        <section className="services">
          <div className="section-header">
            <span className="section-label">Ce que nous faisons</span>
            <h2 className="section-title">Nos Services</h2>
          </div>

          <div className="services-grid">
            {services.map((service, i) => (
              <motion.div
                key={i}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="service-number">{service.number}</div>
                <span className="service-icon">{service.icon}</span>
                <h3 className="service-name">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <div className="service-arrow">→</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── TÉMOIGNAGES / CITATIONS ─── */}
        <section className="testimonials">
          <div className="testimonials-header">
            <h2 className="testimonials-title">Ils parlent de notre travail</h2>
            <span className="testimonials-tag">Témoignages & citations</span>
          </div>

          <div className="testimonials-strip">
          {fallbackQuotes.map((q, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-subject">Citation</div>
              <div className="testimonial-message">{q.text}</div>
              <div className="testimonial-author">— {q.author}</div>
            </div>
             ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <motion.section
          className="cta-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <div className="cta-tag">Rejoignez la mission</div>
            <h2 className="cta-title">
              Ensemble, nous<br />
              pouvons faire<br />
              la <em>différence.</em>
            </h2>
          </div>
          <Link href="/contact" className="btn-outline">
            Devenir partenaire
          </Link>
        </motion.section>

      </div>
    </>
  )
}
