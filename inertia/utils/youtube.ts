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
 * Retourne la vignette officielle haute résolution YouTube
 */
export function getYoutubeThumbnailUrl(url: string | null | undefined): string {
  const id = getYoutubeVideoId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
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
 * Retourne la meilleure vignette pour un média (YouTube ou image personnalisée)
 */
export function getVideoThumbnail(
  thumbnail: string | null | undefined,
  url: string | null | undefined,
  fallback: string = '/mdt-banner.jpg'
): string {
  if (isYoutubeUrl(thumbnail)) {
    return getYoutubeThumbnailUrl(thumbnail)
  }
  if (thumbnail && thumbnail.trim() !== '' && !isYoutubeUrl(thumbnail)) {
    return thumbnail
  }
  if (isYoutubeUrl(url)) {
    return getYoutubeThumbnailUrl(url)
  }
  return fallback
}
