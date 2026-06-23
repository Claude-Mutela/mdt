import { useState } from 'react'
import { X, Check, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: number
  fullName: string
  firstname?: string
  lastname?: string
  email: string
  role: string
  initials: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const [firstname, setFirstname] = useState(user?.firstname || '')
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation basique côté client
    const newErrors: Record<string, string> = {}
    if (!firstname.trim()) newErrors.firstname = 'Le prénom est requis'
    if (!lastname.trim()) newErrors.lastname = 'Le nom est requis'
    if (!email.trim()) newErrors.email = "L'adresse email est requise"
    
    if (password) {
      if (password.length < 6) {
        newErrors.password = 'Le mot de passe doit faire au moins 6 caractères'
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simulation d'une requête API (uniquement frontend pour le moment)
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      toast.success('Vos informations ont été mises à jour avec succès !')
      onClose()
      // Réinitialiser les champs de mot de passe
      setPassword('')
      setConfirmPassword('')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-800/20">
          <h3 className="text-white font-bold text-lg">Paramètres du profil</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Prénom</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Votre prénom"
                  required
                />
                {errors.firstname && (
                  <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} />{errors.firstname}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Nom</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Votre nom"
                  required
                />
                {errors.lastname && (
                  <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} />{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="nom@exemple.com"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} />{errors.email}</p>
              )}
            </div>

            <hr className="border-slate-800/80 my-4" />

            {/* Nouveau mot de passe */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Nouveau mot de passe</label>
                <span className="text-[10px] text-slate-500 lowercase">(laisser vide si inchangé)</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} />{errors.password}</p>
              )}
            </div>

            {/* Confirmer mot de passe */}
            {password && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Confirmer le mot de passe</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={10} />{errors.confirmPassword}</p>
                )}
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-800/20">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={processing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
