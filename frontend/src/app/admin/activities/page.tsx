"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  addActivityImage,
  createActivity,
  deleteActivity,
  getActivitiesWithImages,
  updateActivity,
} from "@/lib/api"
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
  const [saving, setSaving]         = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [imageUrls, setImageUrls] = useState("")

  const refresh = async () => {
    const data = await getActivitiesWithImages()
    setActivities(data)
  }

  useEffect(() => {
    if (!sessionStorage.getItem("adminLogged")) {
      router.push("/admin/login")
      return
    }
    refresh()
      .catch(() => setError("Impossible de récupérer les activités."))
      .finally(() => setLoading(false))
  }, [router])

  const openCreate = () => {
    setModalMode("create")
    setEditingId(null)
    setTitle("")
    setDescription("")
    setActivityDate("")
    setImageUrls("")
    setModalOpen(true)
  }

  const openEdit = (a: Activity) => {
    setModalMode("edit")
    setEditingId(a.id)
    setTitle(a.title)
    setDescription(a.description)
    setActivityDate(a.activity_date?.slice(0, 10) ?? "")
    setImageUrls("")
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
        const created = await createActivity({
          title,
          description,
          activity_date: activityDate,
        })

        const urls = imageUrls
          .split(/\r?\n|,/)
          .map((s) => s.trim())
          .filter(Boolean)

        await Promise.all(
          urls.map((url) =>
            addActivityImage({ activity_id: created.id, image_url: url })
          )
        )
      } else if (editingId != null) {
        await updateActivity(editingId, {
          title,
          description,
          activity_date: activityDate,
        })

        const urls = imageUrls
          .split(/\r?\n|,/)
          .map((s) => s.trim())
          .filter(Boolean)

        await Promise.all(
          urls.map((url) => addActivityImage({ activity_id: editingId, image_url: url }))
        )
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
    const ok = confirm("Supprimer cette activité ?")
    if (!ok) return
    setSaving(true)
    setError(null)
    try {
      await deleteActivity(id)
      await refresh()
    } catch (err) {
      console.error(err)
      setError("Impossible de supprimer l’activité.")
    } finally {
      setSaving(false)
    }
  }

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

        .aa-btn {
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
        .aa-btn:hover { background: #2A241E; transform: translateY(-1px); }
        .aa-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .aa-btn.secondary { background: transparent; color: #1A1612; }
        .aa-btn.secondary:hover { background: rgba(26,22,18,0.06); }

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

        .aa-actions {
          display: flex;
          gap: 8px;
          margin-top: 0.5rem;
        }
        .aa-action {
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
        .aa-action:hover { background: rgba(26,22,18,0.06); }
        .aa-action.danger { border-color: rgba(192,57,43,0.25); color: #C0392B; }
        .aa-action.danger:hover { background: rgba(192,57,43,0.06); }
        .aa-action:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── MODAL ── */
        .aa-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          z-index: 50;
        }
        .aa-modal {
          width: min(720px, 100%);
          background: #F5F0E8;
          border: 1px solid rgba(26,22,18,0.12);
        }
        .aa-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(26,22,18,0.10);
        }
        .aa-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1A1612;
        }
        .aa-modal-close {
          border: 1px solid rgba(26,22,18,0.12);
          background: transparent;
          width: 34px;
          height: 34px;
          cursor: pointer;
        }
        .aa-form {
          padding: 1.25rem;
          display: grid;
          gap: 1rem;
        }
        .aa-label {
          display: grid;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(26,22,18,0.65);
        }
        .aa-input, .aa-textarea {
          border: 1px solid rgba(26,22,18,0.12);
          background: #fff;
          padding: 0.7rem 0.75rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #1A1612;
          outline: none;
        }
        .aa-textarea { resize: vertical; }
        .aa-form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding-top: 0.5rem;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="aa-header">
        <div>
          <h1 className="aa-title">Nos <em>Activités</em></h1>
          {!loading && !error && (
            <span className="aa-count">{activities.length} activité{activities.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        <button className="aa-btn" onClick={openCreate} disabled={saving}>
          Ajouter
        </button>
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
                  <div className="aa-actions">
                    <button className="aa-action" onClick={() => openEdit(activity)} disabled={saving}>
                      Modifier
                    </button>
                    <button
                      className="aa-action danger"
                      onClick={() => onDelete(activity.id)}
                      disabled={saving}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL ── */}
      {modalOpen && (
        <div className="aa-modal-overlay" onClick={closeModal}>
          <div className="aa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aa-modal-head">
              <div className="aa-modal-title">
                {modalMode === "create" ? "Ajouter une activité" : "Modifier l’activité"}
              </div>
              <button className="aa-modal-close" onClick={closeModal} disabled={saving}>
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="aa-form">
              <label className="aa-label">
                Titre
                <input
                  className="aa-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label className="aa-label">
                Date
                <input
                  className="aa-input"
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  required
                />
              </label>

              <label className="aa-label">
                Description
                <textarea
                  className="aa-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                />
              </label>

              <label className="aa-label">
                URLs d’images (optionnel, séparées par virgules ou lignes)
                <textarea
                  className="aa-textarea"
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                  rows={3}
                  placeholder="https://... , https://..."
                />
              </label>

              <div className="aa-form-actions">
                <button type="button" className="aa-btn secondary" onClick={closeModal} disabled={saving}>
                  Annuler
                </button>
                <button type="submit" className="aa-btn" disabled={saving}>
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