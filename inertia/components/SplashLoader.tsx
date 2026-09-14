import React, { useEffect, useState, useRef } from 'react'
import { router } from '@inertiajs/react'

export const SplashLoader: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleStart = () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
      // Délai de 80ms pour éviter les micro-sursauts sur les pages en cache instantané
      timeoutRef.current = setTimeout(() => {
        setVisible(true)
        setIsFading(false)
      }, 80)
    }

    const handleStop = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsFading(true)
      fadeTimeoutRef.current = setTimeout(() => {
        setVisible(false)
        setIsFading(false)
      }, 300)
    }

    const removeStartListener = router.on('start', handleStart)
    const removeFinishListener = router.on('finish', handleStop)
    const removeCancelListener = router.on('cancel', handleStop)
    const removeErrorListener = router.on('error', handleStop)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
      removeStartListener()
      removeFinishListener()
      removeCancelListener()
      removeErrorListener()
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page..."
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/85 backdrop-blur-md transition-opacity duration-300 pointer-events-none select-none ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-primary/20 via-primary-light/15 to-transparent blur-2xl animate-pulse pointer-events-none" />

      {/* Conteneur Logo avec pulsation & aura */}
      <div className="relative flex flex-col items-center">
        {/* Anneau extérieur animé */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-primary via-amber-500 to-primary opacity-40 blur-sm animate-spin [animation-duration:4s]" />

          {/* Cercle blanc avec bordure */}
          <div className="relative h-24 w-24 md:h-28 md:md:w-28 rounded-full bg-white p-2 shadow-xl border border-primary/20 flex items-center justify-center overflow-hidden">
            <img
              src="/log-phila-mdt.webp"
              alt="Phila MDT"
              width={112}
              height={112}
              className="h-full w-full object-contain animate-bounce [animation-duration:2.5s]"
            />
          </div>
        </div>

        {/* Textes de la marque */}
        <div className="mt-5 text-center space-y-1">
          <h3 className="text-xl md:text-2xl font-black font-serif text-primary tracking-wide">
            PHILA MDT
          </h3>
          <p className="text-[11px] font-bold text-accent-orange uppercase tracking-widest">
            Maison de Témoignages
          </p>
        </div>

        {/* Ligne de chargement moderne (Indeterminate Bar) */}
        <div className="mt-5 w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div className="splash-progress-line absolute inset-y-0 bg-gradient-to-r from-primary via-amber-500 to-primary rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default SplashLoader
