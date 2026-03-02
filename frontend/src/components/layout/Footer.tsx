import Link from "next/link"

const links = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Activités", href: "/activities" },
  { name: "Contact", href: "/contact" },
]

const socials = [
  { name: "FB", label: "Facebook", href: "#" },
  { name: "IG", label: "Instagram", href: "#" },
  { name: "LI", label: "LinkedIn", href: "#" },
]

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .footer {
          background: #1A1612;
          color: #F5F0E8;
          padding: 5rem 5vw 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '2009';
          position: absolute;
          top: -1.5rem;
          right: -1rem;
          font-family: 'Playfair Display', serif;
          font-size: 14rem;
          font-weight: 900;
          color: rgba(255,255,255,0.025);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 4rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid rgba(245,240,232,0.08);
        }

        /* Brand col */
        .footer-brand {}

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.5rem;
          text-decoration: none;
        }

        .footer-logo-mark {
          width: 32px;
          height: 32px;
          background: #C0392B;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .footer-logo-mark span {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: #F5F0E8;
          font-weight: 700;
        }

        .footer-logo-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #F5F0E8;
        }

        .footer-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: #F5F0E8;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          max-width: 26ch;
        }

        .footer-tagline em {
          color: #C0392B;
          font-style: italic;
        }

        .footer-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.75;
          color: #8C7B6B;
          max-width: 34ch;
        }

        /* Nav col */
        .footer-col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8C7B6B;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(245,240,232,0.08);
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          list-style: none;
        }

        .footer-links a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #EDE8DF;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s, gap 0.3s;
        }

        .footer-links a::before {
          content: '—';
          font-size: 0.7rem;
          color: #C0392B;
          transition: transform 0.3s;
        }

        .footer-links a:hover {
          color: #F5F0E8;
          gap: 12px;
        }

        /* Contact col */
        .footer-contact-item {
          margin-bottom: 1.25rem;
        }

        .footer-contact-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8C7B6B;
          display: block;
          margin-bottom: 0.25rem;
        }

        .footer-contact-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #EDE8DF;
        }

        /* Bottom bar */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: #8C7B6B;
          letter-spacing: 0.03em;
        }

        .footer-copy strong {
          color: #EDE8DF;
          font-weight: 400;
        }

        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(245,240,232,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #8C7B6B;
          text-decoration: none;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }

        .social-btn:hover {
          background: #C0392B;
          border-color: #C0392B;
          color: #F5F0E8;
        }

        .footer-rouge-bar {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rouge-dot {
          width: 6px;
          height: 6px;
          background: #C0392B;
          border-radius: 50%;
        }

        .footer-mention {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: #8C7B6B;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr; gap: 2.5rem; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-mark"><span>O</span></div>
              <span className="footer-logo-name">ONG Platform</span>
            </Link>
            <p className="footer-tagline">
              Ensemble, construisons un avenir<br />
              <em>plus juste et solidaire.</em>
            </p>
            <p className="footer-desc">
              Nous agissons là où le besoin est le plus grand, 
              avec conviction et transparence, depuis 2009.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Nous contacter</div>
            <div className="footer-contact-item">
              <span className="footer-contact-label">Email</span>
              <span className="footer-contact-value">contact@ong-platform.org</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-label">Téléphone</span>
              <span className="footer-contact-value">+33 1 23 45 67 89</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-label">Adresse</span>
              <span className="footer-contact-value">12 rue de la Paix, Paris</span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} <strong>ONG Platform</strong>. Tous droits réservés.
          </p>

          <div className="footer-rouge-bar">
            <div className="rouge-dot" />
            <span className="footer-mention">Agir. Ensemble. Maintenant.</span>
          </div>

          <div className="footer-socials">
            {socials.map((s) => (
              <a key={s.name} href={s.href} className="social-btn" aria-label={s.label}>
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
