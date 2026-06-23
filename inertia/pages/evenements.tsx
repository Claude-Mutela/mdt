import { Head, Link } from '@inertiajs/react'
import { Calendar, MapPin, ArrowRight, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Get unique categories (tags)
  const categories = useMemo(() => {
    const tags = events.map(e => e.tag)
    return ['all', ...new Set(tags)]
  }, [events])

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.tag === selectedCategory)

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1)
  }

  return (
    <>
      <Head title="Événements - Phila Maison de Témoignages" />
      
      <main className="min-h-screen bg-background-off">
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
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-primary-dark/40 to-slate-900/90" />
          </div>
          
          <div className="relative z-10 max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* <span className="inline-block bg-primary/20 backdrop-blur-md text-white border border-primary/30 text-xs uppercase tracking-widest px-4 py-2 rounded-full font-bold">
              Agenda de l'Église
            </span> */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-white leading-tight">
              Nos Événements &<br /> Rassemblements
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Retrouvez tous les moments forts de notre communauté. Rejoignez-nous pour grandir ensemble.
            </p>
          </div>
        </section>

        {/* Filters & Grid */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
          
          {/* Select Category Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black font-serif text-slate-900">À la une</h2>
              <p className="text-slate-500 mt-2">Découvrez ce qui se passe à la MDT.</p>
            </div>

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                <Filter size={18} />
              </div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full pl-12 pr-10 py-4 appearance-none rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {paginatedEvents.map((event, i) => (
              <div 
                key={i} 
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                {/* Image & Badge */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-md">
                      {event.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium mb-4">
                    <Calendar size={16} className="text-primary" />
                    <span>{event.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link 
                      href={`/evenements/${event.slug}`} 
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-light hover:gap-3 transition-all"
                    >
                      En savoir plus
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-3">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 rounded-xl bg-white text-slate-600 font-bold text-sm disabled:opacity-50 hover:bg-slate-50 hover:text-primary transition-all border border-slate-200 shadow-sm"
              >
                Précédent
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                      currentPage === i + 1 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 rounded-xl bg-white text-slate-600 font-bold text-sm disabled:opacity-50 hover:bg-slate-50 hover:text-primary transition-all border border-slate-200 shadow-sm"
              >
                Suivant
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="py-24 text-center space-y-5 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
                <Calendar size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Aucun événement dans cette catégorie</h3>
                <p className="text-slate-500 mt-2">Essayez de sélectionner une autre catégorie ou revenez plus tard.</p>
              </div>
              <button 
                onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                className="inline-block mt-4 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-primary hover:text-primary transition-all"
              >
                Voir tous les événements
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
