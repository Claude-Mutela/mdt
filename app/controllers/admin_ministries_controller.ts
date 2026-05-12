import type { HttpContext } from '@adonisjs/core/http'
import Ministry from '#models/ministry'
import { ministryValidator } from '#validators/ministry'
import CloudinaryService from '#services/cloudinary_service'

export default class AdminMinistriesController {
  async index({ inertia }: HttpContext) {
    const ministries = await Ministry.all()
    return inertia.render('admin/ministeres' as any, { ministries })
  }

  // Ministries CRUD
  async storeMinistry({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(ministryValidator)


      
      const ministry = new Ministry()
      ministry.fill({
        name: data.name,
        description: data.description,
        content: data.content,
        badgeColor: data.badgeColor,
        tag: data.tag,
      })

      // Handle Cloudinary Uploads
      const coverImg = request.file('coverImg')
      if (coverImg && coverImg.tmpPath) {
        const url = await CloudinaryService.upload(coverImg.tmpPath, 'ministries/covers')
        ministry.coverImg = url
      }

      await ministry.save()
      session.flash('success', 'Ministère créé avec succès sur Cloudinary.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la création du ministère.")
    }
    return response.redirect().back()
  }

  async updateMinistry({ params, request, response, session }: HttpContext) {
    try {
      const ministry = await Ministry.findOrFail(params.id)
      const data = await request.validateUsing(ministryValidator)
      
      ministry.merge({
        name: data.name,
        description: data.description,
        content: data.content,
        badgeColor: data.badgeColor,
        tag: data.tag,
      })

      // Handle Cloudinary Uploads (Update only if new file provided)
      const coverImg = request.file('coverImg')
      if (coverImg && coverImg.tmpPath) {
        // Delete old image if it exists
        if (ministry.coverImg) {
          const oldPublicId = CloudinaryService.extractPublicId(ministry.coverImg)
          if (oldPublicId) {
            await CloudinaryService.delete(oldPublicId)
          }
        }

        const url = await CloudinaryService.upload(coverImg.tmpPath, 'ministries/covers')
        ministry.coverImg = url
      }

      await ministry.save()
      session.flash('success', 'Ministère mis à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la mise à jour du ministère.")
    }
    return response.redirect().back()
  }



  async destroyMinistry({ params, response, session }: HttpContext) {
    try {
      const ministry = await Ministry.findOrFail(params.id)

      // Delete image from Cloudinary if it exists
      if (ministry.coverImg) {
        const publicId = CloudinaryService.extractPublicId(ministry.coverImg)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      await ministry.delete()
      session.flash('success', 'Ministère supprimé avec succès.')
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression du ministère.")
    }
    return response.redirect().back()
  }

}
