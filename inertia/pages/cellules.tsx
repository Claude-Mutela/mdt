import { Head, Link } from '@inertiajs/react'
import { MapPin, Clock, Phone, Users, ArrowRight } from 'lucide-react'

const cellules = [
  {
    id: 1,
    nom: 'Cellule Kalamu Centrale',
    description: "Une cellule dynamique au cœur de Matonge. Nous nous réunissons pour partager la Parole dans la simplicité et prier pour nos familles.",
    horaire: "Chaque Mercredi, 18h00 - 19h30",
    adresse: "Quartier Matonge, Avenue Kanda-Kanda n°42, Kalamu",
    telephone: "+243 82 000 0001",
    tagColor: "bg-blue-500",
  },
  {
    id: 2,
    nom: 'Cellule Lemba Salongo',
    description: "Idéale pour les résidents de Lemba. Nos rencontres sont axées sur l'étude biblique approfondie et l'intercession en faveur de l'église.",
    horaire: "Chaque Vendredi, 17h30 - 19h00",
    adresse: "Quartier Salongo, Avenue de la Paix n°15, Lemba",
    telephone: "+243 82 000 0002",
    tagColor: "bg-green-500",
  },
  {
    id: 3,
    nom: 'Cellule Gombe Espérance',
    description: "Située en centre-ville, cette cellule accueille les professionnels après le travail pour un temps de ressourcement spirituel.",
    horaire: "Chaque Jeudi, 18h30 - 20h00",
    adresse: "Avenue de la Justice n°120, Gombe",
    telephone: "+243 97 000 0003",
    tagColor: "bg-purple-500",
  },
  {
    id: 4,
    nom: 'Cellule Bandal Tshibangu',
    description: "Une communauté chaleureuse à Bandalungwa, très axée sur la louange, le témoignage et le soutien mutuel.",
    horaire: "Chaque Mardi, 18h00 - 19h30",
    adresse: "Avenue Tshibangu n°8, Bandalungwa",
    telephone: "+243 81 000 0004",
    tagColor: "bg-orange-500",
  },
  {
    id: 5,
    nom: 'Cellule Ngaliema',
    description: "Pour les résidents de Ma Campagne et environs. Une cellule familiale où petits et grands trouvent leur place dans la prière.",
    horaire: "Chaque Samedi, 16h00 - 17h30",
    adresse: "Avenue de la Montagne n°22, Ma Campagne, Ngaliema",
    telephone: "+243 85 000 0005",
    tagColor: "bg-rose-500",
  }
]

export default function Cellules() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cellules.map((cellule) => (
                <div 
                  key={cellule.id} 
                  className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="p-8 flex-grow space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors leading-tight">
                        {cellule.nom}
                      </h3>
                      <span className={`w-3 h-3 rounded-full shrink-0 mt-2 ${cellule.tagColor} shadow-sm shadow-${cellule.tagColor}/50`} />
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {cellule.description}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex gap-3">
                        <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Horaire</p>
                          <p className="text-slate-900 font-medium text-sm">{cellule.horaire}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Adresse</p>
                          <p className="text-slate-900 font-medium text-sm">{cellule.adresse}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                          <p className="text-slate-900 font-medium text-sm">{cellule.telephone}</p>
                        </div>
                      </div>
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
