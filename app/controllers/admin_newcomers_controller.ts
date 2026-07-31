import type { HttpContext } from '@adonisjs/core/http'
import Newcomer from '#models/newcomer'
import { newcomerValidator } from '#validators/newcomer'
import { DateTime } from 'luxon'

export default class AdminNewcomersController {
  /**
   * Afficher la liste des nouveaux venus
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search')
    const month = request.input('month') // 1-12
    const year = request.input('year') // YYYY

    const query = Newcomer.query().orderBy('date', 'desc')

    if (search) {
      query.where((q) => {
        q.where('firstname', 'like', `%${search}%`)
          .orWhere('lastname', 'like', `%${search}%`)
          .orWhere('phone', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('city', 'like', `%${search}%`)
          .orWhere('profession', 'like', `%${search}%`)
      })
    }

    if (year) {
      if (month) {
        const start = DateTime.fromObject({ year: Number(year), month: Number(month), day: 1 }).startOf('month')
        const end = start.endOf('month')
        query.whereBetween('date', [start.toSQLDate()!, end.toSQLDate()!])
      } else {
        const start = DateTime.fromObject({ year: Number(year), month: 1, day: 1 }).startOf('year')
        const end = start.endOf('year')
        query.whereBetween('date', [start.toSQLDate()!, end.toSQLDate()!])
      }
    }

    const newcomers = await query.paginate(page, 15)

    // Récupérer toutes les années disponibles pour le filtre
    const allDates = await Newcomer.query().select('date')
    const availableYears = Array.from(new Set(allDates.map(n => n.date.year))).sort((a, b) => b - a)
    if (availableYears.length === 0) {
      availableYears.push(DateTime.now().year)
    }

    return inertia.render('admin/nouveaux-venus' as any, {
      newcomers,
      availableYears,
      filters: { search, month, year }
    })
  }

  /**
   * Vue pour l'impression des nouveaux venus
   */
  async print({ inertia, request }: HttpContext) {
    const search = request.input('search')
    const month = request.input('month')
    const year = request.input('year')

    const query = Newcomer.query().orderBy('date', 'desc')

    if (search) {
      query.where((q) => {
        q.where('firstname', 'like', `%${search}%`)
          .orWhere('lastname', 'like', `%${search}%`)
          .orWhere('phone', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('city', 'like', `%${search}%`)
          .orWhere('profession', 'like', `%${search}%`)
      })
    }

    let filterTitle = "Liste globale des nouveaux venus"

    if (year) {
      const MOIS_FR_LONG = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ]
      if (month) {
        const start = DateTime.fromObject({ year: Number(year), month: Number(month), day: 1 }).startOf('month')
        const end = start.endOf('month')
        query.whereBetween('date', [start.toSQLDate()!, end.toSQLDate()!])
        filterTitle = `Nouveaux venus — ${MOIS_FR_LONG[Number(month) - 1]} ${year}`
      } else {
        const start = DateTime.fromObject({ year: Number(year), month: 1, day: 1 }).startOf('year')
        const end = start.endOf('year')
        query.whereBetween('date', [start.toSQLDate()!, end.toSQLDate()!])
        filterTitle = `Nouveaux venus — Année ${year}`
      }
    }

    const newcomers = await query.exec()

    return inertia.render('admin/nouveaux_venus_print' as any, {
      newcomers: newcomers.map(n => ({
        id: n.id,
        date: n.date.toISODate(),
        firstname: n.firstname,
        lastname: n.lastname,
        gender: n.gender,
        phone: n.phone,
        email: n.email,
        profession: n.profession,
        maritalStatus: n.maritalStatus,
        city: n.city,
        address: n.address,
        heardAbout: n.heardAbout,
        comeBack: n.comeBack,
        baptized: n.baptized,
        spiritualFollowup: n.spiritualFollowup,
        receiveJesus: n.receiveJesus,
        joinCell: n.joinCell,
        serve: n.serve,
        suggestions: n.suggestions
      })),
      filterTitle,
      printDate: DateTime.now().setLocale('fr').toFormat('dd MMMM yyyy')
    })
  }

  /**
   * Créer un nouveau venu
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(newcomerValidator)

    try {
      const newcomer = new Newcomer()
      newcomer.fill({
        lastname: data.lastname,
        firstname: data.firstname,
        gender: data.gender,
        phone: data.phone || null,
        email: data.email || null,
        profession: data.profession || null,
        maritalStatus: data.maritalStatus || null,
        city: data.city || null,
        address: data.address || null,
        heardAbout: data.heardAbout,
        comeBack: data.comeBack,
        baptized: data.baptized,
        spiritualFollowup: data.spiritualFollowup,
        receiveJesus: data.receiveJesus,
        joinCell: data.joinCell,
        serve: data.serve,
        suggestions: data.suggestions || null,
      })

      if (data.date) {
        newcomer.date = DateTime.fromISO(data.date)
      } else {
        newcomer.date = DateTime.now()
      }

      await newcomer.save()
      session.flash('success', 'Nouveau venu enregistré avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de l'enregistrement.")
    }

    return response.redirect().back()
  }

  /**
   * Modifier un nouveau venu
   */
  async update({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(newcomerValidator)

    try {
      const newcomer = await Newcomer.findOrFail(params.id)
      newcomer.merge({
        lastname: data.lastname,
        firstname: data.firstname,
        gender: data.gender,
        phone: data.phone || null,
        email: data.email || null,
        profession: data.profession || null,
        maritalStatus: data.maritalStatus || null,
        city: data.city || null,
        address: data.address || null,
        heardAbout: data.heardAbout,
        comeBack: data.comeBack,
        baptized: data.baptized,
        spiritualFollowup: data.spiritualFollowup,
        receiveJesus: data.receiveJesus,
        joinCell: data.joinCell,
        serve: data.serve,
        suggestions: data.suggestions || null,
      })

      if (data.date) {
        newcomer.date = DateTime.fromISO(data.date)
      }

      await newcomer.save()
      session.flash('success', 'Nouveau venu modifié avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la modification.")
    }

    return response.redirect().back()
  }

  /**
   * Supprimer un nouveau venu
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const newcomer = await Newcomer.findOrFail(params.id)
      await newcomer.delete()
      session.flash('success', 'Nouveau venu supprimé avec succès.')
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la suppression.")
    }

    return response.redirect().back()
  }
}
