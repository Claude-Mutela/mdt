/**
 * Utilitaires pour la gestion et l'intégration des vidéos YouTube.
 */

export function isYoutubeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return (
    url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')
  )
}

/**
 * Extrait l'identifiant unique (11 caractères) d'une vidéo YouTube
 * supporte: watch?v=, youtu.be/, /live/, /shorts/, /embed/, etc.
 */
export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null
  const regExp =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regExp)
  return match && match[1] ? match[1] : null
}

/**
 * Génère l'URL d'intégration (embed) YouTube sécurisée et compatible avec tous les navigateurs.
 */
export function getYoutubeEmbedUrl(
  url: string | null | undefined,
  autoplay: boolean = true
): string {
  if (!url) return ''
  const id = getYoutubeVideoId(url)
  if (!id) return url

  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://philamdt.church'

  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin,
  })

  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

/**
 * Détecte si une URL pointe vers une image (Cloudinary ou extension image courante).
 */
export function isImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.trim().toLowerCase()
  if (clean.includes('/video/upload/') || clean.includes('/raw/upload/')) return false
  if (
    clean.endsWith('.mp4') ||
    clean.endsWith('.mp3') ||
    clean.endsWith('.pdf') ||
    clean.endsWith('.wav') ||
    clean.endsWith('.webm')
  ) {
    return false
  }
  if (clean.includes('/image/upload/')) return true
  if (/\.(jpe?g|png|webp|avif|gif|svg)($|\?)/i.test(clean)) return true
  return (
    !isYoutubeUrl(clean) &&
    (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/'))
  )
}

/**
 * Retourne la vignette officielle YouTube (par défaut Full HD maxresdefault, avec option hqdefault).
 */
export function getYoutubeThumbnailUrl(
  url: string | null | undefined,
  quality: 'maxres' | 'hq' = 'maxres'
): string {
  const id = getYoutubeVideoId(url)
  if (!id) return ''
  return quality === 'maxres'
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/**
 * Détermine l'URL source de lecture pour un média
 */
export function getVideoPlayUrl(
  thumbnail: string | null | undefined,
  url: string | null | undefined
): string {
  if (isYoutubeUrl(thumbnail)) return thumbnail!
  if (isYoutubeUrl(url)) return url!
  return url || thumbnail || ''
}

/**
 * Retourne la meilleure vignette pour un média :
 * 1. Priorité absolue : image téléversée personnalisée (si présente dans thumbnail ou url)
 * 2. Sinon, vignette officielle YouTube en Full HD (maxresdefault)
 * 3. Sinon, image de repli par défaut
 */
export function getVideoThumbnail(
  thumbnail: string | null | undefined,
  url: string | null | undefined,
  fallback: string = '/mdt-banner.jpg'
): string {
  // 1. Priorité à la miniature téléversée personnalisée
  if (isImageUrl(thumbnail)) return thumbnail!
  if (isImageUrl(url)) return url!

  // 2. Vignette YouTube Full HD
  if (isYoutubeUrl(thumbnail)) {
    return getYoutubeThumbnailUrl(thumbnail, 'maxres')
  }
  if (isYoutubeUrl(url)) {
    return getYoutubeThumbnailUrl(url, 'maxres')
  }

  // 3. Autre URL non-youtube valide
  if (thumbnail && thumbnail.trim() !== '' && !thumbnail.startsWith('#')) {
    return thumbnail
  }
  if (url && url.trim() !== '' && !url.startsWith('#')) {
    return url
  }

  return fallback
}

