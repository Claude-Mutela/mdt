import { Head, router, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import {
  Plus, Pencil, Trash2, X, Check,
  MapPin, Clock, Phone, Users, UserCheck,
} from 'lucide-react'

interface Responsable {
  id: number
  firstname: string
  lastname: string
  typeMember: string | null
}

interface Cellule {
  id: number
  name: string
  description: string | null
  horaire: string | null
  adresse: string | null
  contact: string | null
  responsableId: number | null
  responsable: Responsable | null
}

interface Props {
  cellules: Cellule[]
  responsables: Responsable[]
}

export default function AdminCellules({ cellules, responsables }: Props) {
  // ── Pagination ──────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  const total = (cellules || []).length
  const lastPage = Math.ceil(total / perPage) || 1
  const paginated = (cellules || []).slice((currentPage - 1) * perPage, currentPage * perPage)
  const meta = { total, perPage, currentPage, lastPage, firstPage: 1 }

  // ── Modals ───────────────────────────────────────────────────
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Cellule | null>(null)

  // ── Form ─────────────────────────────────────────────────────
  const form = useForm({
    name: '',
    description: '',
    horaire: '',
    adresse: '',
    contact: '',
    responsableId: '' as string | number,
  })

  // ── Handlers ─────────────────────────────────────────────────
  function openAdd() {
    form.reset()
    form.clearErrors()
    setSelected(null)
    setModal('add')
  }

  function openEdit(c: Cellule) {
    form.reset()
    form.clearErrors()
    form.setData({
      name: c.name,
      description: c.description || '',
      horaire: c.horaire || '',
      adresse: c.adresse || '',
      contact: c.contact || '',
      responsableId: c.responsableId ?? '',
    })
    setSelected(c)
    setModal('edit')
  }

  function save() {
    const payload = {
      ...form.data,
      responsableId: form.data.responsableId === '' ? undefined : Number(form.data.responsableId),
    }
    if (modal === 'add') {
      form.post('/admin/cellules', { onSuccess: () => setModal(null) })
    } else if (modal === 'edit' && selected) {
      form.put(`/admin/cellules/${selected.id}`, { onSuccess: () => setModal(null) })
    }
  }

  function destroy() {
    if (selected) {
      router.delete(`/admin/cellules/${selected.id}`, { onSuccess: () => setModal(null) })
    }
  }

  // ── Helpers ──────────────────────────────────────────────────
  const responsableName = (c: Cellule) =>
    c.responsable
      ? `${c.responsable.firstname} ${c.responsable.lastname}`
      : null

  const inputClass = (err?: string) =>
    `w-full mt-1 px-4 py-2.5 bg-slate-800 border ${err ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors`

  return (
    <>
      <Head title="Cellules — Admin Phila MDT" />
      <AdminLayout title="Gestion des cellules">

        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white font-bold text-lg">Liste des Cellules</h2>
            <p className="text-slate-400 text-sm">
              Groupes de vie et cellules de l'église — {total} cellule{total !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> Ajouter une cellule
          </button>
        </div>

        {/* ── Empty state ── */}
        {(!cellules || cellules.length === 0) ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">Aucune cellule créée pour le moment.</p>
            <p className="text-slate-600 text-sm mt-1">Cliquez sur « Ajouter une cellule » pour commencer.</p>
          </div>
        ) : (
          <>
            {/* ── Grid Cards ── */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {paginated.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-600 transition-all duration-200 shadow-xl"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/40" />

                  <div className="p-5">
                    {/* Name + actions */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-primary font-black text-base">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm leading-tight">{c.name}</h3>
                          {responsableName(c) && (
                            <span className="text-[10px] text-primary/80 font-semibold flex items-center gap-1 mt-0.5">
                              <UserCheck size={10} /> {responsableName(c)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => { setSelected(c); setModal('delete') }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {c.description && (
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">
                        {c.description}
                      </p>
                    )}

                    {/* Meta infos */}
                    <div className="space-y-1.5 border-t border-slate-800 pt-3 mt-3">
                      {c.horaire && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Clock size={11} className="shrink-0 text-slate-500" />
                          <span className="truncate">{c.horaire}</span>
                        </div>
                      )}
                      {c.adresse && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <MapPin size={11} className="shrink-0 text-slate-500" />
                          <span className="truncate">{c.adresse}</span>
                        </div>
                      )}
                      {c.contact && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Phone size={11} className="shrink-0 text-slate-500" />
                          <span className="truncate">{c.contact}</span>
                        </div>
                      )}
                      {!c.horaire && !c.adresse && !c.contact && (
                        <p className="text-slate-600 text-xs italic">Aucun détail renseigné.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {lastPage > 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-4">
                <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════
            MODAL — AJOUTER / MODIFIER
        ══════════════════════════════════════════ */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">
                  {modal === 'add' ? 'Ajouter une cellule' : 'Modifier la cellule'}
                </h3>
                <button
                  onClick={() => setModal(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => { e.preventDefault(); save() }}
                className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar"
              >
                {/* Nom */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Nom de la cellule <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className={inputClass(form.errors.name)}
                    placeholder="Ex: Cellule Espoir — Lemba"
                  />
                  {form.errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {form.errors.name}
                    </p>
                  )}
                </div>

                {/* Responsable */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Responsable{' '}
                    <span className="text-slate-600 normal-case text-[10px] ml-1">(optionnel)</span>
                  </label>
                  <select
                    value={form.data.responsableId}
                    onChange={(e) => form.setData('responsableId', e.target.value)}
                    className={inputClass(form.errors.responsableId)}
                  >
                    <option value="">— Aucun responsable —</option>
                    {responsables.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.lastname.toUpperCase()} {r.firstname}
                        {r.typeMember ? ` (${r.typeMember})` : ''}
                      </option>
                    ))}
                  </select>
                  {form.errors.responsableId && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {form.errors.responsableId}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    className={inputClass(form.errors.description) + ' resize-none'}
                    placeholder="Brève description de la cellule..."
                  />
                  {form.errors.description && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {form.errors.description}
                    </p>
                  )}
                </div>

                {/* Horaire + Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Clock size={11} /> Horaire <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.data.horaire}
                      onChange={(e) => form.setData('horaire', e.target.value)}
                      className={inputClass(form.errors.horaire)}
                      placeholder="Ex: Vendredi 18h00"
                    />
                    {form.errors.horaire && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                        {form.errors.horaire}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Phone size={11} /> Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.data.contact}
                      onChange={(e) => form.setData('contact', e.target.value)}
                      className={inputClass(form.errors.contact)}
                      placeholder="Ex: 0812345678"
                    />
                    {form.errors.contact && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                        {form.errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <MapPin size={11} /> Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.data.adresse}
                    onChange={(e) => form.setData('adresse', e.target.value)}
                    className={inputClass(form.errors.adresse)}
                    placeholder="Ex: 12, Av. de la Paix, Lemba — Kinshasa"
                  />
                  {form.errors.adresse && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {form.errors.adresse}
                    </p>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={form.processing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    <Check size={15} />
                    {form.processing ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            MODAL — SUPPRIMER
        ══════════════════════════════════════════ */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer cette cellule</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Êtes-vous sûr de vouloir supprimer{' '}
                  <strong className="text-white">« {selected.name} »</strong> ?
                </p>
                <p className="text-slate-600 text-xs mt-2">Cette action est irréversible.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={destroy}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </>
  )
}
