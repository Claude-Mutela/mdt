import { useState, useMemo } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { Clock, MapPin, ChevronLeft, ChevronRight, RotateCcw, CalendarDays } from 'lucide-react'
import { DateTime } from 'luxon'

interface AgendaItem {
  id: number
  day: string      // "YYYY-MM-DD"
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

const DAY_NAMES_FR = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

// Color palette cycling through categories
const CATEGORY_COLORS: Record<string, string> = {}
const COLOR_PALETTE = [
  'bg-primary', 'bg-blue-500', 'bg-orange-600', 'bg-purple-600',
  'bg-pink-500', 'bg-green-600', 'bg-slate-700', 'bg-amber-500',
]
let colorIdx = 0
function getCategoryColor(catName: string): string {
  if (!CATEGORY_COLORS[catName]) {
    CATEGORY_COLORS[catName] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length]
    colorIdx++
  }
  return CATEGORY_COLORS[catName]
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
  const weekStr = weekStart.toFormat("kkkk-'W'WW")

  // Navigate weeks by reloading via Inertia with query param
  const navigate = (dir: 1 | -1) => {
    const next = weekStart.plus({ weeks: dir })
    setWeekStart(next)
    router.get('/agenda', { week: next.toFormat("kkkk-'W'WW") }, { preserveScroll: false, replace: true })
  }

  const resetToToday = () => {
    const today = DateTime.now().setLocale('fr').startOf('week')
    setWeekStart(today)
    router.get('/agenda', {}, { preserveScroll: false, replace: true })
  }

  // Group agenda items by ISO day of week (1 = Monday … 7 = Sunday)
  const groupedDays = useMemo(() => {
    const map: Map<number, AgendaItem[]> = new Map()
    for (let d = 1; d <= 7; d++) map.set(d, [])

    for (const item of agendas) {
      const dt = DateTime.fromISO(item.day)
      const dow = dt.weekday // 1–7
      map.get(dow)?.push(item)
    }

    return Array.from(map.entries()).map(([dow, items]) => {
      const date = weekStart.plus({ days: dow - 1 })
      return {
        dow,
        dayName: DAY_NAMES_FR[dow],
        formattedDate: date.toFormat('dd LLLL'),
        isToday: date.hasSame(DateTime.now(), 'day'),
        events: items,
      }
    })
  }, [agendas, weekStart])

  const hasAnyEvent = agendas.length > 0

  return (
    <>
      <Head title="Agenda des Cultes - Phila Maison de Témoignages">
        <meta name="description" content="Consultez l'agenda et le programme de nos cultes, réunions de prière hebdomadaires et célébrations spéciales à la Phila Maison de Témoignages." />
      </Head>

      <main className="min-h-screen bg-background-off pb-20">
        {/* Hero Section */}
        <div className="relative h-[40vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/mdt-banner.jpg"
              alt="Agenda Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
          </div>

          <div className="relative z-10 space-y-6 max-w-4xl px-4">
            <span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-bold">
              Programme Hebdomadaire
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white leading-tight">
              L'Agenda de <br /> Notre Église
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Planifiez votre semaine spirituelle et ne manquez aucun rendez-vous avec la présence de Dieu.
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
                  <h2 className="text-3xl font-black font-serif text-slate-900 leading-tight">Semaine en cours</h2>
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

            {/* Day rows */}
            {!hasAnyEvent ? (
              <div className="text-center py-20 space-y-4">
                <CalendarDays size={52} className="mx-auto text-slate-300" />
                <p className="text-2xl font-black font-serif text-slate-400">Aucun événement cette semaine</p>
                <p className="text-slate-400">
                  Essayez une autre semaine ou revenez bientôt.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {groupedDays.map((dayGroup) => {
                  if (dayGroup.events.length === 0) return null
                  return (
                    <div key={dayGroup.dow} className="grid lg:grid-cols-12 gap-8 items-start group">
                      {/* Day label */}
                      <div className="lg:col-span-3">
                        <div className={`sticky top-28 p-6 rounded-3xl transition-all border ${dayGroup.isToday ? 'bg-primary/5 border-primary/20 ring-4 ring-primary/5' : 'bg-slate-50 border-transparent group-hover:bg-slate-100'}`}>
                          <h3 className="text-2xl font-black text-slate-900 font-serif mb-1">{dayGroup.dayName}</h3>
                          <p className={`text-sm font-bold tracking-tight mb-4 ${dayGroup.isToday ? 'text-primary' : 'text-slate-400'}`}>
                            {dayGroup.formattedDate}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <span className={`w-2 h-2 rounded-full ${dayGroup.isToday ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                            {dayGroup.events.length} Activité{dayGroup.events.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Events */}
                      <div className="lg:col-span-9 space-y-6">
                        {dayGroup.events.map((ev) => {
                          const catName = ev.catActivity?.name ?? 'Autre'
                          const color = getCategoryColor(catName)
                          return (
                            <div
                              key={ev.id}
                              className="p-8 rounded-[32px] border border-slate-100 hover:border-primary/20 bg-white transition-all shadow-sm hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 group/card"
                            >
                              <div className="flex gap-6 items-start md:items-center">
                                <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                                  <Clock size={24} />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-100 text-slate-500 group-hover/card:bg-primary/10 group-hover/card:text-primary transition-colors">
                                      {catName}
                                    </span>
                                    {dayGroup.isToday && (
                                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                        Aujourd'hui
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-xl md:text-2xl font-black text-slate-900 group-hover/card:text-primary transition-colors">
                                    {ev.title}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex flex-col md:items-end gap-3 shrink-0">
                                {(ev.hourStart || ev.hourEnd) && (
                                  <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                                    <Clock size={18} className="text-primary" />
                                    {[ev.hourStart, ev.hourEnd].filter(Boolean).join(' - ')}
                                  </div>
                                )}
                                {ev.place && (
                                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <MapPin size={16} className="text-primary/60" />
                                    {ev.place}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
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
