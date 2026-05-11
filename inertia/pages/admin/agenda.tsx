import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Plus, Pencil, Trash2, X, Check, Clock } from 'lucide-react'

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

interface Creneau {
  id: number
  jour: string
  heure: string
  titre: string
  responsable: string
  lieu: string
  type: 'Culte' | 'Prière' | 'Jeunesse' | 'Étude' | 'Autre'
}

const typeColors: Record<Creneau['type'], string> = {
  Culte:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Prière:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Jeunesse:'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Étude:   'bg-green-500/10 text-green-400 border-green-500/20',
  Autre:   'bg-slate-700 text-slate-400 border-slate-600',
}

const initialData: Creneau[] = [
  { id: 1, jour: 'Dimanche',  heure: '09h30',  titre: 'Culte Principal',          responsable: 'Pasteur Blonsky MBALA', lieu: 'Temple principal', type: 'Culte'    },
  { id: 2, jour: 'Dimanche',  heure: '14h00',  titre: 'École du Dimanche',        responsable: 'Rachel Kabeya',        lieu: 'Salle annexe',    type: 'Étude'    },
  { id: 3, jour: 'Mercredi',  heure: '19h00',  titre: 'Réunion de Prière',        responsable: 'Dr. Jean Mukendi',     lieu: 'Temple principal', type: 'Prière'   },
  { id: 4, jour: 'Vendredi',  heure: '18h00',  titre: 'Génération PHILA',         responsable: 'David Mulumba',        lieu: 'Salle jeunesse', type: 'Jeunesse'  },
  { id: 5, jour: 'Samedi',    heure: '08h00',  titre: 'Intercession du matin',    responsable: 'Pasteur Blonsky MBALA', lieu: 'Temple principal', type: 'Prière'   },
]

const emptyForm: Omit<Creneau, 'id'> = { jour: 'Dimanche', heure: '09h00', titre: '', responsable: '', lieu: '', type: 'Culte' }

export default function AdminAgenda() {
  const [creneaux, setCreneaux] = useState<Creneau[]>(initialData)
  const [modal, setModal]       = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Creneau | null>(null)
  const [form, setForm]         = useState<Omit<Creneau, 'id'>>(emptyForm)

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const total = creneaux.length
  const lastPage = Math.ceil(total / perPage)
  const paginatedData = creneaux.slice((currentPage - 1) * perPage, currentPage * perPage)

  const meta = {
    total,
    perPage,
    currentPage,
    lastPage,
    firstPage: 1
  }

  function openAdd()             { setForm(emptyForm); setModal('add') }
  function openEdit(c: Creneau)  { setSelected(c); setForm({ jour: c.jour, heure: c.heure, titre: c.titre, responsable: c.responsable, lieu: c.lieu, type: c.type }); setModal('edit') }
  function openDelete(c: Creneau){ setSelected(c); setModal('delete') }
  function closeModal()          { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setCreneaux([...creneaux, { id: Date.now(), ...form }])
    } else if (modal === 'edit' && selected) {
      setCreneaux(creneaux.map((c) => c.id === selected.id ? { ...c, ...form } : c))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setCreneaux(creneaux.filter((c) => c.id !== selected.id))
    closeModal()
  }

  // Grouper les données paginées par jour
  const byDay = JOURS.map((jour) => ({
    jour,
    items: paginatedData.filter((c) => c.jour === jour).sort((a, b) => a.heure.localeCompare(b.heure)),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <Head title="Agenda — Admin Phila MDT" />
      <AdminLayout title="Gestion de l'agenda">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-400 text-sm">Gérez les créneaux hebdomadaires des cultes et activités.</p>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
            <Plus size={16} /> Ajouter un créneau
          </button>
        </div>

        {/* Grille par jour */}
        <div className="space-y-6 mb-8">
          {byDay.map(({ jour, items }) => (
            <div key={jour} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/40">
                <h2 className="font-bold text-white uppercase text-xs tracking-widest">{jour}</h2>
              </div>
              <div className="divide-y divide-slate-800/50">
                {items.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center gap-1.5 text-slate-400 min-w-[70px]">
                      <Clock size={14} className="text-primary" />
                      <span className="text-sm font-mono font-bold text-slate-300">{c.heure}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{c.titre}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{c.responsable} · {c.lieu}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${typeColors[c.type]}`}>
                      {c.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {byDay.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
              Aucun créneau trouvé pour cette page.
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
        </div>

        {/* Modal Add/Edit (form reste identique) */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un créneau' : 'Modifier le créneau'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Jour</label>
                  <select value={form.jour} onChange={(e) => setForm({ ...form, jour: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary transition-colors">
                    {JOURS.map((j) => <option key={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Heure</label>
                  <input type="time" value={form.heure.replace('h', ':')} onChange={(e) => setForm({ ...form, heure: e.target.value.replace(':', 'h') })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Titre</label>
                  <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Responsable</label>
                  <input value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Lieu</label>
                  <input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Creneau['type'] })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary transition-colors">
                    {(['Culte','Prière','Jeunesse','Étude','Autre'] as Creneau['type'][]).map((t) => <option key={t}>{t}</option>)}
                  </select>
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer ce créneau</h3>
                <p className="text-slate-400 text-sm mt-1">Supprimer <strong className="text-white">{selected.titre}</strong> du {selected.jour} à {selected.heure} ?</p>
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
