import type { HttpContext } from '@adonisjs/core/http'
import Ministry from '#models/ministry'
import { ministryValidator } from '#validators/ministry'
import app from '@adonisjs/core/services/app'
import string from '@adonisjs/core/helpers/string'

export default class AdminMinistriesController {
  async index({ inertia }: HttpContext) {
    const ministries = await Ministry.all()
    return inertia.render('admin/ministeres', { ministries })
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

      // Handle Image Uploads
      const coverImg = request.file('coverImg')
      if (coverImg) {
        const fileName = `${string.uuid()}.${coverImg.extname}`
        await coverImg.move(app.makePath('public/uploads/ministries'), { name: fileName })
        ministry.coverImg = `/uploads/ministries/${fileName}`
      }

      const urlImg = request.file('urlImg')
      if (urlImg) {
        const fileName = `${string.uuid()}.${urlImg.extname}`
        await urlImg.move(app.makePath('public/uploads/ministries'), { name: fileName })
        ministry.urlImg = `/uploads/ministries/${fileName}`
      }

      await ministry.save()
      session.flash('success', 'Ministère créé avec succès.')
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

      // Handle Image Uploads (Update only if new file provided)
      const coverImg = request.file('coverImg')
      if (coverImg) {
        const fileName = `${string.uuid()}.${coverImg.extname}`
        await coverImg.move(app.makePath('public/uploads/ministries'), { name: fileName })
        ministry.coverImg = `/uploads/ministries/${fileName}`
      }

      const urlImg = request.file('urlImg')
      if (urlImg) {
        const fileName = `${string.uuid()}.${urlImg.extname}`
        await urlImg.move(app.makePath('public/uploads/ministries'), { name: fileName })
        ministry.urlImg = `/uploads/ministries/${fileName}`
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
      await ministry.delete()
      session.flash('success', 'Ministère supprimé avec succès.')
    } catch (error) {
      session.flash('error', "Erreur lors de la suppression du ministère.")
    }
    return response.redirect().back()
  }
}
