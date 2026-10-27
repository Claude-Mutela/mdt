 import { useState, useMemo } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CalendarDays,
  Calendar,
} from 'lucide-react'
import { DateTime } from 'luxon'

interface AgendaItem {
  id: number
  day: string // "YYYY-MM-DD"
  title: string
  hourStart: string | null
  hourEnd: string | null
  place: string | null
  catActivity: { id: number; name: string } | null
}

interface Props {
  agendas: AgendaItem[]
  currentWeek: string // "YYYY-Www"
}

/** Formatage d'une heure "17:30:00" ou "17:30" en "17h30" */
function formatHour(timeStr: string | null | undefined): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  if (h !== undefined && m !== undefined) {
    return `${h.padStart(2, '0')}h${m}`
  }
  return timeStr
}

/** Formatage d'une plage horaire (ex: "17h30 - 19h30") */
function formatTimeRange(start: string | null | undefined, end: string | null | undefined): string {
  const fStart = formatHour(start)
  const fEnd = formatHour(end)
  if (fStart && fEnd) return `${fStart} - ${fEnd}`
  if (fStart) return `Dès ${fStart}`
  if (fEnd) return `Jusqu'à ${fEnd}`
  return ''
}

/** Formatage en français du jour (ex: "Mardi 6 octobre") */
function formatDay(dateStr: string): { fullDate: string; isToday: boolean } {
  if (!dateStr) return { fullDate: '', isToday: false }
  const dt = DateTime.fromISO(dateStr).setLocale('fr')
  const isToday = dt.hasSame(DateTime.now(), 'day')
  const formatted = dt.toFormat('EEEE d MMMM')
  const fullDate = formatted.charAt(0).toUpperCase() + formatted.slice(1)
  return { fullDate, isToday }
}

/** Styles harmonieux des badges selon la catégorie */
const CATEGORY_STYLES: Record<string, { badge: string }> = {
  culte: { badge: 'bg-primary/10 text-primary border-primary/20' },
  enseignement: { badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  priere: { badge: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  jeunesse: { badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  communion: { badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  celebration: { badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  evangelisation: { badge: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
}

function getCategoryStyle(name?: string | null): { badge: string } {
  if (!name) return { badge: 'bg-slate-100 text-slate-600 border-slate-200' }
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  for (const [key, val] of Object.entries(CATEGORY_STYLES)) {
    if (normalized.includes(key)) return val
  }
  return { badge: 'bg-primary/10 text-primary border-primary/20' }
}

export default function Agenda({ agendas = [], currentWeek }: Props) {
  // Parse the currentWeek from the server or default to now
  const initialDate = useMemo(() => {
    if (currentWeek) {
      return DateTime.fromISO(currentWeek).setLocale('fr').startOf('week')
    }
    return DateTime.now().setLocale('fr').startOf('week')
  }, [currentWeek])

  const [weekStart, setWeekStart] = useState<DateTime>(initialDate)

  const weekEnd = weekStart.endOf('week')
  const weekRange = `Du ${weekStart.toFormat('dd')} au ${weekEnd.toFormat('dd LLLL yyyy')}`

  // Navigate weeks by reloading via Inertia with query param
  const navigate = (dir: 1 | -1) => {
    const next = weekStart.plus({ weeks: dir })
    setWeekStart(next)
    router.get(
      '/agenda',
      { week: next.toFormat("kkkk-'W'WW") },
      { preserveScroll: false, replace: true }
    )
  }

  const resetToToday = () => {
    const today = DateTime.now().setLocale('fr').startOf('week')
    setWeekStart(today)
    router.get('/agenda', {}, { preserveScroll: false, replace: true })
  }

  // Tri chronologique des rendez-vous par jour puis heure de début
  const sortedAgendas = useMemo(() => {
    return [...agendas].sort((a, b) => {
      const cmpDay = a.day.localeCompare(b.day)
      if (cmpDay !== 0) return cmpDay
      return (a.hourStart || '').localeCompare(b.hourStart || '')
    })
  }, [agendas])

  const hasAnyEvent = agendas.length > 0

  return (
    <>
      <Head title="Agenda des Cultes - Phila Maison de Témoignages">
        <meta
          name="description"
          content="Consultez l'agenda et le programme de nos cultes, réunions de prière hebdomadaires et célébrations spéciales à la Phila Maison de Témoignages."
        />
      </Head>

      <main className="min-h-screen bg-background-off pb-20">
        {/* Hero Section */}
        <div className="relative h-[40vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/mdt-banner.jpg" alt="Agenda Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
          </div>

          <div className="relative z-10 space-y-6 max-w-4xl px-4">
            <span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-bold">
              Programme Hebdomadaire
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-serif text-white leading-tight">
              L'Agenda de Notre Église
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-xl max-w-2xl mx-auto">
              Planifiez votre semaine spirituelle et ne manquez aucun rendez-vous avec la présence
              de Dieu.
            </p>
          </div>
        </div>

        {/* Calendar View */}
        <section className="max-w-6xl mx-auto px-4 mt-[-60px] relative z-20">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-8 md:p-12 space-y-16">
            {/* Week navigation header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black font-serif text-slate-900 leading-tight">
                    Semaine en cours
                  </h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                    {weekStart.year}
                  </span>
                </div>
                <p className="text-slate-500 font-bold text-xl">{weekRange}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                  <button
                    id="agenda-prev-week"
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                    aria-label="Semaine précédente"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    id="agenda-today"
                    onClick={resetToToday}
                    className="px-6 flex items-center justify-center gap-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-800 font-bold text-sm transition-all"
                  >
                    <RotateCcw size={16} className="text-primary" />
                    Aujourd'hui
                  </button>
                  <button
                    id="agenda-next-week"
                    onClick={() => navigate(1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                    aria-label="Semaine suivante"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of cards */}
            {!hasAnyEvent ? (
              <div className="text-center py-20 px-4 space-y-4 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                  <CalendarDays size={38} className="text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-serif text-slate-900">
                    Aucun événement cette semaine
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Il n'y a pas d'activité planifiée pour cette période. Utilisez les boutons
                    ci-dessus pour naviguer vers une autre semaine.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAgendas.map((item) => {
                  const catName = item.catActivity?.name ?? 'Activité'
                  const catStyle = getCategoryStyle(catName)
                  const dateInfo = formatDay(item.day)
                  const timeRange = formatTimeRange(item.hourStart, item.hourEnd)
                  const isLive = item.place ? /live|direct/i.test(item.place) : false

                  return (
                    <article
                      key={item.id}
                      className="group relative bg-white rounded-2xl border border-slate-200/60 hover:border-primary/40 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      {/* Subtle hover gradient glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="space-y-4">
                        {/* Header: Date & Category Badge */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Calendar size={14} className="text-primary shrink-0" />
                            <span>{dateInfo.fullDate}</span>
                            {dateInfo.isToday && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Aujourd'hui
                              </span>
                            )}
                          </div>

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors shadow-2xs ${catStyle.badge}`}
                          >
                            {catName}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-lg md:text-xl font-bold font-serif text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {/* Footer: Time & Place */}
                      <div className="pt-4 mt-6 border-t border-slate-100 space-y-2.5">
                        {timeRange && (
                          <div className="flex items-center gap-2.5 text-slate-800 text-sm font-semibold">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors shrink-0">
                              <Clock size={14} />
                            </div>
                            <span>{timeRange}</span>
                          </div>
                        )}

                        {item.place && (
                          <div className="flex items-center justify-between gap-2 text-slate-500 text-xs font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors shrink-0">
                                <MapPin size={14} />
                              </div>
                              <span className="truncate" title={item.place}>
                                {item.place}
                              </span>
                            </div>

                            {isLive && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                LIVE
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
