import { Head } from '@inertiajs/react'
import AdminLayout from '../../layouts/admin'
import CloudinaryImage from '../../components/CloudinaryImage'
import {
  Users,
  CalendarDays,
  PlayCircle,
  TrendingUp,
  ArrowUpRight,
  Church,
  Ticket,
  Image,
  Coins,
} from 'lucide-react'

const months      = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

export default function AdminDashboard({
  stats = [],
  recentMembers = [],
  upcomingEvents = [],
  monthlyBars = [],
  annualGrowthStr = 'stable annuel',
  currentYear = new Date().getFullYear(),
}: {
  stats: { label: string; value: string; delta: string }[]
  recentMembers: { nom: string; ministere: string; date: string; statut: string; coverImg?: string | null }[]
  upcomingEvents: { titre: string; date: string; statut: string }[]
  monthlyBars: number[]
  annualGrowthStr: string
  currentYear: number
}) {
  const max = Math.max(...monthlyBars, 1)

  const statConfig: Record<string, { icon: any; color: string; border: string }> = {
    'Membres actifs': { icon: Users, color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
    'Événements à venir': { icon: Ticket, color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/20' },
    'Ministères actifs': { icon: Church, color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
    'Médias publiés': { icon: PlayCircle, color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
    'Photos galerie': { icon: Image, color: 'bg-pink-500/10 text-pink-400', border: 'border-pink-500/20' },
    'Cultes ce mois': { icon: CalendarDays, color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/20' },
    'Solde Net (USD)': { icon: Coins, color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
    'Solde Net (CDF)': { icon: Coins, color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20' },
    'Nouveaux venus': { icon: Users, color: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/20' },
  }

  // Filtrer/Masquer les médias publiés et les photos de galerie conformément aux ajustements demandés
  const mappedStats = stats
    .filter((s) => s.label !== 'Médias publiés' && s.label !== 'Photos galerie')
    .map((s) => {
      const config = statConfig[s.label] || { icon: Users, color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/20' }
      return { ...s, ...config }
    })

  return (
    <>
      <Head title="Dashboard — Admin Phila MDT" />
      <AdminLayout title="Dashboard">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {mappedStats.map(({ label, value, delta, icon: Icon, color, border }) => (
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
          {/* ── Graphique nouveaux venus ── */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold">Croissance des nouveaux venus</h2>
                <p className="text-slate-400 text-sm">Nouveaux venus mensuels {currentYear}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                {annualGrowthStr}
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
              {upcomingEvents.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Aucun événement à venir.</p>
              ) : (
                upcomingEvents.map((e) => (
                  <div key={e.titre} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shrink-0">
                      <CalendarDays size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{e.titre}</p>
                      <p className="text-xs text-slate-400">{e.date}</p>
                    </div>
                  </div>
                ))
              )}
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
                {recentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Aucun membre enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentMembers.map((m) => (
                    <tr key={m.nom} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {m.coverImg ? (
                            <CloudinaryImage 
                              src={m.coverImg} 
                              width={80} 
                              height={80} 
                              alt={m.nom} 
                              className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm shrink-0" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                              {m.nom ? m.nom[0] : ''}
                            </div>
                          )}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}
