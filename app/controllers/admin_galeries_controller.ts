import type { HttpContext } from '@adonisjs/core/http'
import Galery from '#models/galery'
import Image from '#models/image'
import CatGalery from '#models/cat_galery'
import {
  createGalleryValidator,
  updateGalleryValidator,
  catGalleryValidator,
  createImageValidator,
  updateImageValidator,
} from '#validators/gallery'
import CloudinaryService from '#services/cloudinary_service'
import { DateTime } from 'luxon'

export default class AdminGaleriesController {

  public async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const catId = request.input('catId', 'all')
    const galeryId = request.input('galeryId', 'all')
    const tab = request.input('tab', 'albums') // 'albums' ou 'photos'

    const categories = await CatGalery.query().orderBy('name', 'asc')
    const allGaleries = await Galery.query().orderBy('title', 'asc')

    let paginatedData: any
    let paginationMeta: any

    if (tab === 'photos') {
      const query = Image.query().preload('galery').orderBy('created_at', 'desc')

      if (search) {
        query.where((q) => {
          q.where('title', 'like', `%${search}%`)
           .orWhereHas('galery', (g) => {
             g.where('title', 'like', `%${search}%`)
           })
        })
      }

      if (galeryId && galeryId !== 'all') {
        query.where('galery_id', galeryId)
      }

      if (catId && catId !== 'all') {
        query.whereHas('galery', (gQ) => {
          gQ.where('cat_galery_id', catId)
        })
      }

      paginatedData = await query.paginate(page, 21)
      paginationMeta = paginatedData.getMeta()
    } else {
      // tab === 'albums'
      const query = Galery.query().preload('catGalery').orderBy('created_at', 'desc')

      if (search) {
        query.where((q) => {
          q.where('title', 'like', `%${search}%`)
           .orWhereHas('catGalery', (c) => {
             c.where('name', 'like', `%${search}%`)
           })
        })
      }

      if (catId && catId !== 'all') {
        query.where('cat_galery_id', catId)
      }

      paginatedData = await query.paginate(page, 21)
      paginationMeta = paginatedData.getMeta()
    }

    return inertia.render('admin/galerie', {
      tab,
      galeries: tab === 'albums'
        ? paginatedData.all().map((g: Galery) => ({
            id: g.id,
            title: g.title,
            coverImg: g.coverImg,
            urlImg: g.urlImg,
            imgNber: g.imgNber,
            catGaleryId: g.catGaleryId,
            catGalery: g.catGalery ? { id: g.catGalery.id, name: g.catGalery.name } : null,
            createdAt: g.createdAt.toISO(),
          }))
        : [],
      photos: tab === 'photos'
        ? paginatedData.all().map((img: Image) => ({
            id: img.id,
            title: img.title,
            url: img.url,
            date: img.date ? img.date.toISODate() : null,
            galeryId: img.galeryId,
            galery: img.galery ? { id: img.galery.id, title: img.galery.title } : null,
            createdAt: img.createdAt.toISO(),
          }))
        : [],
      allGaleries: allGaleries.map((g) => ({
        id: g.id,
        title: g.title,
        catGaleryId: g.catGaleryId,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      meta: {
        total: paginationMeta.total,
        perPage: paginationMeta.perPage,
        currentPage: paginationMeta.currentPage,
        lastPage: paginationMeta.lastPage,
        firstPage: 1,
      },
      filters: {
        search,
        catId,
        galeryId,
        tab,
      },
    })
  }

  // --- Album (Galery) CRUD ---

  public async storeAlbum({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createGalleryValidator)

    try {
      const album = new Galery()
      album.fill({
        title: payload.title,
        catGaleryId: payload.catGaleryId,
        imgNber: 0,
      })

      const coverFile = request.file('file')
      if (coverFile && coverFile.tmpPath) {
        const url = await CloudinaryService.upload(coverFile.tmpPath, 'gallery_covers')
        album.coverImg = url
      }

      await album.save()
      session.flash('success', 'Album créé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création de l\'album.')
    }

    return response.redirect().back()
  }

  public async updateAlbum({ params, request, response, session }: HttpContext) {
    const album = await Galery.findOrFail(params.id)
    const payload = await request.validateUsing(updateGalleryValidator)

    try {
      album.merge({
        title: payload.title,
        catGaleryId: payload.catGaleryId,
      })

      const coverFile = request.file('file')
      if (coverFile && coverFile.tmpPath) {
        // Delete old cover from Cloudinary
        if (album.coverImg) {
          const publicId = CloudinaryService.extractPublicId(album.coverImg)
          if (publicId) {
            await CloudinaryService.delete(publicId)
          }
        }
        const url = await CloudinaryService.upload(coverFile.tmpPath, 'gallery_covers')
        album.coverImg = url
      }

      await album.save()
      session.flash('success', 'Album mis à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour de l\'album.')
    }

    return response.redirect().back()
  }

  public async destroyAlbum({ params, response, session }: HttpContext) {
    const album = await Galery.findOrFail(params.id)

    try {
      // Find all photos in this album to delete from Cloudinary
      const photos = await Image.query().where('galery_id', album.id)
      for (const photo of photos) {
        if (photo.url) {
          const publicId = CloudinaryService.extractPublicId(photo.url)
          if (publicId) {
            await CloudinaryService.delete(publicId)
          }
        }
      }

      // Delete cover image
      if (album.coverImg) {
        const publicId = CloudinaryService.extractPublicId(album.coverImg)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      // Delete album (Cascade delete handles images table in DB)
      await album.delete()
      session.flash('success', 'Album supprimé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression de l\'album.')
    }

    return response.redirect().back()
  }

  // --- Photo (Image) CRUD ---

  public async storePhoto({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createImageValidator)

    try {
      const image = new Image()
      image.fill({
        title: payload.title || null,
        galeryId: payload.galeryId,
        date: payload.date ? DateTime.fromJSDate(payload.date) : null,
      })

      const file = request.file('file')
      if (file && file.tmpPath) {
        const url = await CloudinaryService.upload(file.tmpPath, 'gallery_photos')
        image.url = url
      } else {
        session.flash('error', 'L\'image est obligatoire.')
        return response.redirect().back()
      }

      await image.save()

      // Increment img_nber
      const gallery = await Galery.findOrFail(payload.galeryId)
      gallery.imgNber = gallery.imgNber + 1
      await gallery.save()

      session.flash('success', 'Photo ajoutée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de l\'ajout de la photo.')
    }

    return response.redirect().back()
  }

  public async updatePhoto({ params, request, response, session }: HttpContext) {
    const image = await Image.findOrFail(params.id)
    const oldGaleryId = image.galeryId
    const payload = await request.validateUsing(updateImageValidator)

    try {
      image.merge({
        title: payload.title || null,
        galeryId: payload.galeryId,
        date: payload.date ? DateTime.fromJSDate(payload.date) : null,
      })

      const file = request.file('file')
      if (file && file.tmpPath) {
        // Delete old photo from Cloudinary
        if (image.url) {
          const publicId = CloudinaryService.extractPublicId(image.url)
          if (publicId) {
            await CloudinaryService.delete(publicId)
          }
        }
        const url = await CloudinaryService.upload(file.tmpPath, 'gallery_photos')
        image.url = url
      }

      await image.save()

      // If gallery changed, sync counts
      if (oldGaleryId !== payload.galeryId) {
        const oldG = await Galery.findOrFail(oldGaleryId)
        oldG.imgNber = Math.max(0, oldG.imgNber - 1)
        await oldG.save()

        const newG = await Galery.findOrFail(payload.galeryId)
        newG.imgNber = newG.imgNber + 1
        await newG.save()
      }

      session.flash('success', 'Photo mise à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour de la photo.')
    }

    return response.redirect().back()
  }

  public async destroyPhoto({ params, response, session }: HttpContext) {
    const image = await Image.findOrFail(params.id)
    const galeryId = image.galeryId

    try {
      if (image.url) {
        const publicId = CloudinaryService.extractPublicId(image.url)
        if (publicId) {
          await CloudinaryService.delete(publicId)
        }
      }

      await image.delete()

      // Decrement img_nber
      const gallery = await Galery.findOrFail(galeryId)
      gallery.imgNber = Math.max(0, gallery.imgNber - 1)
      await gallery.save()

      session.flash('success', 'Photo supprimée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression de la photo.')
    }

    return response.redirect().back()
  }

  // --- Category CRUD ---

  public async storeCategory({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(catGalleryValidator)

    try {
      await CatGalery.create({ name: payload.name })
      session.flash('success', 'Catégorie créée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création de la catégorie (le nom doit être unique).')
    }

    return response.redirect().back()
  }

  public async updateCategory({ params, request, response, session }: HttpContext) {
    const category = await CatGalery.findOrFail(params.id)
    const payload = await request.validateUsing(catGalleryValidator)

    try {
      category.name = payload.name
      await category.save()
      session.flash('success', 'Catégorie mise à jour avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour de la catégorie.')
    }

    return response.redirect().back()
  }

  public async destroyCategory({ params, response, session }: HttpContext) {
    const category = await CatGalery.findOrFail(params.id)

    try {
      await category.delete()
      session.flash('success', 'Catégorie supprimée avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', 'Impossible de supprimer cette catégorie car elle contient des albums associés.')
    }

    return response.redirect().back()
  }
}
