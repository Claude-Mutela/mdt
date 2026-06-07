import { Head, useForm } from '@inertiajs/react'
import { CalendarDays, Clock, User, Phone, Mail, CheckCircle2, MessageSquare, Video } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function RendezVous() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [motif, setMotif] = useState('')
  const [autreMotif, setAutreMotif] = useState('')

  const { data, setData, post, processing, errors, reset } = useForm({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    reason: '',
    format: '',
    appointmentDate: '',
    appointmentTime: '',
  })

  // Synchronise le motif sélectionné et l'autre motif avec le champ "reason" de useForm
  useEffect(() => {
    if (motif === 'autre') {
      setData('reason', autreMotif)
    } else {
      setData('reason', motif)
    }
  }, [motif, autreMotif])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/rendez-vous', {
      onSuccess: () => {
        setIsSubmitted(true)
        reset()
        setMotif('')
        setAutreMotif('')
      },
    })
  }

  return (
    <>
      <Head title="Rendez-vous Pastoral — Phila MDT" />
      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          {/* Background image or gradient */}
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nom */}
                      <div className="space-y-2">
                        <label htmlFor="nom" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <User size={16} className="text-primary" /> Nom *
                        </label>
                        <input 
                          type="text" 
                          id="nom" 
                          required
                          value={data.lastName}
                          onChange={(e) => setData('lastName', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                          placeholder="Votre nom"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                      </div>
                      
                      {/* Prénom */}
                      <div className="space-y-2">
                        <label htmlFor="prenom" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <User size={16} className="text-primary" /> Prénom *
                        </label>
                        <input 
                          type="text" 
                          id="prenom" 
                          required
                          value={data.firstName}
                          onChange={(e) => setData('firstName', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                          placeholder="Votre prénom"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Téléphone */}
                      <div className="space-y-2">
                        <label htmlFor="telephone" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Phone size={16} className="text-primary" /> Téléphone *
                        </label>
                        <input 
                          type="tel" 
                          id="telephone" 
                          required
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                          placeholder="+243..."
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" /> Email <span className="text-slate-400 font-normal">(Optionnel)</span>
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Motif */}
                      <div className="space-y-2">
                        <label htmlFor="motif" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <MessageSquare size={16} className="text-primary" /> Motif du rendez-vous *
                        </label>
                        <select 
                          id="motif" 
                          required
                          value={motif}
                          onChange={(e) => setMotif(e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.reason ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm appearance-none`}
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
                            required
                            value={autreMotif}
                            onChange={(e) => setAutreMotif(e.target.value)}
                            placeholder="Précisez votre motif..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm mt-3 animate-in fade-in slide-in-from-top-2"
                          />
                        )}
                        {errors.reason && <p className="text-red-500 text-xs mt-1 ml-1">{errors.reason}</p>}
                      </div>
                      
                      {/* Format */}
                      <div className="space-y-2">
                        <label htmlFor="format" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Video size={16} className="text-primary" /> Format *
                        </label>
                        <select 
                          id="format" 
                          required
                          value={data.format}
                          onChange={(e) => setData('format', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.format ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm appearance-none`}
                        >
                          <option value="">Sélectionnez le format</option>
                          <option value="presentiel">En présentiel</option>
                          <option value="enligne">En ligne (Appel vidéo)</option>
                          <option value="enligne_vocal">En ligne (Appel vocal)</option>
                        </select>
                        {errors.format && <p className="text-red-500 text-xs mt-1 ml-1">{errors.format}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Jour */}
                      <div className="space-y-2">
                        <label htmlFor="jour" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <CalendarDays size={16} className="text-primary" /> Jour souhaité *
                        </label>
                        <input 
                          type="date" 
                          id="jour" 
                          required
                          value={data.appointmentDate}
                          onChange={(e) => setData('appointmentDate', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.appointmentDate ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                        />
                        {errors.appointmentDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.appointmentDate}</p>}
                      </div>
                      
                      {/* Heure */}
                      <div className="space-y-2">
                        <label htmlFor="heure" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Clock size={16} className="text-primary" /> Heure souhaitée *
                        </label>
                        <input 
                          type="time" 
                          id="heure" 
                          required
                          value={data.appointmentTime}
                          onChange={(e) => setData('appointmentTime', e.target.value)}
                          className={`w-full bg-slate-50 border ${errors.appointmentTime ? 'border-red-500' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block px-4 py-3.5 outline-none transition-all shadow-sm`}
                        />
                        {errors.appointmentTime && <p className="text-red-500 text-xs mt-1 ml-1">{errors.appointmentTime}</p>}
                      </div>
                    </div>

                    <div className="pt-8">
                      <button 
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
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
