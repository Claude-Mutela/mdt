import { Head } from '@inertiajs/react'
import { Phone, Mail, CheckCircle2, MessageSquare, ShieldCheck, Clock, Sparkles, Send, Heart } from 'lucide-react'
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
      <Head title="Demande de Prière — Phila MDT" />
      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-[#1C1613] to-black/90" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles size={14} />
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
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Infos d'Intercession (5 Cols) */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 text-primary">
                    <Clock size={28} className="text-accent-orange" />
                    <h3 className="text-xl font-bold font-serif text-slate-900">Une Intercession Continue</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Le ministère d'Intercession & Prière de la Maison de Témoignages fonctionne sans interruption pour vous soutenir dans :
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600">
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
                    <h3 className="text-xl font-bold font-serif text-slate-900">Allô Prière Direct</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Vous souhaitez parler directement à un intercesseur ou pasteur de garde ? Appelez-nous ou envoyez un message :
                  </p>
                  <div className="space-y-3 pt-2">
                    <a href="tel:+243970000001" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Phone size={16} />
                      </div>
                      +243 97 000 0001
                    </a>
                    <a href="tel:+243820000002" className="flex items-center gap-3 text-slate-700 hover:text-primary transition-colors font-bold text-sm">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                        <Phone size={16} />
                      </div>
                      +243 82 000 0002
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

              {/* Formulaire de Prière (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">
                  {isSubmitted ? (
                    <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Sujet de prière reçu !</h2>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed text-sm">
                        Votre demande de prière a été transmise à notre équipe d'intercesseurs. Nous prions avec foi pour votre situation. Que le Seigneur vous visite puissamment.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={handleWhatsAppSubmit}
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                        >
                          Envoyer aussi sur WhatsApp
                        </button>
                        <button 
                          onClick={() => {
                            setFormData({ nom: '', telephone: '', email: '', sujet: '', message: '', confidentiel: false })
                            setIsSubmitted(false)
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all text-sm"
                        >
                          Nouvelle demande
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Remplir ma demande de prière</h2>
                        <p className="text-slate-500 text-xs">Les champs marqués d'une étoile (*) sont obligatoires.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Nom */}
                          <div className="space-y-2">
                            <label htmlFor="nom" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              Nom complet *
                            </label>
                            <input 
                              type="text" 
                              id="nom" 
                              required
                              value={formData.nom}
                              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm"
                              placeholder="Votre nom ou Anonyme"
                            />
                          </div>
                          
                          {/* Téléphone */}
                          <div className="space-y-2">
                            <label htmlFor="telephone" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              Téléphone *
                            </label>
                            <input 
                              type="tel" 
                              id="telephone" 
                              required
                              value={formData.telephone}
                              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm"
                              placeholder="Ex: +243..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Email */}
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              Email <span className="text-slate-400 font-normal">(Optionnel)</span>
                            </label>
                            <input 
                              type="email" 
                              id="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm"
                              placeholder="votre@email.com"
                            />
                          </div>

                          {/* Sujet de Prière */}
                          <div className="space-y-2">
                            <label htmlFor="sujet" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              Sujet Principal *
                            </label>
                            <select 
                              id="sujet" 
                              required
                              value={formData.sujet}
                              onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm appearance-none"
                            >
                              <option value="">Sélectionnez un sujet</option>
                              <option value="Action de grâce">Action de Grâce</option>
                              <option value="Santé / Guérison">Santé / Guérison</option>
                              <option value="Famille / Mariage">Famille / Mariage</option>
                              <option value="Travail / Finances">Travail / Finances</option>
                              <option value="Combat spirituel / Délivrance">Combat spirituel / Délivrance</option>
                              <option value="Autre">Autre</option>
                            </select>
                          </div>
                        </div>

                        {/* Message / Sujet détaillé */}
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            Votre sujet détaillé *
                          </label>
                          <textarea 
                            id="message" 
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block p-4 outline-none transition-all shadow-sm resize-none"
                            placeholder="Décrivez votre sujet de prière pour que nous puissions cibler notre intercession..."
                          />
                        </div>

                        {/* Confidentialité */}
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <input 
                            type="checkbox" 
                            id="confidentiel"
                            checked={formData.confidentiel}
                            onChange={(e) => setFormData({ ...formData, confidentiel: e.target.checked })}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <div className="space-y-1">
                            <label htmlFor="confidentiel" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                              <ShieldCheck size={14} className="text-primary" /> Demande strictement confidentielle
                            </label>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              En cochant cette case, votre sujet sera partagé uniquement avec les pasteurs et l'équipe d'intercession restreinte, sans mentionner votre nom en public.
                            </p>
                          </div>
                        </div>

                        {/* Bouton de soumission */}
                        <div className="pt-4">
                          <button 
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white text-base font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                          >
                            <Send size={16} />
                            Envoyer ma demande de prière
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  )
}
