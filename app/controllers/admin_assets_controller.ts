import type { HttpContext } from '@adonisjs/core/http'
import HeroAsset from '#models/hero_asset'
import CloudinaryService from '#services/cloudinary_service'
import { heroAssetValidator } from '#validators/hero_asset'

export default class AdminAssetsController {

  public async index({ inertia }: HttpContext) {
    const assets = await HeroAsset.query().orderBy('created_at', 'desc')
    return inertia.render('admin/assets', {
      assets: assets.map(a => ({
        id: a.id,
        name: a.name,
        filePath: a.filePath,
        type: a.type,
        status: a.status,
        createdAt: a.createdAt.toISO(),
      }))
    })
  }

  public async store({ request, response, session }: HttpContext) {
    // Validate metadata
    const payload = await request.validateUsing(heroAssetValidator)

    // Validate file
    const file = request.file('file', {
      size: '50mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'],
    })

    if (!file || !file.isValid || !file.tmpPath) {
      session.flash('error', file?.errors?.[0]?.message ?? 'Fichier invalide ou manquant.')
      return response.redirect().back()
    }

    // Upload directly from AdonisJS temporary path
    const cloudinaryUrl = await CloudinaryService.upload(
      file.tmpPath,
      'mdt/hero'
    )

    console.log('[DEBUG] UPLOADED URL:', cloudinaryUrl)

    // Determine type from extension
    const videoExtnames = ['mp4', 'webm', 'mov']
    const ext = file.extname?.toLowerCase() ?? ''
    const type: 'image' | 'video' = videoExtnames.includes(ext) ? 'video' : 'image'

    // If activating, deactivate all others first
    if (payload.status === 'active') {
      await HeroAsset.query().update({ status: 'inactive' })
    }

    const insertData = {
      name: payload.name,
      filePath: cloudinaryUrl,
      type,
      status: payload.status,
    }
    console.log('[DEBUG] INSERTING HERO ASSET DATA:', insertData)

    await HeroAsset.create(insertData as any)

    session.flash('success', 'Média uploadé avec succès.')
    return response.redirect().back()
  }

  public async activate({ params, response, session }: HttpContext) {
    const asset = await HeroAsset.findOrFail(params.id)

    // Deactivate all, then activate this one
    await HeroAsset.query().update({ status: 'inactive' })
    asset.status = 'active'
    await asset.save()

    session.flash('success', `"${asset.name}" est maintenant actif.`)
    return response.redirect().back()
  }

  public async deactivate({ params, response, session }: HttpContext) {
    const asset = await HeroAsset.findOrFail(params.id)
    asset.status = 'inactive'
    await asset.save()

    session.flash('success', `"${asset.name}" est maintenant inactif.`)
    return response.redirect().back()
  }

  public async destroy({ params, response, session }: HttpContext) {
    const asset = await HeroAsset.findOrFail(params.id)

    // Delete from Cloudinary
    const publicId = CloudinaryService.extractPublicId(asset.filePath)
    if (publicId) {
      await CloudinaryService.delete(publicId)
    }

    await asset.delete()
    session.flash('success', 'Média supprimé avec succès.')
    return response.redirect().back()
  }
}
