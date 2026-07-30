import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Search, Filter, Mail, Users, UserCheck, Clock, Download, Calendar, Trash2 } from 'lucide-react'

type StatutAbonne = 'actif' | 'en_attente'

interface Abonne {
  id: number
  email: string
  status: StatutAbonne
  createdAt: string
  confirmedAt: string | null
}

interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

interface Stats {
  total: number
  actifs: number
  attente: number
}

interface Filters {
  search: string
  statut: 'Tous' | StatutAbonne
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function AdminNewsletter({
  subscribers,
  stats,
  filters,
}: {
  subscribers: { data: Abonne[]; meta: PaginationMeta }
  stats: Stats
  filters: Filters
}) {
  const [search, setSearch]           = useState(filters.search ?? '')
  const [filtreStatut, setFiltreStatut] = useState<StatutAbonne | 'Tous'>(filters.statut ?? 'Tous')
  const [deletingId, setDeletingId]   = useState<number | null>(null)

  const data = subscribers?.data ?? []
  const meta: PaginationMeta = subscribers?.meta ?? { total: 0, perPage: 15, currentPage: 1, lastPage: 1, firstPage: 1 }

  /* ── Recherche / Filtre (côté serveur) ── */
  function applyFilters(newSearch: string, newStatut: StatutAbonne | 'Tous') {
    router.get('/admin/newsletter', { search: newSearch, statut: newStatut }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    applyFilters(value, filtreStatut)
  }

  const handleFilterChange = (statut: StatutAbonne | 'Tous') => {
    setFiltreStatut(statut)
    applyFilters(search, statut)
  }

  /* ── Suppression ── */
  const handleDelete = (id: number) => {
    if (!confirm('Supprimer cet abonné ? Cette action est irréversible.')) return
    setDeletingId(id)
    router.delete(`/admin/newsletter/${id}`, {
      onFinish: () => setDeletingId(null),
    })
  }

  /* ── Export CSV ── */
  const handleExport = () => {
    const rows = [
      'Email,Statut,Date Inscription,Confirmation',
      ...data.map(a =>
        `${a.email},${a.status === 'actif' ? 'Actif' : 'En attente'},${formatDate(a.createdAt)},${formatDate(a.confirmedAt)}`
      ),
    ]
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
              <p className="text-3xl font-black text-white">{stats?.total ?? 0}</p>
            </div>
          </div>

          {/* Actifs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <UserCheck size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Confirmés</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-white">{stats?.actifs ?? 0}</p>
                <p className="text-xs text-emerald-400 font-bold mb-1">
                  {(stats?.total ?? 0) > 0 ? Math.round(((stats?.actifs ?? 0) / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* En attente */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Clock size={22} className="text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">En attente</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-white">{stats?.attente ?? 0}</p>
                <p className="text-xs text-amber-400 font-bold mb-1">
                  {(stats?.total ?? 0) > 0 ? Math.round(((stats?.attente ?? 0) / stats.total) * 100) : 0}%
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
              <option value="actif">Confirmés</option>
              <option value="en_attente">En attente</option>
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
              <span className="text-slate-400 font-normal text-sm">({meta.total})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  {['Adresse Email', 'Statut', 'Date d\'inscription', 'Confirmation', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-semibold px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
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
                        a.status === 'actif'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'actif' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {a.status === 'actif' ? 'Confirmé' : 'En attente'}
                      </span>
                    </td>

                    {/* Date inscription */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={13} className="shrink-0" />
                        <span>{formatDate(a.createdAt)}</span>
                      </div>
                    </td>

                    {/* Date confirmation */}
                    <td className="px-6 py-3.5">
                      {a.confirmedAt ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Calendar size={13} className="shrink-0" />
                          <span>{formatDate(a.confirmedAt)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Non confirmé</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                        title="Supprimer"
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* État vide */}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
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
            onPageChange={(p) => router.get('/admin/newsletter', { search, statut: filtreStatut, page: p }, { preserveState: true, preserveScroll: true })}
          />
        </div>

      </AdminLayout>
    </>
  )
}
