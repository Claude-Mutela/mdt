import { Head } from '@inertiajs/react'
import { Phone, Mail, Clock } from 'lucide-react'
const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

export default function IntercessionPriere() {
  return (
    <>
      <Head title="Demande de Prière — Phila MDT">
        <meta
          name="description"
          content="Soumettez votre demande de prière à l'équipe d'intercession de la Phila Maison de Témoignages. Nous prions avec vous."
        />
      </Head>
      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-[#1C1613] to-black/90" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              Allô Prière MDT
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif mb-6 leading-[1.1]">
              Partagez votre <span className="text-accent-orange italic">Sujet de Prière</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              « Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. » Nos
              équipes d'intercesseurs se relaient 24h/24 pour porter vos fardeaux devant le
              Seigneur.
            </p>
          </div>
        </section>

        {/* ── Content & Form Section ── */}
        <section className="py-20 bg-background-off relative -mt-10 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:flex-row gap-12">
              {/* Infos d'Intercession (5 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 text-primary">
                    <Clock size={28} className="text-accent-orange" />
                    <h3 className="text-2xl font-bold font-serif text-slate-900">
                      Une Intercession Continue
                    </h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Le ministère d'Intercession & Prière de la Maison de Témoignages fonctionne sans
                    interruption pour vous soutenir dans :
                  </p>
                  <ul className="space-y-3 text-lg text-slate-600">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent-orange shrink-0" />
                      <span>Les défis de santé et requêtes de guérison.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent-orange shrink-0" />
                      <span>La restauration des foyers et des familles.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent-orange shrink-0" />
                      <span>La percée professionnelle, financière et académique.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent-orange shrink-0" />
                      <span>Le combat spirituel et la délivrance des captifs.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 text-primary">
                    <Phone size={28} className="text-accent-orange" />
                    <h3 className="text-2xl font-bold font-serif text-slate-900">Allô Prière</h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Vous souhaitez parler directement à un intercesseur ou pasteur de garde ?
                    Appelez-nous ou envoyez un message :
                  </p>
                  <div className="space-y-3 pt-2">
                    <a
                      href="tel:+243810004488"
                      className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Phone size={16} />
                      </div>
                      +243 810 004 488
                    </a>
                    <a
                      href="https://wa.me/+243810004488"
                      target="_blank"
                      className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <WhatsAppIcon size={16} />
                      </div>
                      +243 810 004 488
                    </a>
                    <a
                      href="mailto:min_priere@philamdt.church"
                      className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm"
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Mail size={16} />
                      </div>
                      min_priere@philamdt.church
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
