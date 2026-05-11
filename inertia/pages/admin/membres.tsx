import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
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
  
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const filtered = membres.filter((m) => {
    const matchSearch  = m.nom.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchMin     = filtreMin === 'Tous'    || m.ministere === filtreMin
    const matchStatut  = filtreStatut === 'Tous' || m.statut === filtreStatut
    return matchSearch && matchMin && matchStatut
  })

  const total = filtered.length
  const lastPage = Math.ceil(total / perPage)
  const paginatedData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const meta = {
    total,
    perPage,
    currentPage,
    lastPage,
    firstPage: 1
  }

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
        <div className="flex flex-wrap gap-3 mb-6 no-print">
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
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-700">
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
            <Plus size={18} /> Ajouter
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden print-section">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="px-6 py-4 font-medium">Membre</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Ministère</th>
                  <th className="px-6 py-4 font-medium text-center">Statut</th>
                  <th className="px-6 py-4 font-medium text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paginatedData.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                          {m.nom[0]}
                        </div>
                        <span className="text-white font-medium">{m.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-300">{m.telephone}</span>
                        <span className="text-slate-500">{m.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{m.ministere}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.statut === 'Actif' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {m.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Pencil size={14}/></button>
                        <button onClick={() => openDelete(m)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
        </div>
      </AdminLayout>
    </>
  )
}
