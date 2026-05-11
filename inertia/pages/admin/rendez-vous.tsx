import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { 
  Search, Filter, Calendar, Printer, 
  MoreVertical, CheckCircle2, Clock, 
  XCircle, User, Mail, Phone, MessageSquare
} from 'lucide-react'

interface Appointment {
  id: number
  clientName: string
  email: string
  phone: string
  date: string
  time: string
  subject: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

const initialAppointments: Appointment[] = [
  { id: 1, clientName: 'Alice Johnson', email: 'alice@example.com', phone: '0812345678', date: '2024-05-12', time: '10:00', subject: 'Conseil pastoral', status: 'confirmed' },
  { id: 2, clientName: 'Bob Smith', email: 'bob@example.com', phone: '0823456789', date: '2024-05-12', time: '14:30', subject: 'Demande de baptême', status: 'pending' },
  { id: 3, clientName: 'Charlie Brown', email: 'charlie@example.com', phone: '0898765432', date: '2024-05-13', time: '09:00', subject: 'Entretien mariage', status: 'pending' },
  { id: 4, clientName: 'Diana Ross', email: 'diana@example.com', phone: '0912345678', date: '2024-05-14', time: '11:15', subject: 'Visite à domicile', status: 'cancelled' },
]

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const filtered = appointments.filter(app => 
    app.clientName.toLowerCase().includes(search.toLowerCase()) ||
    app.subject.toLowerCase().includes(search.toLowerCase())
  )

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

  const handlePrint = () => {
    window.print()
  }

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
        
        {/* ── Toolbar ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex flex-1 gap-3 min-w-[300px]">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un rendez-vous (nom, sujet)..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3">
              <Calendar size={16} className="text-slate-400" />
              <select 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 py-2 capitalize"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="tomorrow">Demain</option>
                <option value="range">Plage personnalisée</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-700 shadow-lg"
          >
            <Printer size={16} /> Imprimer la liste
          </button>
        </div>

        {/* ── Table ────────────────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Planning des rendez-vous <span className="text-slate-500 font-normal text-sm">({total})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Client</th>
                  <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Date & Heure</th>
                  <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Sujet</th>
                  <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px]">Statut</th>
                  <th className="px-6 py-3 text-slate-400 font-medium uppercase tracking-wider text-[11px] print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paginatedData.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{app.clientName}</span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Mail size={10} /> {app.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-slate-300">
                        <span className="font-medium">{new Date(app.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
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
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-400/10 transition-all">
                          <CheckCircle2 size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <XCircle size={16} />
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

      </AdminLayout>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          aside, header, .print-hidden { display: none !important; }
          .bg-slate-900 { background: white !important; border: 1px solid #ddd !important; }
          .text-white { color: black !important; }
          .text-slate-400, .text-slate-500 { color: #666 !important; }
        }
      `}</style>
    </>
  )
}
