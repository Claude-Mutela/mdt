import { Head, Link } from '@inertiajs/react'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface Event {
  title: string
  slug: string
  status: 'ongoing' | 'upcoming' | 'past'
  date: string
  location: string
  description: string
  content: string
  tag: string
  image: string
}

interface Props {
  events: Event[]
}

export default function Evenements({ events }: Props) {
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'past'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter)

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  const statusLabels = {
    ongoing: { label: 'En cours', color: 'bg-green-500' },
    upcoming: { label: 'À venir', color: 'bg-primary' },
    past: { label: 'Passé', color: 'bg-slate-400' }
  }

  const handleFilterChange = (f: 'all' | 'ongoing' | 'upcoming' | 'past') => {
    setFilter(f)
    setCurrentPage(1)
  }

  return (
    <>
      <Head title="Événements - Phila Maison de Témoignages" />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <video
               autoPlay
               muted
               loop
               playsInline
               poster="/mdt-banner.jpg"
               className="w-full h-full object-cover transform scale-105 transition-transform duration-1000"
             >
               <source src="/MARDI MALAKISI _ La connaissance qui libère.mp4" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
          </div>
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase tracking-widest px-4 py-2 rounded-full font-bold">
              Agenda de l'Église
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white leading-tight">
              Nos Événements &<br /> Rassemblements
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              Retrouvez tous les moments forts de notre communauté. Rejoignez-nous pour grandir ensemble.
            </p>
          </div>
        </section>

        {/* Filters & Grid */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
          {/* Tabs Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {(['all', 'ongoing', 'upcoming', 'past'] as const).map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
                  filter === f 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'ongoing' ? 'En cours' : f === 'upcoming' ? 'À venir' : 'Passés'}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {paginatedEvents.map((event, i) => (
              <Link 
                key={i} 
                href={`/evenements/${event.slug}`} 
                className="group flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Image & Badge */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6">
                    <span className={`${statusLabels[event.status].color} text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg`}>
                      {statusLabels[event.status].label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest">
                    <span>{event.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-slate-400">{event.date.split('à')[0]}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold font-serif text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <MapPin size={14} className="text-primary" />
                      <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold disabled:opacity-50 hover:bg-slate-100 transition-all border border-slate-100"
              >
                Précédent
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold disabled:opacity-50 hover:bg-slate-100 transition-all border border-slate-100"
              >
                Suivant
              </button>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Aucun événement trouvé</h3>
              <p className="text-slate-500">Revenez bientôt pour de nouvelles annonces.</p>
            </div>
          )}
        </section>

        {/* CTA final */}
        {/* <section className="py-24 bg-background-off border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black font-serif text-slate-900 leading-tight">
              Vous avez un événement spécifique à proposer ?
            </h2>
            <p className="text-slate-500 text-lg">
              S'il s'agit d'un ministère, d'un baptême ou d'une célébration, notre équipe est à votre écoute pour vous accompagner.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-3 bg-primary text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-light transform hover:-translate-y-1 transition-all"
            >
              Contactez le secrétariat
              <ArrowRight size={20} />
            </Link>
          </div>
        </section> */}
      </main>
    </>
  )
}
