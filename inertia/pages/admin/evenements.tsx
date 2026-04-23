import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { Plus, Search, Pencil, Trash2, X, Check, CalendarDays, MapPin } from 'lucide-react'

type Statut = 'upcoming' | 'ongoing' | 'past'

interface Evenement {
  id: number
  titre: string
  slug: string
  date: string
  lieu: string
  tag: string
  statut: Statut
  description: string
}

const statutStyles: Record<Statut, string> = {
  upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ongoing:  'bg-green-500/10 text-green-400 border-green-500/20',
  past:     'bg-slate-700 text-slate-400 border-slate-600',
}
const statutLabels: Record<Statut, string> = { upcoming: 'À venir', ongoing: 'En cours', past: 'Passé' }

const initialData: Evenement[] = [
  { id: 1, titre: 'Séminaire Épanouissement Spirituel', slug: 'seminaire-epanouissement', date: '15 Avril 2025', lieu: 'Temple PHILA MDT, Kinshasa', tag: 'Séminaire', statut: 'upcoming', description: 'Une semaine d\'immersion totale dans la Parole pour une transformation radicale.' },
  { id: 2, titre: 'Conférence Jeunesse - Passion & Vision', slug: 'conference-jeunesse', date: 'Jusqu\'au 5 Avril', lieu: 'Salle des fêtes MDT', tag: 'Jeunesse', statut: 'ongoing', description: 'Le rendez-vous annuel de la jeunesse pour embrasser sa destinée prophétique.' },
  { id: 3, titre: 'Grande Soirée d\'Intercession', slug: 'soiree-intercession', date: '28 Mars 2025', lieu: 'Parvis de l\'Église', tag: 'Prière', statut: 'past', description: 'Un moment solennel de prière pour la paix et la restauration de notre nation.' },
  { id: 4, titre: 'Soirée de Louange', slug: 'soiree-louange', date: '20 Avril 2025', lieu: 'Temple principal', tag: 'Louange', statut: 'upcoming', description: 'Une nuit de louange et d\'adoration pour glorifier le Seigneur ensemble.' },
]

const emptyForm: Omit<Evenement, 'id'> = { titre: '', slug: '', date: '', lieu: '', tag: '', statut: 'upcoming', description: '' }

export default function AdminEvenements() {
  const [events, setEvents]       = useState<Evenement[]>(initialData)
  const [search, setSearch]       = useState('')
  const [filtreStatut, setFiltreStatut] = useState<'all' | Statut>('all')
  const [modal, setModal]         = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]   = useState<Evenement | null>(null)
  const [form, setForm]           = useState<Omit<Evenement, 'id'>>(emptyForm)

  const filtered = events.filter((e) => {
    const matchSearch  = e.titre.toLowerCase().includes(search.toLowerCase())
    const matchStatut  = filtreStatut === 'all' || e.statut === filtreStatut
    return matchSearch && matchStatut
  })

  function openAdd()                { setForm(emptyForm); setModal('add') }
  function openEdit(e: Evenement)   { setSelected(e); setForm({ titre: e.titre, slug: e.slug, date: e.date, lieu: e.lieu, tag: e.tag, statut: e.statut, description: e.description }); setModal('edit') }
  function openDelete(e: Evenement) { setSelected(e); setModal('delete') }
  function closeModal()             { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setEvents([...events, { id: Date.now(), ...form }])
    } else if (modal === 'edit' && selected) {
      setEvents(events.map((e) => e.id === selected.id ? { ...e, ...form } : e))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setEvents(events.filter((e) => e.id !== selected.id))
    closeModal()
  }

  return (
    <>
      <Head title="Événements — Admin Phila MDT" />
      <AdminLayout title="Gestion des événements">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un événement…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2">
            {(['all', 'upcoming', 'ongoing', 'past'] as const).map((s) => (
              <button key={s} onClick={() => setFiltreStatut(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtreStatut === s
                    ? 'bg-primary border-primary text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}>
                {s === 'all' ? 'Tous' : statutLabels[s]}
              </button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold">Événements <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Titre', 'Date', 'Lieu', 'Tag', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{e.titre}</p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{e.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CalendarDays size={13} className="text-primary" />
                        {e.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={13} className="text-slate-500" />
                        {e.lieu}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-full">{e.tag}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statutStyles[e.statut]}`}>
                        {statutLabels[e.statut]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => openDelete(e)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un événement' : 'Modifier l\'événement'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Titre</label>
                  <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Date</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Tag</label>
                  <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Lieu</label>
                  <input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Statut</label>
                  <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as Statut })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary">
                    <option value="upcoming">À venir</option>
                    <option value="ongoing">En cours</option>
                    <option value="past">Passé</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
                  <Check size={15} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer cet événement</h3>
                <p className="text-slate-400 text-sm mt-1">Supprimer <strong className="text-white">{selected.titre}</strong> ?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Annuler</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
