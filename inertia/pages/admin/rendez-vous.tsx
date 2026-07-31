import { Head, router, useForm } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import {
  Search, Calendar, Printer,
  CheckCircle2, XCircle, Mail, Phone, Trash2,
  Pencil, X, Clock, CalendarDays, Check, Loader2
} from 'lucide-react'

interface Appointment {
  id: number
  clientName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  subject: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

interface Props {
  appointments: Appointment[]
}

export default function AdminAppointments({ appointments: initialAppointments = [] }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  // ── Modal d'impression ─────────────────────────────────────
  const [printModal, setPrintModal] = useState(false)
  const [printPeriod, setPrintPeriod] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('mois')
  const [printRef, setPrintRef] = useState(() => new Date().toISOString().slice(0, 7))
  const [printStatus, setPrintStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')

  // ── Reschedule modal ───────────────────────────────────────
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null)
  const rescheduleForm = useForm({ appointmentDate: '', appointmentTime: '' })

  function openReschedule(app: Appointment) {
    rescheduleForm.reset()
    rescheduleForm.setData({ appointmentDate: app.date, appointmentTime: app.time })
    setRescheduleTarget(app)
  }

  function submitReschedule(e: React.FormEvent) {
    e.preventDefault()
    if (!rescheduleTarget) return
    rescheduleForm.patch(`/admin/rendez-vous/${rescheduleTarget.id}/reschedule`, {
      onSuccess: () => setRescheduleTarget(null),
    })
  }

  // Sync state with props when Inertia re-renders
  useEffect(() => {
    setAppointments(initialAppointments)
  }, [initialAppointments])

  const handleConfirm = (id: number) => {
    if (confirm('Voulez-vous vraiment confirmer ce rendez-vous ?')) {
      router.put(`/admin/rendez-vous/${id}`, { status: 'confirmed' })
    }
  }

  const handleCancel = (id: number) => {
    if (confirm('Voulez-vous vraiment marquer ce rendez-vous comme annulé ?')) {
      router.put(`/admin/rendez-vous/${id}`, { status: 'cancelled' })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette demande de rendez-vous ?')) {
      router.delete(`/admin/rendez-vous/${id}`)
    }
  }

  const filtered = appointments.filter(app => {
    const matchesSearch =
      app.clientName.toLowerCase().includes(search.toLowerCase()) ||
      app.subject.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search)

    if (filterDate === 'all') return matchesSearch

    const todayStr = new Date().toISOString().split('T')[0]
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    if (filterDate === 'today') return matchesSearch && app.date === todayStr
    if (filterDate === 'tomorrow') return matchesSearch && app.date === tomorrowStr
    return matchesSearch
  })

  const total = filtered.length
  const lastPage = Math.ceil(total / perPage) || 1
  const paginatedData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const meta = { total, perPage, currentPage, lastPage, firstPage: 1 }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default: return 'bg-slate-700 text-slate-300 border border-slate-600'
    }
  }

  return (
    <>
      <Head title="Rendez-vous — Admin Phila MDT" />
      <AdminLayout title="Gestion des Rendez-vous">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex flex-1 gap-3 min-w-[300px]">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                placeholder="Rechercher (nom, motif, email, téléphone)..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3">
              <Calendar size={16} className="text-slate-400" />
              <select
                value={filterDate}
                onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1) }}
                className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 py-2 outline-none"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="tomorrow">Demain</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setPrintModal(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-700 shadow-lg"
          >
            <Printer size={16} /> Imprimer la liste
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Planning des rendez-vous <span className="text-slate-500 font-normal text-sm">({total})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            {paginatedData.length === 0 ? (
              <div className="p-12 text-center text-slate-500">Aucun rendez-vous trouvé.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Client</th>
                    <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Date & Heure</th>
                    <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Motif</th>
                    <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Statut</th>
                    <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px] print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {paginatedData.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{app.clientName}</span>
                          <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {app.phone}
                          </span>
                          {app.email && (
                            <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {app.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-slate-300">
                          <span className="font-medium">
                            {new Date(app.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-primary text-xs font-bold">{app.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400 italic">"{app.subject}"</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${getStatusBadge(app.status)}`}>
                          {app.status === 'confirmed' ? 'Confirmé' : app.status === 'pending' ? 'En attente' : 'Annulé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 print:hidden">
                        <div className="flex items-center gap-1.5">
                          {/* Modifier la date/heure */}
                          <button
                            onClick={() => openReschedule(app)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                            title="Modifier la date / heure"
                          >
                            <Pencil size={15} />
                          </button>

                          {/* Confirmer / Annuler — seulement si en attente */}
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirm(app.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-400/10 transition-all"
                                title="Confirmer le rendez-vous"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                              <button
                                onClick={() => handleCancel(app.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-orange-400/10 transition-all"
                                title="Annuler le rendez-vous"
                              >
                                <XCircle size={15} />
                              </button>
                            </>
                          )}

                          {/* Supprimer */}
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Supprimer la demande"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {lastPage > 1 && (
            <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
          )}
        </div>
      </AdminLayout>

      {/* ══════════════════════════════════════════════════════
          MODAL — FILTRE D'IMPRESSION
      ══════════════════════════════════════════════════════ */}
      {printModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Printer size={16} className="text-primary" /> Imprimer les rendez-vous
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Choisissez la période à imprimer</p>
              </div>
              <button
                onClick={() => setPrintModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Sélection de la période */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">
                  Période
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['jour', 'semaine', 'mois', 'annee'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPrintPeriod(p)
                        const today = new Date()
                        if (p === 'jour')    setPrintRef(today.toISOString().slice(0, 10))
                        if (p === 'semaine') setPrintRef(today.toISOString().slice(0, 10))
                        if (p === 'mois')    setPrintRef(today.toISOString().slice(0, 7))
                        if (p === 'annee')   setPrintRef(String(today.getFullYear()))
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                        printPeriod === p
                          ? 'bg-primary border-primary text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-primary/50'
                      }`}
                    >
                      {p === 'annee' ? 'Année' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input de référence dynamique selon la période */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">
                  {printPeriod === 'jour'    && 'Date'}
                  {printPeriod === 'semaine' && 'N\'importe quel jour de la semaine'}
                  {printPeriod === 'mois'    && 'Mois'}
                  {printPeriod === 'annee'   && 'Année'}
                </label>

                {(printPeriod === 'jour' || printPeriod === 'semaine') && (
                  <input
                    type="date"
                    value={printRef}
                    onChange={(e) => setPrintRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                )}

                {printPeriod === 'mois' && (
                  <input
                    type="month"
                    value={printRef}
                    onChange={(e) => setPrintRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                )}

                {printPeriod === 'annee' && (
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={printRef}
                    onChange={(e) => setPrintRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                )}
              </div>

              {/* Filtre par statut */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">
                  Statut
                </label>
                <select
                  value={printStatus}
                  onChange={(e) => setPrintStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="all">Tous les rendez-vous</option>
                  <option value="confirmed">Confirmés seulement</option>
                  <option value="pending">En attente seulement</option>
                  <option value="cancelled">Annulés seulement</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => setPrintModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = `/admin/rendez-vous/print?period=${printPeriod}&ref=${encodeURIComponent(printRef)}&status=${printStatus}`
                  window.open(url, '_blank')
                  setPrintModal(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors"
              >
                <Printer size={14} /> Générer l'impression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — MODIFIER DATE & HEURE
      ══════════════════════════════════════════════════════ */}
      {rescheduleTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h3 className="text-white font-bold">Modifier le rendez-vous</h3>
                <p className="text-slate-400 text-xs mt-0.5">{rescheduleTarget.clientName}</p>
              </div>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitReschedule} className="p-6 space-y-4">
              {/* Date */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
                  <CalendarDays size={11} /> Nouvelle date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleForm.data.appointmentDate}
                  onChange={(e) => rescheduleForm.setData('appointmentDate', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-800 border ${rescheduleForm.errors.appointmentDate ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors`}
                />
                {rescheduleForm.errors.appointmentDate && (
                  <p className="text-red-400 text-xs mt-1">{rescheduleForm.errors.appointmentDate}</p>
                )}
              </div>

              {/* Heure */}
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
                  <Clock size={11} /> Nouvelle heure <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={rescheduleForm.data.appointmentTime}
                  onChange={(e) => rescheduleForm.setData('appointmentTime', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-800 border ${rescheduleForm.errors.appointmentTime ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors`}
                />
                {rescheduleForm.errors.appointmentTime && (
                  <p className="text-red-400 text-xs mt-1">{rescheduleForm.errors.appointmentTime}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={rescheduleForm.processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {rescheduleForm.processing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          aside, header { display: none !important; }
          .bg-slate-900 { background: white !important; border: 1px solid #ddd !important; }
          .text-white { color: black !important; }
          .text-slate-400, .text-slate-500 { color: #666 !important; }
        }
      `}</style>
    </>
  )
}
