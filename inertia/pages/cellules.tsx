import { Head, Link } from '@inertiajs/react'
import { MapPin, Clock, Phone, Users, ArrowRight, User } from 'lucide-react'

interface CelluleItem {
  id: number
  nom: string
  description: string
  horaire: string
  adresse: string
  telephone: string
  responsable: string | null
}

interface Props {
  cellules: CelluleItem[]
}

const TAG_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-amber-500',
]

export default function Cellules({ cellules = [] }: Props) {
  return (
    <>
      <Head title="Nos Cellules de Maison — Phila MDT" />
      <main className="bg-background-off min-h-screen">
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-[#1C1613] to-black/90" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Users size={14} />
              Communion Fraternelle
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif mb-6 leading-[1.1]">
              Nos <span className="text-accent-orange italic">Cellules</span> de Maison
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Rejoignez une famille spirituelle près de chez vous. Priez, partagez la Parole de Dieu et grandissez ensemble dans la foi.
            </p>
          </div>
        </section>

        {/* ── Grid Section ── */}
        <section className="py-20 relative -mt-10 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {cellules.length === 0 ? (
              <div className="text-center py-24 text-slate-500">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-xl font-semibold">Aucune cellule disponible pour le moment.</p>
                <p className="text-sm mt-2">Revenez bientôt ou contactez-nous pour plus d'informations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cellules.map((cellule, index) => (
                  <div
                    key={cellule.id}
                    className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    <div className="p-8 flex-grow space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors leading-tight">
                          {cellule.nom}
                        </h3>
                        <span className={`w-3 h-3 rounded-full shrink-0 mt-2 ${TAG_COLORS[index % TAG_COLORS.length]}`} />
                      </div>

                      {cellule.description && (
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {cellule.description}
                        </p>
                      )}

                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        {cellule.horaire && (
                          <div className="flex gap-3">
                            <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Horaire</p>
                              <p className="text-slate-900 font-medium text-sm">{cellule.horaire}</p>
                            </div>
                          </div>
                        )}

                        {cellule.adresse && (
                          <div className="flex gap-3">
                            <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Adresse</p>
                              <p className="text-slate-900 font-medium text-sm">{cellule.adresse}</p>
                            </div>
                          </div>
                        )}

                        {cellule.telephone && (
                          <div className="flex gap-3">
                            <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                              <p className="text-slate-900 font-medium text-sm">{cellule.telephone}</p>
                            </div>
                          </div>
                        )}

                        {cellule.responsable && (
                          <div className="flex gap-3">
                            <User size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Responsable</p>
                              <p className="text-slate-900 font-medium text-sm">{cellule.responsable}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary group-hover:border-primary transition-colors duration-300"
                    >
                      <span className="text-sm font-bold text-slate-500 group-hover:text-white/90 transition-colors">
                        Rejoindre cette cellule
                      </span>
                      <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* ── Contact CTA ── */}
            <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-slate-100 max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-black font-serif text-slate-900 mb-4">
                Vous ne trouvez pas de cellule dans votre quartier ?
              </h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Contactez notre secrétariat pour être orienté vers la cellule la plus proche, ou découvrez comment ouvrir une nouvelle cellule chez vous.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-md"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
