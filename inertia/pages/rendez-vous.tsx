import { Head, useForm } from '@inertiajs/react'
import { CalendarDays, Clock, User, Phone, Mail, CheckCircle2, MessageSquare, Video, AlertCircle, ShieldCheck } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Types globaux reCAPTCHA ─────────────────────────────────────── */
declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement | string, params: object) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
      execute: (widgetId?: number) => void
    }
    onRecaptchaLoad: () => void
  }
}

/** Composant d'affichage d'erreur sous un champ */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 ml-0.5 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  )
}

/** Classe CSS d'un champ selon son état d'erreur */
function inputClass(hasError?: string) {
  return `w-full bg-slate-50 border ${hasError ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10'} text-slate-900 text-sm rounded-xl block px-4 py-3.5 outline-none transition-all shadow-sm`
}

export default function RendezVous({ recaptchaSiteKey = '' }: { recaptchaSiteKey?: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [motif, setMotif] = useState('')
  const [autreMotif, setAutreMotif] = useState('')

  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const scriptLoadedRef = useRef(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    reason: '',
    format: '',
    appointmentDate: '',
    appointmentTime: '',
    recaptchaToken: '',
  })

  // Synchronise le motif sélectionné et l'autre motif avec le champ "reason"
  useEffect(() => {
    if (motif === 'autre') {
      setData('reason', autreMotif)
    } else {
      setData('reason', motif)
    }
  }, [motif, autreMotif])

  /* ── Chargement dynamique du script reCAPTCHA ── */
  const renderWidget = useCallback(() => {
    if (!recaptchaContainerRef.current || !recaptchaSiteKey || widgetIdRef.current !== null) return

    widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
      sitekey: recaptchaSiteKey,
      callback: (token: string) => {
        setData('recaptchaToken', token)
      },
      'expired-callback': () => {
        setData('recaptchaToken', '')
      },
      'error-callback': () => {
        setData('recaptchaToken', '')
      },
      theme: 'light',
      size: 'normal',
    })
  }, [recaptchaSiteKey, setData])

  useEffect(() => {
    // Lorsque la modale de succès est affichée, le formulaire est démonté — rien à faire
    if (isSubmitted || !recaptchaSiteKey) return

    // Si le widget est déjà monté, ne pas le recréer
    if (widgetIdRef.current !== null) return

    // Le script Google est déjà chargé (page rechargée ou "Faire une autre demande")
    if (window.grecaptcha) {
      renderWidget()
      return
    }

    // Première visite : charger le script une seule fois
    if (scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    // Callback global appelé par l'API Google une fois le script prêt
    window.onRecaptchaLoad = renderWidget

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Nettoyage du callback global quand le composant est démonté
      delete (window as any).onRecaptchaLoad
    }
  }, [isSubmitted, recaptchaSiteKey, renderWidget])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/rendez-vous', {
      onSuccess: () => {
        setIsSubmitted(true)
        reset()
        setMotif('')
        setAutreMotif('')
        // Vider le widgetId : quand l'utilisateur clique "Faire une autre demande",
        // le div reCAPTCHA sera remonté vide et l'effect le re-rendra automatiquement.
        widgetIdRef.current = null
      },
      onError: () => {
        // Erreur VineJS ou reCAPTCHA — réinitialiser le widget pour que l'utilisateur
        // re-coche la case (le token précédent a peut-être été consommé par Google)
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
        setData('recaptchaToken', '')
      },
    })
  }

  return (
    <>
      <Head title="Rendez-vous Pastoral — Phila MDT">
        <meta name="description" content="Prenez rendez-vous avec votre pasteur à la Phila Maison de Témoignages pour un entretien pastoral, un accompagnement spirituel ou une prière." />
      </Head>
      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-[#1C1613] to-black/90" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <CalendarDays size={14} />
              Entretien Pastoral
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif mb-6 leading-[1.1]">
              Prenez un <span className="text-accent-orange italic">Rendez-vous</span> Pastoral
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Notre pasteur est disponible pour vous écouter, vous conseiller et prier avec vous. Remplissez le formulaire ci-dessous pour planifier une rencontre.
            </p>
          </div>
        </section>

        {/* ── Form Section ── */}
        <section className="py-20 bg-background-off relative -mt-10 z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">

              {isSubmitted ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Demande envoyée !</h2>
                  <p className="text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
                    Nous avons bien reçu votre demande de rendez-vous pastoral. Notre secrétariat vous contactera très prochainement pour confirmer la date et l'heure exactes.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all"
                  >
                    Faire une autre demande
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Formulaire de demande</h2>
                    <p className="text-slate-500 text-sm">Tous les champs marqués d'un astérisque (*) sont obligatoires.</p>
                  </div>

                  {/* Résumé des erreurs si plusieurs champs invalides */}
                  {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-700 text-sm font-semibold">Veuillez corriger les erreurs ci-dessous avant de soumettre.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Nom & Prénom ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nom" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <User size={15} className="text-primary" /> Nom *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          required
                          value={data.lastName}
                          onChange={(e) => setData('lastName', e.target.value)}
                          className={inputClass(errors.lastName)}
                          placeholder="Votre nom"
                          autoComplete="family-name"
                        />
                        <FieldError message={errors.lastName} />
                      </div>

                      <div>
                        <label htmlFor="prenom" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <User size={15} className="text-primary" /> Prénom *
                        </label>
                        <input
                          type="text"
                          id="prenom"
                          required
                          value={data.firstName}
                          onChange={(e) => setData('firstName', e.target.value)}
                          className={inputClass(errors.firstName)}
                          placeholder="Votre prénom"
                          autoComplete="given-name"
                        />
                        <FieldError message={errors.firstName} />
                      </div>
                    </div>

                    {/* ── Téléphone & Email ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="telephone" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Phone size={15} className="text-primary" /> Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="telephone"
                          required
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          className={inputClass(errors.phone)}
                          placeholder="+243814368217"
                          autoComplete="tel"
                        />
                        <FieldError message={errors.phone} />
                      </div>

                      <div>
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Mail size={15} className="text-slate-400" /> Email{' '}
                          <span className="text-slate-400 font-normal text-xs">(Optionnel)</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className={inputClass(errors.email)}
                          placeholder="votre@email.com"
                          autoComplete="email"
                        />
                        <FieldError message={errors.email} />
                      </div>
                    </div>

                    {/* ── Motif & Format ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="motif" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <MessageSquare size={15} className="text-primary" /> Motif du rendez-vous *
                        </label>
                        <select
                          id="motif"
                          required
                          value={motif}
                          onChange={(e) => setMotif(e.target.value)}
                          className={inputClass(errors.reason) + ' appearance-none'}
                        >
                          <option value="">Sélectionnez un motif</option>
                          <option value="Prière et Soutien spirituel">Prière et Soutien spirituel</option>
                          <option value="Conseils pastoraux">Conseils pastoraux</option>
                          <option value="Délivrance et Accompagnement">Délivrance et Accompagnement</option>
                          <option value="autre">Autre</option>
                        </select>
                        {motif === 'autre' && (
                          <input
                            type="text"
                            id="autreMotif"
                            value={autreMotif}
                            onChange={(e) => setAutreMotif(e.target.value)}
                            placeholder="Précisez votre motif..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm mt-3 animate-in fade-in slide-in-from-top-2"
                          />
                        )}
                        <FieldError message={errors.reason} />
                      </div>

                      <div>
                        <label htmlFor="format" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Video size={15} className="text-primary" /> Format *
                        </label>
                        <select
                          id="format"
                          required
                          value={data.format}
                          onChange={(e) => setData('format', e.target.value)}
                          className={inputClass(errors.format) + ' appearance-none'}
                        >
                          <option value="">Sélectionnez le format</option>
                          <option value="presentiel">En présentiel</option>
                          <option value="enligne">En ligne (Appel vidéo)</option>
                          <option value="enligne_vocal">En ligne (Appel vocal)</option>
                        </select>
                        <FieldError message={errors.format} />
                      </div>
                    </div>

                    {/* ── Date & Heure ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="jour" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <CalendarDays size={15} className="text-primary" /> Jour souhaité *
                        </label>
                        <input
                          type="date"
                          id="jour"
                          required
                          value={data.appointmentDate}
                          onChange={(e) => setData('appointmentDate', e.target.value)}
                          className={inputClass(errors.appointmentDate)}
                        />
                        <FieldError message={errors.appointmentDate} />
                      </div>

                      <div>
                        <label htmlFor="heure" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
                          <Clock size={15} className="text-primary" /> Heure souhaitée *
                        </label>
                        <input
                          type="time"
                          id="heure"
                          required
                          value={data.appointmentTime}
                          onChange={(e) => setData('appointmentTime', e.target.value)}
                          className={inputClass(errors.appointmentTime)}
                        />
                        <FieldError message={errors.appointmentTime} />
                      </div>
                    </div>

                    {/* ── Widget reCAPTCHA ── */}
                    {recaptchaSiteKey && (
                      <div className="flex flex-col gap-2 pt-2">
                        <div
                          ref={recaptchaContainerRef}
                          id="rdv-recaptcha-widget"
                          aria-label="Vérification anti-robot reCAPTCHA"
                        />
                        {/* Erreur serveur reCAPTCHA (422 via E_VALIDATION_ERROR) */}
                        {errors.recaptchaToken && (
                          <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                            <AlertCircle size={12} className="shrink-0" />
                            {errors.recaptchaToken}
                          </p>
                        )}
                        {/* Indication avant la première coche */}
                        {!data.recaptchaToken && !errors.recaptchaToken && (
                          <p className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <ShieldCheck size={13} className="shrink-0" />
                            Veuillez cocher la case ci-dessus pour confirmer que vous n'êtes pas un robot.
                          </p>
                        )}
                      </div>
                    )}

                    {/* ── Bouton de soumission ── */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        id="rdv-submit"
                        disabled={processing || (!!recaptchaSiteKey && !data.recaptchaToken)}
                        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        {processing ? 'Traitement en cours...' : 'Soumettre la demande'}
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-4">
                        Vos informations seront traitées en toute confidentialité.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
