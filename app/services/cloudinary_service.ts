import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME')?.trim(),
  api_key: env.get('CLOUDINARY_API_KEY')?.trim(),
  api_secret: env.get('CLOUDINARY_API_SECRET')?.trim(),
})


export default class CloudinaryService {
  static upload(filePath: string, folder: string = 'mdt'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        filePath,
        {
          folder: folder,
          resource_type: 'auto',
          chunk_size: 6000000, // Tronçonnage par blocs de 6 Mo
          timeout: 120000,     // Timeout de 2 minutes
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' } // Optimisation automatique et limitation de taille
          ]
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Upload Error]', error)
            return reject(error)
          }
          if (!result || !result.secure_url) {
            return reject(new Error('Le téléversement a réussi mais aucune URL sécurisée n\'a été renvoyée.'))
          }
          resolve(result.secure_url)
        }
      )
    })
  }

  static async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('[Cloudinary Delete Error]', error)
      throw error
    }
  }

  static extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/')
      const uploadIndex = parts.indexOf('upload')
      if (uploadIndex === -1) return null

      let startIndex = uploadIndex + 1
      if (parts[startIndex].startsWith('v')) {
        startIndex++
      }
      
      const publicIdWithExt = parts.slice(startIndex).join('/')
      return publicIdWithExt.split('.')[0]
    } catch {
      return null
    }
  }
}

