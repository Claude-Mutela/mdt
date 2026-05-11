import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Plus, Search, Filter, Pencil, Trash2, X, Check, HeartHandshake, Printer } from 'lucide-react'

type TypeDon = 'e-money' | 'card' | 'virement' | 'en nature'
type StatutDon = 'Complété' | 'En attente' | 'Annulé'

interface Donation {
  id: number
  donateur: string
  montant_nature: string
  type: TypeDon
  date: string
  statut: StatutDon
  notes: string
}

const TYPES_DON: TypeDon[] = ['e-money', 'card', 'virement', 'en nature']
const STATUTS: StatutDon[] = ['Complété', 'En attente', 'Annulé']

const initialData: Donation[] = [
  { id: 1, donateur: 'Anonyme',          montant_nature: '150 USD', type: 'card',          date: '05 Mai 2025', statut: 'Complété', notes: 'Don via carte bancaire' },
  { id: 2, donateur: 'Famille Kasongo',  montant_nature: '10 chaises plastiques', type: 'en nature',  date: '03 Mai 2025', statut: 'En attente', notes: 'À récupérer au secrétariat' },
  { id: 3, donateur: 'Paul Ilunga',      montant_nature: '500 USD', type: 'virement', date: '01 Mai 2025', statut: 'Complété', notes: 'Virement Equity BCDC' },
  { id: 4, donateur: 'Anonyme',          montant_nature: '50 000 CDF', type: 'e-money',       date: '28 Avr 2025', statut: 'Annulé',   notes: 'Paiement mobile money échoué' },
  { id: 5, donateur: 'Sarah Lukusa',     montant_nature: 'Instruments de musique', type: 'en nature', date: '25 Avr 2025', statut: 'Complété', notes: 'Remis lors du culte' },
]

const emptyForm: Omit<Donation, 'id'> = { donateur: '', montant_nature: '', type: 'e-money', date: '', statut: 'En attente', notes: '' }

export default function AdminDonations() {
  const [donations, setDonations]   = useState<Donation[]>(initialData)
  const [search, setSearch]         = useState('')
  const [filtreType, setFiltreType] = useState<TypeDon | 'Tous'>('Tous')
  const [filtreStatut, setFiltreStatut] = useState<StatutDon | 'Tous'>('Tous')
  const [modal, setModal]           = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]     = useState<Donation | null>(null)
  const [form, setForm]             = useState<Omit<Donation, 'id'>>(emptyForm)

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const filtered = donations.filter((d) => {
    const matchSearch  = d.donateur.toLowerCase().includes(search.toLowerCase()) || d.montant_nature.toLowerCase().includes(search.toLowerCase())
    const matchType    = filtreType === 'Tous' || d.type === filtreType
    const matchStatut  = filtreStatut === 'Tous' || d.statut === filtreStatut
    return matchSearch && matchType && matchStatut
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

  function openAdd()                { setForm(emptyForm); setModal('add') }
  function openEdit(d: Donation)    { setSelected(d); setForm({ donateur: d.donateur, montant_nature: d.montant_nature, type: d.type, date: d.date, statut: d.statut, notes: d.notes }); setModal('edit') }
  function openDelete(d: Donation)  { setSelected(d); setModal('delete') }
  function closeModal()             { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setDonations([{ id: Date.now(), ...form }, ...donations])
    } else if (modal === 'edit' && selected) {
      setDonations(donations.map((d) => d.id === selected.id ? { ...d, ...form } : d))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setDonations(donations.filter((d) => d.id !== selected.id))
    closeModal()
  }

  function handlePrint() {
    window.print()
  }

  return (
    <>
      <Head title="Dons — Admin Phila MDT" />
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <AdminLayout title="Gestion des dons">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap gap-3 mb-6 no-print">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par donateur ou montant…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={filtreType} onChange={(e) => setFiltreType(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary"
            >
              <option value="Tous">Tous les types</option>
              {TYPES_DON.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary"
            >
              <option value="Tous">Tous les statuts</option>
              {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-slate-700">
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Enregistrer un don
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden print-section shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
            <h2 className="text-white font-bold flex items-center gap-2">
              <HeartHandshake size={18} className="text-primary" />
              Historique des dons <span className="text-slate-400 font-normal text-sm">({total})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  {['Donateur', 'Montant / Nature', 'Type', 'Date', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paginatedData.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-white font-medium whitespace-nowrap">{d.donateur}</span>
                        {d.notes && <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[150px]">{d.notes}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">{d.montant_nature}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                        d.type === 'e-money' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        d.type === 'card' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        d.type === 'virement' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{d.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        d.statut === 'Complété' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        d.statut === 'En attente' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {d.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 no-print">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => openDelete(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
        </div>

        {/* ── Modals (Simplified for context) ── */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            {/* Modal Content */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               {/* (Form content remains the same) */}
               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Enregistrer un don' : 'Modifier le don'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Donateur</label>
                  <input
                    value={form.donateur}
                    onChange={(e) => setForm({ ...form, donateur: e.target.value })}
                    placeholder="Ex: Anonyme ou John Doe"
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Montant ou Nature</label>
                  <input
                    value={form.montant_nature}
                    onChange={(e) => setForm({ ...form, montant_nature: e.target.value })}
                    placeholder="Ex: 150 USD ou 5 chaises"
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Date</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Ex: 05 Mai 2025"
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Type de don</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as TypeDon })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary"
                  >
                    {TYPES_DON.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Statut</label>
                  <select
                    value={form.statut}
                    onChange={(e) => setForm({ ...form, statut: e.target.value as StatutDon })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary"
                  >
                    {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Notes (Optionnel)</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Informations supplémentaires..."
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
                  <Check size={15} /> {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer le don</h3>
                <p className="text-slate-400 text-sm mt-1">Êtes-vous sûr de vouloir supprimer la trace de ce don de <strong className="text-white">{selected.montant_nature}</strong> par <strong className="text-white">{selected.donateur}</strong> ?</p>
              </div>
              <div className="flex gap-3 mt-6">
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
