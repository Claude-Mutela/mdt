import  { useState, useMemo } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Clock, MapPin, ArrowRight, Heart, Bell, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { DateTime } from 'luxon'

const appointments = [
  {
    day: "Lundi",
    dayNum: 1,
    events: [
      { 
        title: "Intercession Matinale", 
        time: "06:00 - 07:00", 
        location: "Temple & En ligne", 
        tag: "Prière",
        color: "bg-blue-500"
      }
    ]
  },
  {
    day: "Mardi",
    dayNum: 2,
    events: [
      { 
        title: "Mardi Malakisi", 
        time: "17:30 - 19:30", 
        location: "Temple & Live YouTube", 
        tag: "Enseignement",
        color: "bg-primary",
        highlight: true
      }
    ]
  },
  {
    day: "Mercredi",
    dayNum: 3,
    events: [
      { 
        title: "Réunion des Couples", 
        time: "18:00 - 19:30", 
        location: "Salle des Fêtes", 
        tag: "Famille",
        color: "bg-pink-500"
      }
    ]
  },
  {
    day: "Jeudi",
    dayNum: 4,
    events: [
      { 
        title: "Jeudi Etoko", 
        time: "17:30 - 19:30", 
        location: "Temple & Live YouTube", 
        tag: "Intercession",
        color: "bg-orange-600",
        highlight: true
      }
    ]
  },
  {
    day: "Vendredi",
    dayNum: 5,
    events: [
      { 
        title: "Génération PHILA", 
        time: "17:30 - 19:30", 
        location: "Salle annexe", 
        tag: "Jeunesse",
        color: "bg-purple-600"
      }
    ]
  },
  {
    day: "Samedi",
    dayNum: 6,
    events: [
      { 
        title: "Répétition Chorale", 
        time: "15:00 - 18:00", 
        location: "Temple", 
        tag: "Musique",
        color: "bg-slate-700"
      },
      { 
        title: "Évangélisation de Rue", 
        time: "10:00 - 12:00", 
        location: "Quartier Matonge", 
        tag: "Mission",
        color: "bg-green-600"
      }
    ]
  },
  {
    day: "Dimanche",
    dayNum: 7,
    events: [
      { 
        title: "Culte Dominical", 
        time: "08:00 - 10:00", 
        location: "Temple PHILA MDT", 
        tag: "Célébration",
        color: "bg-primary",
        highlight: true
      },
      { 
        title: "École du Dimanche", 
        time: "08:30 - 09:30", 
        location: "Espace Enfants", 
        tag: "Enfants",
        color: "bg-yellow-500"
      }
    ]
  }
]

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(DateTime.now().setLocale('fr'))

  const weekInfo = useMemo(() => {
    const startOfWeek = currentDate.startOf('week')
    const endOfWeek = currentDate.endOf('week')
    
    // Generate dates for each day of this week
    const weekDays = appointments.map(app => {
      const date = startOfWeek.plus({ days: app.dayNum - 1 })
      return {
        ...app,
        formattedDate: date.toFormat('dd LLLL'),
        isToday: date.hasSame(DateTime.now(), 'day')
      }
    })

    return {
      range: `Du ${startOfWeek.toFormat('dd')} au ${endOfWeek.toFormat('dd LLLL yyyy')}`,
      days: weekDays
    }
  }, [currentDate])

  const nextWeek = () => setCurrentDate(prev => prev.plus({ weeks: 1 }))
  const prevWeek = () => setCurrentDate(prev => prev.minus({ weeks: 1 }))
  const resetToToday = () => setCurrentDate(DateTime.now().setLocale('fr'))

  return (
    <>
      <Head title="Agenda des Cultes - Phila Maison de Témoignages" />
      
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
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black font-serif text-slate-900 leading-tight">Semaine en cours</h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                    {currentDate.year}
                  </span>
                </div>
                <p className="text-slate-500 font-bold text-xl">{weekInfo.range}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                  <button 
                    onClick={prevWeek}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={resetToToday}
                    className="px-6 flex items-center justify-center gap-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-800 font-bold text-sm transition-all"
                  >
                    <RotateCcw size={16} className="text-primary" />
                    Aujourd'hui
                  </button>
                  <button 
                    onClick={nextWeek}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-slate-600 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <button className="flex lg:hidden items-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20">
                  <Bell size={18} />
                  M'alerter
                </button>
              </div>
            </div>

            <div className="space-y-12">
              {weekInfo.days.map((dayGroup, idx) => (
                <div key={idx} className="grid lg:grid-cols-12 gap-8 items-start group">
                  <div className="lg:col-span-3">
                    <div className={`sticky top-28 p-6 rounded-3xl transition-all border ${dayGroup.isToday ? 'bg-primary/5 border-primary/20 ring-4 ring-primary/5' : 'bg-slate-50 border-transparent group-hover:bg-slate-100'}`}>
                      <h3 className="text-2xl font-black text-slate-900 font-serif mb-1">{dayGroup.day}</h3>
                      <p className={`text-sm font-bold tracking-tight mb-4 ${dayGroup.isToday ? 'text-primary' : 'text-slate-400'}`}>
                        {dayGroup.formattedDate}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <span className={`w-2 h-2 rounded-full ${dayGroup.isToday ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                        {dayGroup.events.length} Activité{dayGroup.events.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-9 space-y-6">
                    {dayGroup.events.map((ev, i) => (
                      <div 
                        key={i} 
                        className={`p-8 rounded-[32px] border ${ev.highlight ? 'border-primary ring-4 ring-primary/5 bg-primary/5' : 'border-slate-100 hover:border-primary/20 bg-white'} transition-all shadow-sm hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8 group/card`}
                      >
                        <div className="flex gap-6 items-start md:items-center">
                          <div className={`w-14 h-14 rounded-2xl ${ev.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                             <Clock size={24} />
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-3">
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${ev.highlight ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover/card:bg-primary/10 group-hover/card:text-primary transition-colors'}`}>
                                 {ev.tag}
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
                          <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                             <Clock size={18} className="text-primary" />
                             {ev.time}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                             <MapPin size={16} className="text-primary/60" />
                             {ev.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        {/* <section className="max-w-4xl mx-auto px-4 mt-20 text-center space-y-10">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto text-primary border border-slate-100">
             <Heart size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black font-serif text-slate-900">Une place vous est réservée</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Quel que soit votre programme, notre porte est toujours ouverte. Rejoignez-nous pour bâtir ensemble une vie de témoignages.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-primary text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-light transform hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              Plus d'infos
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/evenements" 
              className="bg-white border border-slate-200 text-slate-600 font-bold h-14 px-10 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              Événements spéciaux
            </Link>
          </div>
        </section> */}
      </main>
    </>
  )
}
