import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Calendar, MapPin, Clock, Share2, MessageCircle } from 'lucide-react'

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
  event: Event
}

export default function DetailEvenement({ event }: Props) {
  const statusLabels = {
    ongoing: { label: 'En cours', color: 'bg-green-500' },
    upcoming: { label: 'À venir', color: 'bg-primary' },
    past: { label: 'Passé', color: 'bg-slate-400' }
  }

  return (
    <>
      <Head title={`${event.title} - Phila Maison de Témoignages`}>
        <meta name="description" content={event.description ? event.description.slice(0, 160) : `Détails de l'événement "${event.title}" organisé par la Phila Maison de Témoignages.`} />
      </Head>
      
      <main className="bg-white min-h-screen">
        {/* Banner Section */}
        <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
            <div className="max-w-5xl mx-auto space-y-6">
              <Link 
                href="/evenements" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-bold group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Retour à l'agenda
              </Link>
              
              <div className="space-y-4">
                <span className={`${statusLabels[event.status].color} text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest inline-block shadow-lg`}>
                  {statusLabels[event.status].label}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black font-serif text-white leading-tight max-w-4xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* content Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-12">
              <div className="prose prose-slate prose-lg max-w-none">
                <h2 className="text-2xl md:text-4xl font-black font-serif text-slate-900 mb-8 pb-4 border-b border-slate-100">
                  Détails de l'événement
                </h2>
                <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-8">
                  {event.description}
                </p>
                <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {event.content}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-6 pt-10 border-t border-slate-100">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Partager</span>
                <div className="flex gap-4">
                  {[Share2, MessageCircle].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
                <div className="space-y-8">
                   <h3 className="text-2xl font-bold font-serif text-slate-900 border-b pb-4 border-slate-200">
                      Infos Pratiques
                   </h3>
                   
                   <SidebarItem 
                      icon={<Calendar size={22} />} 
                      title="Date" 
                      desc={event.date.split('à')[0]}
                   />
                   <SidebarItem 
                      icon={<Clock size={22} />} 
                      title="Heure" 
                      desc={event.date.split('à')[1] || "Toute la journée"}
                   />
                   <SidebarItem 
                      icon={<MapPin size={22} />} 
                      title="Lieu" 
                      desc={event.location}
                   />
                </div>

                <div className="space-y-4 pt-6">
                   <Link 
                      href="/contact" 
                      className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-light transition-all flex items-center justify-center gap-2 group"
                   >
                      Nous Contacter
                      <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
                   </Link>
                   <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
                      Entrée libre selon disponibilité
                   </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder Section */}
        {/* <section className="bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-5xl mx-auto py-20 px-6 space-y-10">
             <div className="flex justify-between items-end">
                <div className="space-y-2">
                   <h2 className="text-3xl font-bold font-serif">S'y rendre</h2>
                   <p className="text-slate-500">Localisez le lieu de l'événement sur la carte.</p>
                </div>
                <button className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">Calculer l'itinéraire</button>
             </div>
             <div className="h-96 rounded-[40px] bg-slate-200 shadow-inner flex items-center justify-center text-slate-400 italic">
                <MapPin size={48} className="text-slate-300 mr-4" />
                Plan interactif indisponible
             </div>
          </div>
        </section> */}
      </main>
    </>
  )
}

function SidebarItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-2xl bg-white text-primary shadow-sm flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-lg font-bold text-slate-900 leading-tight">{desc}</p>
      </div>
    </div>
  )
}
