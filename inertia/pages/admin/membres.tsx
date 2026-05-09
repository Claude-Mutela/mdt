import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { Plus, Search, Filter, Pencil, Trash2, X, Check, Printer } from 'lucide-react'

type Statut = 'Actif' | 'Inactif'

interface Membre {
  id: number
  nom: string
  telephone: string
  email: string
  ministere: string
  date: string
  statut: Statut
}

const MINISTERES = ['Tous', 'Génération PHILA', 'École du Dimanche', 'Chorale & Louange', 'Femmes de Valeur']

const initialData: Membre[] = [
  { id: 1, nom: 'Amani Kalonda',   telephone: '+243 81 234 5678', email: 'amani@mdt.cd',   ministere: 'Génération PHILA',  date: '02 Avr 2025', statut: 'Actif'   },
  { id: 2, nom: 'Esther Mbala',    telephone: '+243 99 876 5432', email: 'esther@mdt.cd',  ministere: 'Femmes de Valeur',  date: '01 Avr 2025', statut: 'Actif'   },
  { id: 3, nom: 'Daniel Mutombo',  telephone: '+243 82 111 2222', email: 'daniel@mdt.cd',  ministere: 'Chorale & Louange', date: '30 Mar 2025', statut: 'Actif'   },
  { id: 4, nom: 'Sarah Lukusa',    telephone: '+243 90 333 4444', email: 'sarah@mdt.cd',   ministere: 'École du Dimanche', date: '28 Mar 2025', statut: 'Actif'   },
  { id: 5, nom: 'Paul Ilunga',     telephone: '+243 81 555 6666', email: 'paul@mdt.cd',    ministere: 'Génération PHILA',  date: '25 Mar 2025', statut: 'Inactif' },
  { id: 6, nom: 'Grace Kasongo',   telephone: '+243 97 777 8888', email: 'grace@mdt.cd',   ministere: 'Femmes de Valeur',  date: '20 Mar 2025', statut: 'Actif'   },
  { id: 7, nom: 'Emmanuel Tshiab', telephone: '+243 84 999 0000', email: 'emman@mdt.cd',   ministere: 'Chorale & Louange', date: '15 Mar 2025', statut: 'Actif'   },
  { id: 8, nom: 'Lydie Ngoy',      telephone: '+243 82 123 9876', email: 'lydie@mdt.cd',   ministere: 'École du Dimanche', date: '10 Mar 2025', statut: 'Inactif' },
]

const empty: Omit<Membre, 'id'> = { nom: '', telephone: '', email: '', ministere: 'Génération PHILA', date: '', statut: 'Actif' }

export default function AdminMembres() {
  const [membres, setMembres]       = useState<Membre[]>(initialData)
  const [search, setSearch]         = useState('')
  const [filtreMin, setFiltreMin]   = useState('Tous')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [modal, setModal]           = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]     = useState<Membre | null>(null)
  const [form, setForm]             = useState<Omit<Membre, 'id'>>(empty)

  const filtered = membres.filter((m) => {
    const matchSearch  = m.nom.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchMin     = filtreMin === 'Tous'    || m.ministere === filtreMin
    const matchStatut  = filtreStatut === 'Tous' || m.statut === filtreStatut
    return matchSearch && matchMin && matchStatut
  })

  function openAdd()              { setForm(empty); setModal('add') }
  function openEdit(m: Membre)    { setSelected(m); setForm({ nom: m.nom, telephone: m.telephone, email: m.email, ministere: m.ministere, date: m.date, statut: m.statut }); setModal('edit') }
  function openDelete(m: Membre)  { setSelected(m); setModal('delete') }
  function closeModal()           { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setMembres([...membres, { id: Date.now(), ...form }])
    } else if (modal === 'edit' && selected) {
      setMembres(membres.map((m) => m.id === selected.id ? { ...m, ...form } : m))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setMembres(membres.filter((m) => m.id !== selected.id))
    closeModal()
  }

  function handlePrint() {
    window.print()
  }

  return (
    <>
      <Head title="Membres — Admin Phila MDT" />
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <AdminLayout title="Gestion des membres">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un membre…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={filtreMin} onChange={(e) => setFiltreMin(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary"
            >
              {MINISTERES.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select
              value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary"
            >
              <option>Tous</option><option>Actif</option><option>Inactif</option>
            </select>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-slate-700">
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden print-section">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold">Membres <span className="text-slate-400 font-normal text-sm">({filtered.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Membre', 'Téléphone', 'Email', 'Ministère', 'Date', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {m.nom[0]}
                        </div>
                        <span className="text-white font-medium whitespace-nowrap">{m.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{m.telephone}</td>
                    <td className="px-6 py-4 text-slate-400">{m.email}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{m.ministere}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{m.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.statut === 'Actif'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-700 text-slate-400 border border-slate-600'
                      }`}>{m.statut}</span>
                    </td>
                    <td className="px-6 py-4 no-print">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => openDelete(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Modal Add/Edit ── */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un membre' : 'Modifier le membre'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                {(['nom', 'telephone', 'email'] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">{field === 'nom' ? 'Nom complet' : field === 'telephone' ? 'Téléphone' : 'Email'}</label>
                    <input
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Ministère</label>
                  <select value={form.ministere} onChange={(e) => setForm({ ...form, ministere: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary">
                    {MINISTERES.filter(m => m !== 'Tous').map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Statut</label>
                  <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as Statut })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary">
                    <option>Actif</option><option>Inactif</option>
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

        {/* ── Modal Delete ── */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer le membre</h3>
                <p className="text-slate-400 text-sm mt-1">Êtes-vous sûr de vouloir supprimer <strong className="text-white">{selected.nom}</strong> ? Cette action est irréversible.</p>
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
