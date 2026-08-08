import React from 'react'
import { getOptimizedCloudinaryUrl } from '~/utils/cloudinary'

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

  const optimizedSrc = getOptimizedCloudinaryUrl(src, { width, height, crop, quality })

  return <img src={optimizedSrc} alt={alt} className={className} loading="lazy" {...props} />
}
