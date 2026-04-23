import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'

interface Ministere {
  id: number
  nom: string
  tag: string
  description: string
  responsable: string
  couleur: string
}

const COULEURS = [
  { label: 'Bleu',   value: 'bg-blue-500'   },
  { label: 'Vert',   value: 'bg-green-500'  },
  { label: 'Violet', value: 'bg-purple-500' },
  { label: 'Rose',   value: 'bg-pink-500'   },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Cyan',   value: 'bg-cyan-500'   },
]

const initialData: Ministere[] = [
  { id: 1, nom: 'Génération PHILA',  tag: 'Jeunesse', description: 'Un espace dynamique pour les 15-30 ans. Rencontres, débats et sorties spirituelles.',           responsable: 'David Mulumba',        couleur: 'bg-blue-500'   },
  { id: 2, nom: 'École du Dimanche', tag: 'Enfants',  description: 'Les enfants découvrent la Bible à travers des jeux, des chants et des leçons adaptées.',       responsable: 'Rachel Kabeya',        couleur: 'bg-green-500'  },
  { id: 3, nom: 'Chorale & Louange', tag: 'Musique',  description: 'Conduire le peuple de Dieu dans l\'adoration avec excellence et passion.',                      responsable: 'Emmanuel Tshiab',      couleur: 'bg-purple-500' },
  { id: 4, nom: 'Femmes de Valeur',  tag: 'Femmes',   description: 'Partage, prière et encouragement entre femmes pour s\'édifier mutuellement.',                   responsable: 'Grace Kasongo',        couleur: 'bg-pink-500'   },
]

const emptyForm: Omit<Ministere, 'id'> = { nom: '', tag: '', description: '', responsable: '', couleur: 'bg-blue-500' }

export default function AdminMinisteres() {
  const [ministeres, setMinisteres] = useState<Ministere[]>(initialData)
  const [modal, setModal]           = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]     = useState<Ministere | null>(null)
  const [form, setForm]             = useState<Omit<Ministere, 'id'>>(emptyForm)

  function openAdd()             { setForm(emptyForm); setModal('add') }
  function openEdit(m: Ministere){ setSelected(m); setForm({ nom: m.nom, tag: m.tag, description: m.description, responsable: m.responsable, couleur: m.couleur }); setModal('edit') }
  function openDelete(m: Ministere){ setSelected(m); setModal('delete') }
  function closeModal()          { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setMinisteres([...ministeres, { id: Date.now(), ...form }])
    } else if (modal === 'edit' && selected) {
      setMinisteres(ministeres.map((m) => m.id === selected.id ? { ...m, ...form } : m))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setMinisteres(ministeres.filter((m) => m.id !== selected.id))
    closeModal()
  }

  return (
    <>
      <Head title="Ministères — Admin Phila MDT" />
      <AdminLayout title="Gestion des ministères">
        <div className="flex justify-end mb-6">
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Ajouter un ministère
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5">
          {ministeres.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-600 transition-colors">
              {/* Color bar */}
              <div className={`h-1.5 w-full ${m.couleur}`} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${m.couleur} rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0`}>
                      {m.nom[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{m.nom}</h3>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{m.tag}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => openDelete(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{m.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                    {m.responsable[0]}
                  </div>
                  <span className="text-xs text-slate-400">Responsable : <span className="text-slate-300">{m.responsable}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Add/Edit */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un ministère' : 'Modifier le ministère'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'nom',          label: 'Nom du ministère' },
                  { key: 'tag',          label: 'Tag / Catégorie'   },
                  { key: 'responsable',  label: 'Responsable'       },
                ] .map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">{label}</label>
                    <input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Couleur</label>
                  <div className="flex gap-2 flex-wrap">
                    {COULEURS.map(({ label, value }) => (
                      <button key={value} title={label} onClick={() => setForm({ ...form, couleur: value })}
                        className={`w-8 h-8 rounded-lg ${value} border-2 transition-all ${form.couleur === value ? 'border-white scale-110' : 'border-transparent'}`} />
                    ))}
                  </div>
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
                <h3 className="text-white font-bold text-lg">Supprimer ce ministère</h3>
                <p className="text-slate-400 text-sm mt-1">Êtes-vous sûr de vouloir supprimer <strong className="text-white">{selected.nom}</strong> ?</p>
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
