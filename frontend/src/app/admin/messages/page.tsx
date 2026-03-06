"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createContact, deleteContact, getContactsAdmin, updateContact } from "@/lib/api"

type ContactMessage = {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  created_at: string
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminMessages() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const refresh = async () => {
    const data = await getContactsAdmin()
    setMessages(data)
  }

  useEffect(() => {
    if (!sessionStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }
    refresh()
      .catch(() => setError("Impossible de récupérer les messages."))
      .finally(() => setLoading(false))
  }, [router])

  const openCreate = () => {
    setModalMode("create")
    setEditingId(null)
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setModalOpen(true)
  }

  const openEdit = (m: ContactMessage) => {
    setModalMode("edit")
    setEditingId(m.id)
    setName(m.name)
    setEmail(m.email)
    setSubject(m.subject ?? "")
    setMessage(m.message)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (modalMode === "create") {
        await createContact({ name, email, subject: subject || undefined, message })
      } else if (editingId != null) {
        await updateContact(editingId, { name, email, subject: subject || undefined, message })
      }
      await refresh()
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      setError("Une erreur est survenue lors de l’enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id: number) => {
    const ok = confirm("Supprimer ce message ?")
    if (!ok) return
    setSaving(true)
    setError(null)
    try {
      await deleteContact(id)
      if (expanded === id) setExpanded(null)
      await refresh()
    } catch (err) {
      console.error(err)
      setError("Impossible de supprimer le message.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── HEADER ── */
        .am-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26,22,18,0.12);
        }
        .am-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1A1612;
          line-height: 1;
        }
        .am-title em { font-style: italic; color: #C0392B; }
        .am-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8C7B6B;
        }

        .am-btn {
          border: 1px solid rgba(26,22,18,0.15);
          background: #1A1612;
          color: #F5F0E8;
          padding: 0.7rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.15s, background 0.2s, opacity 0.2s;
          white-space: nowrap;
          height: 40px;
          align-self: flex-start;
        }
        .am-btn:hover { background: #2A241E; transform: translateY(-1px); }
        .am-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .am-btn.secondary { background: transparent; color: #1A1612; }
        .am-btn.secondary:hover { background: rgba(26,22,18,0.06); }

        /* ── STATES ── */
        .am-state {
          padding: 3rem;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #8C7B6B;
          border: 1px dashed rgba(26,22,18,0.15);
          background: #F5F0E8;
        }
        .am-state.error {
          border-color: #C0392B;
          color: #C0392B;
          background: rgba(192,57,43,0.04);
        }
        .am-loading-bar {
          width: 40px;
          height: 2px;
          background: #C0392B;
          margin: 0 auto 1rem;
          animation: am-pulse 1.2s ease-in-out infinite;
        }
        @keyframes am-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50%       { opacity: 1;   transform: scaleX(1); }
        }

        /* ── LIST ── */
        .am-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: rgba(26,22,18,0.08);
        }

        /* ── ROW ── */
        .am-row {
          background: #F5F0E8;
          transition: background 0.25s;
          cursor: pointer;
        }
        .am-row:hover { background: #EDE8DF; }
        .am-row.open  { background: #fff; }

        /* Summary line */
        .am-row-summary {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem 1.75rem;
        }

        .am-row-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(26,22,18,0.22);
          width: 28px;
        }

        .am-row-info {}
        .am-row-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1A1612;
          display: block;
          line-height: 1.2;
        }
        .am-row-email {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          color: #8C7B6B;
        }

        .am-row-subject {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          color: #1A1612;
          max-width: 22ch;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .am-row-subject.empty {
          font-style: italic;
          color: rgba(26,22,18,0.25);
        }

        .am-row-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .am-row-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          color: #8C7B6B;
          white-space: nowrap;
        }
        .am-row-chevron {
          font-size: 0.7rem;
          color: #C0392B;
          transition: transform 0.3s;
        }
        .am-row.open .am-row-chevron { transform: rotate(180deg); }

        /* Expanded body */
        .am-row-body {
          display: none;
          padding: 0 1.75rem 1.75rem calc(1.75rem + 28px + 1.5rem);
          border-top: 1px solid rgba(26,22,18,0.07);
        }
        .am-row.open .am-row-body { display: block; }

        .am-row-subject-full {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C0392B;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 1.25rem 0 0.75rem;
        }
        .am-row-subject-full::before {
          content: '';
          display: block;
          width: 14px;
          height: 1px;
          background: #C0392B;
        }

        .am-row-message {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.8;
          color: #1A1612;
          max-width: 72ch;
        }

        .am-row-footer {
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .am-actions {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .am-action {
          border: 1px solid rgba(26,22,18,0.12);
          background: transparent;
          color: #1A1612;
          padding: 6px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
          white-space: nowrap;
        }
        .am-action:hover { background: rgba(26,22,18,0.06); }
        .am-action.danger { border-color: rgba(192,57,43,0.25); color: #C0392B; }
        .am-action.danger:hover { background: rgba(192,57,43,0.06); }
        .am-action:disabled { opacity: 0.6; cursor: not-allowed; }

        .am-id-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.22);
          border: 1px solid rgba(26,22,18,0.1);
          padding: 3px 8px;
        }
        .am-reply-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1A1612;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .am-reply-link:hover { color: #C0392B; }

        /* ── MODAL ── */
        .am-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          z-index: 50;
        }
        .am-modal {
          width: min(720px, 100%);
          background: #F5F0E8;
          border: 1px solid rgba(26,22,18,0.12);
        }
        .am-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(26,22,18,0.10);
        }
        .am-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
        }
        .am-modal-close {
          border: 1px solid rgba(26,22,18,0.12);
          background: transparent;
          width: 34px;
          height: 34px;
          cursor: pointer;
        }
        .am-form {
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .am-label {
          display: grid;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.65);
        }
        .am-input, .am-textarea {
          border: 1px solid rgba(26,22,18,0.12);
          background: #fff;
          padding: 0.7rem 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1A1612;
          outline: none;
        }
        .am-textarea { resize: vertical; }
        .am-form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 0.5rem;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="am-header">
        <div>
          <h1 className="am-title">Messages <em>reçus</em></h1>
          {!loading && !error && (
            <span className="am-count">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button className="am-btn" onClick={openCreate} disabled={saving}>
          Ajouter
        </button>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="am-state">
          <div className="am-loading-bar" />
          Chargement des messages...
        </div>
      )}

      {/* ── ERROR ── */}
      {error && <div className="am-state error">{error}</div>}

      {/* ── EMPTY ── */}
      {!loading && !error && messages.length === 0 && (
        <div className="am-state">Aucun message reçu pour le moment.</div>
      )}

      {/* ── LIST ── */}
      {!loading && !error && messages.length > 0 && (
        <div className="am-list">
          {messages.map((m, index) => {
            const isOpen = expanded === m.id
            return (
              <div
                key={m.id}
                className={`am-row ${isOpen ? "open" : ""}`}
                onClick={() => setExpanded(isOpen ? null : m.id)}
              >
                {/* Summary */}
                <div className="am-row-summary">
                  <span className="am-row-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="am-row-info">
                    <span className="am-row-name">{m.name}</span>
                    <span className="am-row-email">{m.email}</span>
                  </div>
                  <span className={`am-row-subject ${!m.subject ? "empty" : ""}`}>
                    {m.subject || "Sans sujet"}
                  </span>
                  <div className="am-row-right">
                    <span className="am-row-date">{formatDateTime(m.created_at)}</span>
                    <span className="am-row-chevron">▼</span>
                  </div>
                </div>

                {/* Expanded */}
                <div className="am-row-body">
                  {m.subject && (
                    <div className="am-row-subject-full">{m.subject}</div>
                  )}
                  <p className="am-row-message">{m.message}</p>
                  <div className="am-row-footer">
                    <span className="am-id-badge">ID #{m.id}</span>
                    <div className="am-actions">
                      <button
                        className="am-action"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(m)
                        }}
                        disabled={saving}
                      >
                        Modifier
                      </button>
                      <button
                        className="am-action danger"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(m.id)
                        }}
                        disabled={saving}
                      >
                        Supprimer
                      </button>
                    </div>
                    <a
                      href={`mailto:${m.email}?subject=Re: ${m.subject ?? ""}`}
                      className="am-reply-link"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                    >
                      Répondre →
                    </a>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL ── */}
      {modalOpen && (
        <div className="am-modal-overlay" onClick={closeModal}>
          <div className="am-modal" onClick={(e) => e.stopPropagation()}>
            <div className="am-modal-head">
              <div className="am-modal-title">
                {modalMode === "create" ? "Ajouter un message" : "Modifier le message"}
              </div>
              <button className="am-modal-close" onClick={closeModal} disabled={saving}>
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="am-form">
              <label className="am-label">
                Nom
                <input className="am-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="am-label">
                Email
                <input
                  className="am-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="am-label">
                Sujet (optionnel)
                <input className="am-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </label>
              <label className="am-label">
                Message
                <textarea
                  className="am-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                />
              </label>

              <div className="am-form-actions">
                <button type="button" className="am-btn secondary" onClick={closeModal} disabled={saving}>
                  Annuler
                </button>
                <button type="submit" className="am-btn" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}