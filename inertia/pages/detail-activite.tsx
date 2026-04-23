import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Calendar, MessageCircle, MapPin } from 'lucide-react'

interface Activity {
  name: string
  slug: string
  tag: string
  desc: string
  content: string
  img: string
  color: string
}

interface Props {
  activity: Activity
}

export default function DetailActivite({ activity }: Props) {
  return (
    <>
      <Head title={`${activity.name} - MDT`} />
      
      <main className="bg-white min-h-screen">
        {/* Banner / Hero */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img 
            src={activity.img} 
            alt={activity.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-4">
              <Link 
                href="/activites" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-bold group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Retour aux activités
              </Link>
              
              <div className="space-y-2">
                <span className={`${activity.color} text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest inline-block`}>
                  {activity.tag}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-serif text-white leading-tight">
                  {activity.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black font-serif text-slate-900 border-b pb-4">
                  À propos du ministère
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {activity.content}
                </p>
                <p className="text-slate-500 italic">
                  {activity.desc}
                </p>
              </div>

              {/* Gallery / Visual Placeholder */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
                   <img src={activity.img} className="w-full h-full object-cover opacity-50 grayscale" alt="decoration" />
                </div>
                <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <Calendar size={48} />
                </div>
              </div>
            </div>

            {/* Sidebar / Info Card */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6 sticky top-24">
                <h3 className="text-xl font-bold font-serif text-slate-900">Infos Pratiques</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Fréquence</p>
                      <p className="text-slate-500 text-sm">Hebdomadaire</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Lieu</p>
                      <p className="text-slate-500 text-sm">Temple MDT (Kinshasa)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-4">
                    Vous souhaitez en savoir plus ou rejoindre ce ministère ?
                  </p>
                  <Link 
                    href="/contact" 
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white font-bold h-12 rounded-xl hover:bg-primary-light transition-all shadow-lg"
                  >
                    Nous contacter
                    <MessageCircle size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-slate-900 text-center px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-black font-serif text-white">
              Une place pour vous
            </h2>
            <p className="text-white/60">
              Chaque membre de la Maison de Témoignages est appelé à servir selon ses dons.
            </p>
            <Link 
              href="/activites" 
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all"
            >
              Découvrir d'autres ministères
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
