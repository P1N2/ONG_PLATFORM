"use client"

import React, { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const links = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Activités", href: "/activities" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #F5F0E8;
          border-bottom: 1px solid rgba(26,22,18,0.10);
        }

        .navbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5vw;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: #1A1612;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-mark span {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.85rem;
          color: #C0392B;
          font-weight: 700;
          line-height: 1;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1A1612;
          letter-spacing: -0.01em;
        }

        .logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
          margin-top: 1px;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 1.4rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          color: #8C7B6B;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #1A1612;
        }

        .nav-link.active {
          color: #1A1612;
        }

        .nav-link-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #C0392B;
          border-radius: 50%;
        }

        .navbar-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.55rem 1.4rem;
          background: #1A1612;
          color: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background 0.3s;
          margin-left: 1.5rem;
        }

        .navbar-cta:hover {
          background: #C0392B;
        }

        .navbar-divider {
          width: 1px;
          height: 18px;
          background: rgba(26,22,18,0.15);
          margin: 0 0.5rem;
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-cta { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-mark">
              <span>O</span>
            </div>
            <div className="logo-text">
              <span className="logo-name">ONG Platform</span>
              <span className="logo-sub">Pour un avenir meilleur</span>
            </div>
          </Link>

          {/* Links */}
          <div className="navbar-links">
            {links.map((link, i) => {
              const isActive = pathname === link.href
              return (
                <Fragment key={link.name}>
                  {i > 0 && <div className="navbar-divider" />}
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="nav-link-dot"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </Fragment>
              )
            })}
          </div>

          {/* CTA */}
          <Link href="/contact" className="navbar-cta">
            Nous rejoindre →
          </Link>

        </div>
      </nav>
    </>
  )
}
