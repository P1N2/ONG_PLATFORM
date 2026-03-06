"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createService, deleteService, getServices, updateService } from "@/lib/api"

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
  const [saving, setSaving]     = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const refresh = async () => {
    const data = await getServices()
    setServices(data)
  }

  useEffect(() => {
    if (!sessionStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }
    refresh()
      .catch(() => setError("Impossible de récupérer les services."))
      .finally(() => setLoading(false))
  }, [router])

  const openCreate = () => {
    setModalMode("create")
    setEditingId(null)
    setTitle("")
    setDescription("")
    setModalOpen(true)
  }

  const openEdit = (s: Service) => {
    setModalMode("edit")
    setEditingId(s.id)
    setTitle(s.title)
    setDescription(s.description)
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
        await createService({ title, description })
      } else if (editingId != null) {
        await updateService(editingId, { title, description })
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
    const ok = confirm("Supprimer ce service ?")
    if (!ok) return
    setSaving(true)
    setError(null)
    try {
      await deleteService(id)
      await refresh()
    } catch (err) {
      console.error(err)
      setError("Impossible de supprimer le service.")
    } finally {
      setSaving(false)
    }
  }

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

        .as-btn {
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
        .as-btn:hover { background: #2A241E; transform: translateY(-1px); }
        .as-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .as-btn.secondary { background: transparent; color: #1A1612; }
        .as-btn.secondary:hover { background: rgba(26,22,18,0.06); }

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

        .as-actions {
          display: flex;
          gap: 8px;
        }
        .as-action {
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
        }
        .as-action:hover { background: rgba(26,22,18,0.06); }
        .as-action.danger { border-color: rgba(192,57,43,0.25); color: #C0392B; }
        .as-action.danger:hover { background: rgba(192,57,43,0.06); }
        .as-action:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── MODAL ── */
        .as-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          z-index: 50;
        }
        .as-modal {
          width: min(720px, 100%);
          background: #F5F0E8;
          border: 1px solid rgba(26,22,18,0.12);
        }
        .as-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(26,22,18,0.10);
        }
        .as-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
        }
        .as-modal-close {
          border: 1px solid rgba(26,22,18,0.12);
          background: transparent;
          width: 34px;
          height: 34px;
          cursor: pointer;
        }
        .as-form {
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .as-label {
          display: grid;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.65);
        }
        .as-input, .as-textarea {
          border: 1px solid rgba(26,22,18,0.12);
          background: #fff;
          padding: 0.7rem 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1A1612;
          outline: none;
        }
        .as-textarea { resize: vertical; }
        .as-form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 0.5rem;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="as-header">
        <div>
          <h1 className="as-title">Nos <em>Services</em></h1>
          {!loading && !error && (
            <span className="as-count">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button className="as-btn" onClick={openCreate} disabled={saving}>
          Ajouter
        </button>
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
                <div className="as-actions">
                  <button className="as-action" onClick={() => openEdit(service)} disabled={saving}>
                    Modifier
                  </button>
                  <button className="as-action danger" onClick={() => onDelete(service.id)} disabled={saving}>
                    Supprimer
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── MODAL ── */}
      {modalOpen && (
        <div className="as-modal-overlay" onClick={closeModal}>
          <div className="as-modal" onClick={(e) => e.stopPropagation()}>
            <div className="as-modal-head">
              <div className="as-modal-title">
                {modalMode === "create" ? "Ajouter un service" : "Modifier le service"}
              </div>
              <button className="as-modal-close" onClick={closeModal} disabled={saving}>
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="as-form">
              <label className="as-label">
                Titre
                <input
                  className="as-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label className="as-label">
                Description
                <textarea
                  className="as-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                />
              </label>
              <div className="as-form-actions">
                <button type="button" className="as-btn secondary" onClick={closeModal} disabled={saving}>
                  Annuler
                </button>
                <button type="submit" className="as-btn" disabled={saving}>
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