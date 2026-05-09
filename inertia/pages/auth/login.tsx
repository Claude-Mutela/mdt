import { useState, useEffect } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { Head, Link, usePage } from '@inertiajs/react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Toaster, toast } from 'sonner'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { props } = usePage<any>()

  useEffect(() => {
    if (props.flash?.error) {
      toast.error(props.flash.error)
    }
    if (props.flash?.success) {
      toast.success(props.flash.success)
    }
  }, [props.flash])

  return (
    <>
      <Head title="Connexion | Phila MDT" />

      <div className="relative min-h-screen flex items-center justify-center bg-[#FEFDFB] overflow-hidden font-sans">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ 
            backgroundImage: "url('/accueil-mdt.jpeg')",
            transform: 'scale(1.05)'
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-orange/20 blur-[120px] rounded-full animate-pulse" />

        <div className="relative z-10 w-full max-w-md px-6 py-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/" className="group flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                <img 
                  src="/MDT LOGO ORANGE.png" 
                  alt="Phila MDT Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl font-serif text-white text-center tracking-tight">
                Phila <span className="text-primary-light">MDT</span>
              </h1>
              <p className="mt-2 text-white/70 text-sm font-light">Espace Membres & Administration</p>
            </Link>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/40 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bon retour !</h2>
              <p className="text-gray-500 text-sm">Entrez vos identifiants pour vous connecter.</p>
            </div>

            <Form route="session.store">
              {({ errors, processing }) => (
                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="group space-y-2">
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 transition-colors group-focus-within:text-primary"
                    >
                      Adresse Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="nom@exemple.com"
                        className={cn(
                          "block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
                          errors.email && "border-red-500 bg-red-50/30 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500"
                        )}
                        autoComplete="username"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <CheckCircle2 size={12} className="rotate-180" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="group space-y-2">
                    <div className="flex justify-between items-center">
                      <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-700 transition-colors group-focus-within:text-primary"
                      >
                        Mot de passe
                      </label>
                      {/* <Link 
                        href="/auth/forgot-password" 
                        className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                      >
                        Oublié ?
                      </Link> */}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className={cn(
                          "block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300",
                          errors.password && "border-red-500 bg-red-50/30 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500"
                        )}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <CheckCircle2 size={12} className="rotate-180" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {/* <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <div className="w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                          <CheckCircle2 size={12} className={cn("text-white scale-0 transition-transform duration-200", rememberMe && "scale-100")} />
                        </div>
                        <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Se souvenir de moi</span>
                      </div>
                    </label>
                  </div> */}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="group relative w-full flex items-center justify-center py-4 px-6 bg-primary text-white text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {processing ? "Connexion en cours..." : "Se connecter"}
                      {!processing && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  {/* <div className="pt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Pas encore de compte ?{" "}
                      <Link 
                        href="/auth/signup" 
                        className="font-bold text-primary hover:underline underline-offset-4"
                      >
                        Créer un accès
                      </Link>
                    </p>
                  </div> */}
                </div>
              )}
            </Form>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
            <p className="text-white/40 text-xs tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Phila MDT &bull; Excellence & Foi
            </p>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </>
  )
}
