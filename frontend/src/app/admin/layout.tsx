"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: "▪" },
  { href: "/admin/activities",  label: "Activités",   icon: "▪" },
  { href: "/admin/services",    label: "Services",    icon: "▪" },
  { href: "/admin/messages",    label: "Messages",    icon: "▪" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = pathname === "/admin/login"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-shell {
          min-height: 100vh;
          display: flex;
          background: #EFEBE3;
        }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #1A1612;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 0 2rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* Logo */
        .admin-brand {
          padding: 0 2rem 2.5rem;
          border-bottom: 1px solid rgba(245,240,232,0.07);
          margin-bottom: 2rem;
        }
        .admin-brand-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C0392B;
          display: block;
          margin-bottom: 0.4rem;
        }
        .admin-brand-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #F5F0E8;
          line-height: 1.1;
        }
        .admin-brand-name em {
          font-style: italic;
          color: #C0392B;
        }

        /* Nav */
        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 1rem;
          flex: 1;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.7rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #8C7B6B;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .admin-nav-link:hover {
          color: #F5F0E8;
          background: rgba(245,240,232,0.05);
        }
        .admin-nav-link.active {
          color: #F5F0E8;
          background: rgba(192,57,43,0.12);
        }
        .admin-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #C0392B;
        }
        .admin-nav-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.4;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .admin-nav-link.active .admin-nav-dot,
        .admin-nav-link:hover .admin-nav-dot {
          opacity: 1;
          background: #C0392B;
        }

        /* Footer sidebar */
        .admin-sidebar-footer {
          padding: 1.5rem 2rem 0;
          border-top: 1px solid rgba(245,240,232,0.07);
          margin-top: auto;
        }
        .admin-sidebar-footer span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(140,123,107,0.5);
          text-transform: uppercase;
        }

        /* ── MAIN ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* Topbar */
        .admin-topbar {
          background: #F5F0E8;
          border-bottom: 1px solid rgba(26,22,18,0.10);
          padding: 0 2.5rem;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .admin-topbar-path {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8C7B6B;
        }
        .admin-topbar-path strong {
          color: #1A1612;
          font-weight: 500;
        }
        .admin-topbar-badge {
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
        .admin-topbar-badge::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C0392B;
        }

        /* Content area */
        .admin-content {
          flex: 1;
          padding: 2.5rem;
        }

        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
        }
      `}</style>

      <div className="admin-shell">

        {/* ── SIDEBAR ── */}
        {!hideSidebar && (
          <aside className="admin-sidebar">

            <div className="admin-brand">
              <span className="admin-brand-tag">Espace admin</span>
              <span className="admin-brand-name">ONG <em>Platform</em></span>
            </div>

            <nav className="admin-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-link ${pathname === link.href ? "active" : ""}`}
                >
                  <span className="admin-nav-dot" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="admin-sidebar-footer">
              <span>© {new Date().getFullYear()} ONG Platform</span>
            </div>

          </aside>
        )}

        {/* ── MAIN ── */}
        <div className="admin-main">

          {/* Topbar — masquée sur la page login */}
          {!hideSidebar && (
            <div className="admin-topbar">
              <span className="admin-topbar-path">
                Admin / <strong>
                  {navLinks.find(l => l.href === pathname)?.label ?? "Page"}
                </strong>
              </span>
              <span className="admin-topbar-badge">En ligne</span>
            </div>
          )}

          <div className="admin-content">
            {children}
          </div>

        </div>

      </div>
    </>
  )
}