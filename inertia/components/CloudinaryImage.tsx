import React from 'react'

interface CloudinaryImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined
  width?: number
  height?: number
  crop?: 'fill' | 'scale' | 'fit' | 'thumb'
  quality?: string
}


/**
 * Composant pour afficher une image Cloudinary optimisée
 */
export default function CloudinaryImage({ 
  src, 
  width, 
  height, 
  crop = 'fill', 
  quality = 'auto', 
  className,
  alt = '',
  ...props 
}: CloudinaryImageProps) {
  
  if (!src) return null

  // Si l'image ne vient pas de Cloudinary, on l'affiche telle quelle
  if (!src.includes('cloudinary.com')) {
    return <img src={src} alt={alt} className={className} {...props} />
  }

  // Construction de la chaîne de transformation
  // f_auto : format automatique (WebP/AVIF)
  // q_auto : qualité automatique
  let transformations = `f_auto,q_${quality}`
  
  if (width) transformations += `,w_${width}`
  if (height) transformations += `,h_${height}`
  if (width || height) transformations += `,c_${crop}`

  // Injection des transformations dans l'URL
  // On cherche l'endroit après '/upload/' pour insérer les paramètres
  const optimizedSrc = src.replace('/upload/', `/upload/${transformations}/`)

  return (
    <img 
      src={optimizedSrc} 
      alt={alt} 
      className={className}
      loading="lazy"
      {...props} 
    />
  )
}
