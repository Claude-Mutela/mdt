import { Head } from '@inertiajs/react'
import { Phone, Mail, CheckCircle2, MessageSquare, ShieldCheck, Clock, Sparkles, Send, Heart } from 'lucide-react'
import { FaWhatsapp } from "react-icons/fa";
import { useState } from 'react'

export default function IntercessionPriere() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    sujet: '',
    message: '',
    confidentiel: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi de la demande
    setIsSubmitted(true)
  }

  const handleWhatsAppSubmit = () => {
    const text = `Bonjour Phila MDT, je vous contacte pour une demande de prière.\n\n*Nom :* ${formData.nom || 'Anonyme'}\n*Téléphone :* ${formData.telephone || 'Non renseigné'}\n*Sujet :* ${formData.sujet || 'Sujet général'}\n*Message :* ${formData.message || 'Sujet non détaillé'}\n*Confidentiel :* ${formData.confidentiel ? 'Oui' : 'Non'}`
    const encodedText = encodeURIComponent(text)
    // Utilisation d'un numéro d'intercession fictif ou du numéro WhatsApp général
    window.open(`https://wa.me/243830200083?text=${encodedText}`, '_blank')
  }

  return (
    <>
      <Head title="Demande de Prière — Phila MDT">
        <meta name="description" content="Soumettez votre demande de prière à l'équipe d'intercession de la Phila Maison de Témoignages. Nous prions avec vous." />
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
              « Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. » Nos équipes d'intercesseurs se relaient 24h/24 pour porter vos fardeaux devant le Seigneur.
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
                    <h3 className="text-2xl font-bold font-serif text-slate-900">Une Intercession Continue</h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Le ministère d'Intercession & Prière de la Maison de Témoignages fonctionne sans interruption pour vous soutenir dans :
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
                    <h3 className="text-2xl font-bold font-serif text-slate-900">Allô Prière Direct</h3>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Vous souhaitez parler directement à un intercesseur ou pasteur de garde ? Appelez-nous ou envoyez un message :
                  </p>
                  <div className="space-y-3 pt-2">
                    <a href="tel:+243810004488" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Phone size={16} />
                      </div>
                      +243 810 004 488
                    </a>
                    <a href="https://wa.me/+243810004488" target='_blank' className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <FaWhatsapp size={16} />
                      </div>
                      +243 810 004 488
                    </a>
                    <a href="mailto:priere@philamdt.church" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Mail size={16} />
                      </div>
                      priere@philamdt.church
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
