import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Search, Filter, Mail, Users, UserCheck, UserX, Download, Calendar } from 'lucide-react'

type StatutAbonne = 'actif' | 'inactif'

interface Abonne {
  id: number
  email: string
  statut: StatutAbonne
  dateInscription: string
}

/* ── Données de démonstration ──────────────────────────── */
const initialData: Abonne[] = [
  { id: 1,  email: 'jean.mbala@gmail.com',        statut: 'actif',   dateInscription: '2025-01-15' },
  { id: 2,  email: 'sarah.lukusa@outlook.com',     statut: 'actif',   dateInscription: '2025-01-22' },
  { id: 3,  email: 'pastor.phila@mdt.cd',          statut: 'inactif', dateInscription: '2025-02-03' },
  { id: 4,  email: 'esperance.nzombi@gmail.com',   statut: 'actif',   dateInscription: '2025-02-10' },
  { id: 5,  email: 'paul.ilunga@yahoo.fr',         statut: 'actif',   dateInscription: '2025-02-18' },
  { id: 6,  email: 'grace.mutombo@gmail.com',      statut: 'inactif', dateInscription: '2025-03-01' },
  { id: 7,  email: 'daniel.kasongo@hotmail.com',   statut: 'actif',   dateInscription: '2025-03-12' },
  { id: 8,  email: 'miriam.tshiama@gmail.com',     statut: 'actif',   dateInscription: '2025-03-20' },
  { id: 9,  email: 'pierre.luyindula@gmail.com',   statut: 'actif',   dateInscription: '2025-03-28' },
  { id: 10, email: 'rachel.ngalula@outlook.com',   statut: 'inactif', dateInscription: '2025-04-05' },
  { id: 11, email: 'emile.bofala@gmail.com',       statut: 'actif',   dateInscription: '2025-04-11' },
  { id: 12, email: 'amour.kitenge@gmail.com',      statut: 'actif',   dateInscription: '2025-04-19' },
  { id: 13, email: 'solange.mbeki@yahoo.fr',       statut: 'inactif', dateInscription: '2025-04-25' },
  { id: 14, email: 'josue.nkosi@gmail.com',        statut: 'actif',   dateInscription: '2025-05-02' },
  { id: 15, email: 'naomi.tshimanga@gmail.com',    statut: 'actif',   dateInscription: '2025-05-09' },
  { id: 16, email: 'caleb.mwamba@mdt.cd',          statut: 'actif',   dateInscription: '2025-05-15' },
  { id: 17, email: 'deborah.kabila@outlook.com',   statut: 'inactif', dateInscription: '2025-05-21' },
  { id: 18, email: 'ezechiel.banda@gmail.com',     statut: 'actif',   dateInscription: '2025-06-01' },
  { id: 19, email: 'lydie.ngandu@gmail.com',       statut: 'actif',   dateInscription: '2025-06-07' },
  { id: 20, email: 'samuel.kayumba@hotmail.com',   statut: 'actif',   dateInscription: '2025-06-14' },
]

/* ── Formateur de date ─────────────────────────────────── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function AdminNewsletter() {
  const [search, setSearch] = useState('')
  const [filtreStatut, setFiltreStatut] = useState<StatutAbonne | 'Tous'>('Tous')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  /* ── Filtrage ── */
  const filtered = initialData.filter((a) => {
    const matchSearch = a.email.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filtreStatut === 'Tous' || a.statut === filtreStatut
    return matchSearch && matchStatut
  })

  /* ── Pagination ── */
  const total = filtered.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const paginatedData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const meta = { total, perPage, currentPage, lastPage, firstPage: 1 }

  /* ── Stats ── */
  const totalAll = initialData.length
  const totalActifs = initialData.filter(a => a.statut === 'actif').length
  const totalInactifs = initialData.filter(a => a.statut === 'inactif').length

  const handleFilterChange = (statut: StatutAbonne | 'Tous') => {
    setFiltreStatut(statut)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  /* ── Faux export CSV ── */
  const handleExport = () => {
    const rows = ['Email,Statut,Date Inscription', ...filtered.map(a => `${a.email},${a.statut},${a.dateInscription}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head title="Newsletter — Admin Phila MDT" />
      <AdminLayout title="Newsletter">

        {/* ── Cartes Statistiques ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Users size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Total abonnés</p>
              <p className="text-3xl font-black text-white">{totalAll}</p>
            </div>
          </div>

          {/* Actifs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <UserCheck size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Actifs</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-white">{totalActifs}</p>
                <p className="text-xs text-emerald-400 font-bold mb-1">
                  {totalAll > 0 ? Math.round((totalActifs / totalAll) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Inactifs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <UserX size={22} className="text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Inactifs</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-white">{totalInactifs}</p>
                <p className="text-xs text-red-400 font-bold mb-1">
                  {totalAll > 0 ? Math.round((totalInactifs / totalAll) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Barre d'outils ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Recherche */}
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par email…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select
              value={filtreStatut}
              onChange={(e) => handleFilterChange(e.target.value as StatutAbonne | 'Tous')}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary capitalize transition-colors"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExport}
            title="Exporter en CSV"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Download size={15} />
            <span>Exporter</span>
          </button>
        </div>

        {/* ── Tableau ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* En-tête du tableau */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              Liste des Abonnés
              <span className="text-slate-400 font-normal text-sm">({total})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  {['Adresse Email', 'Statut', 'Date d\'inscription'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-semibold px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    {/* Email */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <Mail size={14} className="text-slate-400" />
                        </div>
                        <span className="text-white font-medium">{a.email}</span>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        a.statut === 'actif'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.statut === 'actif' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {a.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={13} className="shrink-0" />
                        <span>{formatDate(a.dateInscription)}</span>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* État vide */}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                          <Mail size={24} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-medium">Aucun abonné trouvé</p>
                        <p className="text-slate-600 text-xs">Modifiez vos filtres de recherche</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            meta={meta}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>

      </AdminLayout>
    </>
  )
}
