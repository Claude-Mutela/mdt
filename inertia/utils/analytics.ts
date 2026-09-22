/**
 * analytics.ts — Couche d'abstraction Google Analytics 4 pour Phila MDT
 *
 * Architecture : gtag.js est chargé de façon différée (~1500ms) dans le layout Edge.
 * Ce module centralise tous les appels GA4 / GTM pour éviter la dispersion.
 *
 * Usage :
 *   import { trackPageView, trackEvent, trackSocialClick } from '~/utils/analytics'
 */

// ── Types globaux ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: Record<string, unknown>[]
    /** Posé à true dès le premier navigate Inertia (empêche le double Page View initial) */
    __inertiaHasNavigated: boolean
    __thirdPartyLoaded: boolean
  }
}

export interface GaEventParams {
  category?: string
  label?: string
  value?: number
  [key: string]: unknown
}

// ── Constante Measurement ID (variable Vite, fallback hardcodé) ───────────────

const GA_ID: string =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? 'G-03SQWZVCLH'

// ── Helpers internes ──────────────────────────────────────────────────────────

/**
 * La fonction gtag() est toujours définie dans le layout Edge (même avant le vrai script).
 * Elle met les commandes en file d'attente dans dataLayer jusqu'au chargement de gtag.js.
 */
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

function isDataLayerAvailable(): boolean {
  return typeof window !== 'undefined' && Array.isArray(window.dataLayer)
}

// ── API publique ──────────────────────────────────────────────────────────────

/**
 * trackPageView — Envoie un Page View GA4 + push GTM dataLayer.
 *
 * À appeler dans router.on('navigate') pour chaque navigation Inertia.
 * Le Page View initial (premier chargement) est déclenché par le onload
 * du script GA4 dans inertia_layout.edge.
 */
export function trackPageView(url: string, title: string): void {
  // GTM dataLayer (pour triggers custom GTM si configurés)
  if (isDataLayerAvailable()) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_title: title,
    })
  }

  // GA4 direct — envoie un hit page_view explicite
  if (isGtagAvailable()) {
    window.gtag('config', GA_ID, {
      page_path: url,
      page_title: title,
    })
  }
}

/**
 * trackEvent — Envoie un événement GA4 personnalisé.
 * Fonction générique réutilisable pour tout événement futur.
 */
export function trackEvent(eventName: string, params: GaEventParams = {}): void {
  if (!isGtagAvailable()) return
  window.gtag('event', eventName, params)
}

// ── Événements spécialisés (fonctionnalités réelles du projet) ────────────────

/**
 * trackSocialClick — Clic sur un réseau social ou lien de contact externe.
 * Couvre : Facebook, YouTube, Instagram, TikTok, WhatsApp, téléphone, email.
 */
export function trackSocialClick(
  network: 'facebook' | 'youtube' | 'instagram' | 'tiktok' | 'whatsapp' | 'phone' | 'email',
  location: string = 'footer'
): void {
  trackEvent('social_click', {
    network,
    location,
    category: 'engagement',
  })
}

/**
 * trackSermonPlay — Lecture d'une prédication YouTube.
 * Présent sur : pages media, home, allContent.
 */
export function trackSermonPlay(sermonTitle: string, videoId?: string): void {
  trackEvent('sermon_play', {
    sermon_title: sermonTitle,
    video_id: videoId,
    category: 'media',
  })
}

/**
 * trackFormSubmit — Soumission d'un formulaire.
 * Formulaires présents : contact, rendez-vous pastoral, besoin de prière, activité.
 */
export function trackFormSubmit(
  formName: 'contact' | 'rendez_vous' | 'priere' | 'activite',
  success: boolean = true
): void {
  trackEvent('form_submit', {
    form_name: formName,
    success,
    category: 'conversion',
  })
}
