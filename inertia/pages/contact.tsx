import { Head, useForm } from '@inertiajs/react'
import { MapPin, Phone, Clock, Send, ExternalLink, AlertCircle, CheckCircle2, User, Mail, MessageSquare, Tag } from 'lucide-react'
import { useState } from 'react'

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Affiche un message d'erreur sous un champ */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 ml-0.5 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  )
}

/** Classes CSS d'un champ selon son état d'erreur */
function inputClass(hasError?: string) {
  return `w-full bg-slate-50 border ${
    hasError
      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
  } text-slate-900 text-sm rounded-xl block px-4 py-3.5 outline-none transition-all shadow-sm`
}

/* ── Composant principal ─────────────────────────────────────────── */

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { data, setData, post, processing, errors, reset, hasErrors } = useForm({
    name: '',
    email: '',
    subject: "Demande d'information",
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/contact', {
      onSuccess: () => {
        setIsSubmitted(true)
        reset()
      },
    })
  }

  return (
    <>
      <Head title="Contactez-nous — Phila MDT" />
      <div className="bg-background-off min-h-screen animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">

          {/* ── En-tête ── */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-slate-900 text-4xl md:text-6xl font-black font-serif">Contactez-nous</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Nous sommes là pour vous. Que ce soit pour une demande d'information, un témoignage ou un sujet de prière, n'hésitez pas à nous écrire.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

            {/* ── Formulaire ── */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">

                {isSubmitted ? (
                  /* ── État de succès ── */
                  <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Message envoyé !</h2>
                    <p className="text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
                      Votre message a bien été reçu. Nous vous avons envoyé un accusé de réception et reviendrons vers vous très prochainement.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  /* ── Formulaire de saisie ── */
                  <>
                    <h3 className="text-2xl font-bold font-serif mb-2">Envoyez-nous un message</h3>
                    <p className="text-slate-500 text-sm mb-8">Tous les champs sont obligatoires.</p>

                    {/* Bannière d'erreur globale */}
                    {hasErrors && (
                      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm font-semibold">
                          Veuillez corriger les erreurs ci-dessous avant d'envoyer.
                        </p>
                      </div>
                    )}

                    <form id="contact-form" onSubmit={handleSubmit} className="space-y-6" noValidate>

                      {/* Nom complet */}
                      <div>
                        <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                          <User size={14} className="text-primary" /> Nom complet
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Votre nom et prénom"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className={inputClass(errors.name)}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        />
                        <FieldError message={errors.name} />
                      </div>

                      {/* Adresse Email */}
                      <div>
                        <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Mail size={14} className="text-primary" /> Adresse Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="nom@exemple.com"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className={inputClass(errors.email)}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        />
                        <FieldError message={errors.email} />
                      </div>

                      {/* Sujet */}
                      <div>
                        <label htmlFor="contact-subject" className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Tag size={14} className="text-primary" /> Objet
                        </label>
                        <select
                          id="contact-subject"
                          value={data.subject}
                          onChange={(e) => setData('subject', e.target.value)}
                          className={inputClass(errors.subject) + ' appearance-none cursor-pointer'}
                        >
                          <option value="Demande d'information">Demande d'information</option>
                          <option value="Sujet de prière">Sujet de prière</option>
                          <option value="Témoignage">Témoignage</option>
                          <option value="Autre">Autre</option>
                        </select>
                        <FieldError message={errors.subject} />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                          <MessageSquare size={14} className="text-primary" /> Message
                        </label>
                        <textarea
                          id="contact-message"
                          placeholder="Comment pouvons-nous vous aider ?"
                          rows={6}
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          className={inputClass(errors.message) + ' resize-none'}
                          aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        />
                        {/* Compteur de caractères */}
                        <div className="flex justify-between items-center mt-1">
                          <FieldError message={errors.message} />
                          <span className={`text-xs ml-auto ${data.message.length > 1800 ? 'text-red-500' : 'text-slate-400'}`}>
                            {data.message.length} / 2000
                          </span>
                        </div>
                      </div>

                      {/* Bouton d'envoi */}
                      <button
                        type="submit"
                        id="contact-submit"
                        disabled={processing}
                        className="w-full md:w-auto h-14 px-10 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer
                            <Send size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* ── Coordonnées ── */}
            <div className="lg:col-span-5 space-y-8">
              <h3 className="text-2xl font-bold font-serif">Nos Coordonnées</h3>

              <DetailItem
                icon={<MapPin size={24} />}
                title="Adresse"
                desc="Zoao N°25, Q/ Matonge 1, Blvd Sendwe / Entrée hôtel Sendwe, Kinshasa-RD Congo. BP: 6270"
              />
              <DetailItem
                icon={<Phone size={24} />}
                title="Contact Direct"
                desc="+243 9 999 51 032"
                sub="contact@philamdt.chrurch"
              />
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Clock size={24} />
                  <h4 className="font-bold font-serif text-lg">Horaires des cultes</h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between text-sm pb-2 border-b border-slate-50">
                    <span className="font-medium text-slate-500">Dimanche:</span>
                    <span className="font-bold text-slate-900">8h00 - Culte Dominical</span>
                  </li>
                  <li className="flex justify-between text-sm pb-2 border-b border-slate-50">
                    <span className="font-medium text-slate-500">Mardi:</span>
                    <span className="font-bold text-slate-900">17h30 - Enseignement</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="font-medium text-slate-500">Jeudi:</span>
                    <span className="font-bold text-slate-900">17h30 - Intercession</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Carte Interactive ── */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold font-serif mb-8">Nous trouver</h3>
            <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-slate-100">
              <iframe
                src="https://maps.google.com/maps?q=Phila%20Maison%20de%20Temoignages,%20Kinshasa&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Phila Maison de Témoignages"
              />
              <a
                href="https://maps.google.com/maps?q=Phila+Maison+de+Temoignages,+Kinshasa"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 left-4 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-2xl max-w-xs md:max-w-sm border border-slate-100 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-xl animate-bounce shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-black text-lg md:text-xl font-serif text-slate-900 leading-tight">Eglise Phila MDT</p>
                  <p className="text-xs md:text-sm font-medium text-primary mt-0.5">Ouvrir dans Google Maps</p>
                </div>
                <ExternalLink size={18} className="text-slate-300 ml-auto shrink-0 hidden md:block" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

/* ── Sous-composants ─────────────────────────────────────────────── */

const DetailItem = ({ icon, title, desc, sub }: { icon: React.ReactNode; title: string; desc: string; sub?: string }) => (
  <div className="flex items-start gap-6 p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="font-bold font-serif text-lg">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      {sub && <p className="text-primary font-bold text-sm hover:underline cursor-pointer pt-1">{sub}</p>}
    </div>
  </div>
)

export default Contact
