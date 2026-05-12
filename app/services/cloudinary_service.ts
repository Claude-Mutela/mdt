import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME')?.trim(),
  api_key: env.get('CLOUDINARY_API_KEY')?.trim(),
  api_secret: env.get('CLOUDINARY_API_SECRET')?.trim(),
})


export default class CloudinaryService {
  static async upload(filePath: string, folder: string = 'mdt'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'auto',
      })
      return result.secure_url
    } catch (error) {

      console.error('[Cloudinary Upload Error]', error)
      throw error
    }
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

