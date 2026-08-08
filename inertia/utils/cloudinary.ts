interface OptimizeOptions {
  width?: number
  height?: number
  crop?: string
  quality?: string
}

/**
 * Optimise une URL Cloudinary en injectant des transformations (format, qualité, redimensionnement).
 * Si l'URL n'est pas de Cloudinary, elle est retournée telle quelle.
 */
export function getOptimizedCloudinaryUrl(
  url: string | null | undefined,
  optionsOrWidth?: number | OptimizeOptions
): string {
  if (!url) return ''
  if (!url.includes('cloudinary.com')) return url

  let width: number | undefined
  let height: number | undefined
  let crop: string = 'fill'
  let quality: string = 'auto'

  if (typeof optionsOrWidth === 'number') {
    width = optionsOrWidth
  } else if (optionsOrWidth) {
    width = optionsOrWidth.width
    height = optionsOrWidth.height
    crop = optionsOrWidth.crop || 'fill'
    quality = optionsOrWidth.quality || 'auto'
  }

  // Segment de transformation par défaut
  let transformations = `f_auto,q_${quality}`
  if (width) transformations += `,w_${width}`
  if (height) transformations += `,h_${height}`
  if (width || height) transformations += `,c_${crop}`

  // Séparation pour injecter les transformations
  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const postUpload = parts[1]
  const segments = postUpload.split('/')
  const firstSegment = segments[0]

  // Détecte si le premier segment est déjà un segment de transformation de Cloudinary
  const isTransformation =
    firstSegment.includes(',') ||
    /^(w|h|c|q|f|r|g|e|dpr|b|o|l|u|y|x|co|fl|p|st|eo|so|dl|pg|t|cu|z)_/.test(firstSegment)

  if (isTransformation) {
    let newFirstSegment = firstSegment

    // f_auto
    if (!newFirstSegment.includes('f_auto')) {
      newFirstSegment += ',f_auto'
    }
    // q_auto / q_...
    if (!newFirstSegment.includes('q_')) {
      newFirstSegment += `,q_${quality}`
    } else if (quality !== 'auto') {
      newFirstSegment = newFirstSegment.replace(/q_[^,]+/, `q_${quality}`)
    }
    // width
    if (width) {
      if (newFirstSegment.includes('w_')) {
        newFirstSegment = newFirstSegment.replace(/w_\d+/, `w_${width}`)
      } else {
        newFirstSegment += `,w_${width}`
      }
    }
    // height
    if (height) {
      if (newFirstSegment.includes('h_')) {
        newFirstSegment = newFirstSegment.replace(/h_\d+/, `h_${height}`)
      } else {
        newFirstSegment += `,h_${height}`
      }
    }
    // crop
    if (width || height) {
      if (newFirstSegment.includes('c_')) {
        newFirstSegment = newFirstSegment.replace(/c_[^,]+/, `c_${crop}`)
      } else {
        newFirstSegment += `,c_${crop}`
      }
    }

    segments[0] = newFirstSegment
    return `${parts[0]}/upload/${segments.join('/')}`
  } else {
    return `${parts[0]}/upload/${transformations}/${postUpload}`
  }
}
