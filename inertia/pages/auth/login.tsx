import { Head, useForm } from '@inertiajs/react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Eye, EyeOff, Lock, Mail, Loader2, LogIn, AlertCircle } from 'lucide-react'

export default function Login({ recaptchaSiteKey = '' }: { recaptchaSiteKey?: string }) {
  const [showPassword, setShowPassword] = useState(false)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const scriptLoadedRef = useRef(false)

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
    recaptchaToken: '',
  } as {
    email: string;
    password: string;
    remember: boolean;
    recaptchaToken: string;
    auth?: string;
  })

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
      theme: 'dark', // Thème sombre pour s'intégrer harmonieusement à la page
      size: 'normal',
    })
  }, [recaptchaSiteKey, setData])

  useEffect(() => {
    if (!recaptchaSiteKey) return

    if (widgetIdRef.current !== null) return

    if (window.grecaptcha) {
      renderWidget()
      return
    }

    if (scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    window.onRecaptchaLoad = renderWidget

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      delete (window as any).onRecaptchaLoad
    }
  }, [recaptchaSiteKey, renderWidget])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login', {
      onError: () => {
        // En cas d'erreur de connexion ou reCAPTCHA, réinitialiser le widget
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current)
        }
        setData('recaptchaToken', '')
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-primary selection:text-white">
      <Head title="Connexion — Phila MDT" />

      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        {/* Logo / Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group">
            <LogIn className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Bon retour</h1>
          <p className="text-slate-400">Accédez au tableau de bord Phila MDT</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <form onSubmit={submit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* reCAPTCHA Widget */}
            {recaptchaSiteKey && (
              <div className="flex flex-col items-center justify-center py-2">
                <div ref={recaptchaContainerRef} className="mx-auto" />
                {errors.recaptchaToken && (
                  <p className="flex items-center gap-1.5 text-red-400 text-xs mt-2 font-medium">
                    <AlertCircle size={12} className="shrink-0" />
                    {errors.recaptchaToken}
                  </p>
                )}
              </div>
            )}

            {/* Error Message Global */}
            {errors.auth && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                <p className="text-red-400 text-sm text-center">{errors.auth}</p>
              </div>
            )}

            {/* Options */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-primary focus:ring-offset-slate-900 focus:ring-primary"
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary-dark font-semibold transition-colors">
                Oublié ?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || (!!recaptchaSiteKey && !data.recaptchaToken)}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Phila MDT · Tous droits réservés
        </p>
      </div>
    </div>
  )
}
