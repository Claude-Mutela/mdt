import { Head } from '@inertiajs/react'
import AdminLayout from '../../layouts/admin'
import {
  Users,
  CalendarDays,
  PlayCircle,
  TrendingUp,
  ArrowUpRight,
  Church,
  Ticket,
  Image,
} from 'lucide-react'

const stats = [
  { label: 'Membres actifs',      value: '1 248', delta: '+12%',  icon: Users,       color: 'bg-blue-500/10 text-blue-400',    border: 'border-blue-500/20' },
  { label: 'Événements à venir',  value: '6',     delta: '+2',    icon: Ticket,      color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/20' },
  { label: 'Ministères actifs',   value: '4',     delta: 'stable',icon: Church,      color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
  { label: 'Médias publiés',      value: '38',    delta: '+5',    icon: PlayCircle,  color: 'bg-green-500/10 text-green-400',   border: 'border-green-500/20' },
  { label: 'Photos galerie',      value: '214',   delta: '+18',   icon: Image,       color: 'bg-pink-500/10 text-pink-400',     border: 'border-pink-500/20' },
  { label: 'Cultes ce mois',      value: '8',     delta: 'stable',icon: CalendarDays,color: 'bg-cyan-500/10 text-cyan-400',     border: 'border-cyan-500/20' },
]

const recentMembers = [
  { nom: 'Amani Kalonda',    ministere: 'Génération PHILA', date: '02 Avr 2025', statut: 'Actif' },
  { nom: 'Esther Mbala',     ministere: 'Femmes de Valeur', date: '01 Avr 2025', statut: 'Actif' },
  { nom: 'Daniel Mutombo',   ministere: 'Chorale & Louange',date: '30 Mar 2025', statut: 'Actif' },
  { nom: 'Sarah Lukusa',     ministere: 'École du Dimanche',date: '28 Mar 2025', statut: 'Actif' },
  { nom: 'Paul Ilunga',      ministere: 'Génération PHILA', date: '25 Mar 2025', statut: 'Inactif' },
]

const upcomingEvents = [
  { titre: 'Séminaire Épanouissement', date: '15 Avr', statut: 'upcoming' },
  { titre: 'Soirée de Louange',        date: '20 Avr', statut: 'upcoming' },
  { titre: 'Conférence Jeunesse',      date: '03 Mai', statut: 'upcoming' },
]

const monthlyBars = [40, 65, 50, 80, 70, 90, 75, 95, 60, 85, 72, 88]
const months      = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

export default function AdminDashboard() {
  const max = Math.max(...monthlyBars)

  return (
    <>
      <Head title="Dashboard — Admin Phila MDT" />
      <AdminLayout title="Dashboard">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {stats.map(({ label, value, delta, icon: Icon, color, border }) => (
            <div key={label} className={`bg-slate-900 border ${border} rounded-2xl p-4 flex flex-col gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-green-400">{delta}</span>
                <span className="text-slate-500">ce mois</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Graphique membres ── */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold">Croissance des membres</h2>
                <p className="text-slate-400 text-sm">Présences mensuelles 2025</p>
              </div>
              <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                +12% annuel
              </span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {monthlyBars.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-primary/80 rounded-t-md hover:bg-primary transition-colors"
                    style={{ height: `${(val / max) * 100}%` }}
                  />
                  <span className="text-slate-500 text-[10px]">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Événements à venir ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Prochains événements</h2>
            <div className="space-y-3">
              {upcomingEvents.map((e) => (
                <div key={e.titre} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{e.titre}</p>
                    <p className="text-xs text-slate-400">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Membres récents ── */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold">Derniers membres inscrits</h2>
            <a href="/admin/membres" className="text-xs text-primary flex items-center gap-1 hover:underline">
              Voir tout <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider">Nom</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider">Ministère</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((m) => (
                  <tr key={m.nom} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {m.nom[0]}
                        </div>
                        <span className="text-white font-medium">{m.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{m.ministere}</td>
                    <td className="px-6 py-4 text-slate-400">{m.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.statut === 'Actif'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-700 text-slate-400 border border-slate-600'
                      }`}>
                        {m.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
