import type { HttpContext } from '@adonisjs/core/http'
import FinanceCategory from '#models/finance_category'
import FinanceOperation from '#models/finance_operation'
import FinanceOperationHistory from '#models/finance_operation_history'
import ExchangeRate from '#models/exchange_rate'
import { financeCategoryValidator } from '#validators/finance_category'
import { financeOperationValidator } from '#validators/finance_operation'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

// // Catégories par défaut à insérer si la base est vide (Auto-seeding)
// const DEFAULT_CATEGORIES = [
//   { name: 'Donation', type: 'entrée' as const },
//   { name: 'Dîme', type: 'entrée' as const },
//   { name: 'Action de grâce', type: 'entrée' as const },
//   { name: 'Offrande', type: 'entrée' as const },
//   { name: 'Partenariat', type: 'entrée' as const },
//   { name: 'Autre entrée', type: 'entrée' as const },
//   { name: 'Loyer', type: 'sortie' as const },
//   { name: 'Électricité', type: 'sortie' as const },
//   { name: 'Achat matériel', type: 'sortie' as const },
//   { name: 'Transports', type: 'sortie' as const },
//   { name: 'Salaires / Soutiens', type: 'sortie' as const },
//   { name: 'Événementiel', type: 'sortie' as const },
//   { name: 'Social / Entraide', type: 'sortie' as const },
//   { name: 'Autre dépense', type: 'sortie' as const },
// ]

/**
 * Récupère le taux de change pour une devise source et une date données.
 * Recherche en priorité le taux exact de ce jour.
 * S'il n'existe pas, cherche le taux enregistré à la date la plus proche dans le passé.
 * Sinon, cherche le premier taux disponible dans le futur.
 * Sinon, retourne un taux par défaut.
 */
async function getExchangeRateForDate(deviseSource: string, date: string, trx?: any): Promise<number> {
  const query = ExchangeRate.query()

  if (trx) {
    query.useTransaction(trx)
  }

  const rateRecord = await query
    .where('deviseSource', deviseSource)
    .where('date', '<=', date)
    .orderBy('date', 'desc')
    .first()

  if (rateRecord) {
    return Number(rateRecord.taux)
  }

  // Fallback 1: Si aucun taux n'est disponible avant/à cette date, on cherche le plus ancien dans le futur
  const queryFuture = ExchangeRate.query()

  if (trx) {
    queryFuture.useTransaction(trx)
  }

  const futureRecord = await queryFuture
    .where('deviseSource', deviseSource)
    .orderBy('date', 'asc')
    .first()

  if (futureRecord) {
    return Number(futureRecord.taux)
  }

  // Fallback 2: Taux constants absolus si la table est vide
  return deviseSource === 'CDF' ? 2800.0 : 1.08
}

export default class AdminFinancesController {
  /**
   * GET /admin/finances
   * Charge le tableau de bord financier.
   */
  async index({ inertia }: HttpContext) {
    const todayStr = DateTime.now().toISODate()!

    // // 1. Auto-seeding si la base de données est vide
    // const categoryCount = await FinanceCategory.query().count('* as total')
    // if (Number(categoryCount[0].$extras.total) === 0) {
    //   await FinanceCategory.createMany(DEFAULT_CATEGORIES)
    // }

    const ratesCount = await ExchangeRate.query().count('* as total')
    if (Number(ratesCount[0].$extras.total) === 0) {
      await ExchangeRate.createMany([
        { date: todayStr, deviseSource: 'CDF', deviseCible: 'USD', taux: 2800.0 },
        { date: todayStr, deviseSource: 'EUR', deviseCible: 'USD', taux: 1.08 },
      ])
    }

    // 2. Récupération des données
    const [operationsList, dbCategories] = await Promise.all([
      FinanceOperation.query()
        .preload('category')
        .preload('creator', (q) => q.select('id', 'firstname', 'lastname'))
        .orderBy('date', 'desc')
        .orderBy('id', 'desc'),
      FinanceCategory.query().orderBy('name', 'asc'),
    ])

    // 3. Récupération des taux journaliers pour l'affichage (taux d'aujourd'hui par défaut)
    const [cdfRate, eurRate] = await Promise.all([
      getExchangeRateForDate('CDF', todayStr),
      getExchangeRateForDate('EUR', todayStr),
    ])

    const exchangeRates = {
      CDF: cdfRate,
      EUR: eurRate,
    }

    // 4. Transformation pour compatibilité exacte avec le frontend
    // IMPORTANT: SQLite retourne la colonne `date` comme un objet Date JS (pas une string).
    // On utilise les parts locales (getFullYear etc.) et NON toISOString() qui est UTC
    // et pourrait décaler d'un jour si le serveur est en timezone +02:00.
    const formatDateLocal = (d: any): string => {
      const obj = d instanceof Date ? d : new Date(String(d))
      const y = obj.getFullYear()
      const m = String(obj.getMonth() + 1).padStart(2, '0')
      const day = String(obj.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const operations = operationsList.map((op) => ({
      id: op.id,
      date: formatDateLocal(op.date),
      montant: Number(op.montant),
      devise: op.devise,
      type: op.type,
      categorie: op.category.name,
      description: op.description,
      moyen_paiement: op.moyenPaiement,
    }))

    return inertia.render('admin/finances' as any, {
      operations,
      categories: dbCategories,
      exchangeRates,
    })
  }

  /**
   * POST /admin/finances/operations
   * Enregistre un nouveau flux financier avec les taux de la date sélectionnée.
   */
  async store({ request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(financeOperationValidator)
    const user = auth.user!

    const trx = await db.transaction()

    try {
      // Récupération des taux correspondants à la date de l'opération
      const [cdfRate, eurRate] = await Promise.all([
        getExchangeRateForDate('CDF', data.date, trx),
        getExchangeRateForDate('EUR', data.date, trx),
      ])

      // Création de l'opération
      const operation = new FinanceOperation()
      operation.useTransaction(trx)
      operation.fill({
        date: data.date,
        montant: data.montant,
        devise: data.devise,
        type: data.type,
        financeCategoryId: data.financeCategoryId,
        description: data.description,
        moyenPaiement: data.moyenPaiement,
        createdBy: user.id,
        tauxCdfUsd: cdfRate,
        tauxEurUsd: eurRate,
      })
      await operation.save()

      // Enregistrement de l'historique d'audit (Option A)
      const history = new FinanceOperationHistory()
      history.useTransaction(trx)
      history.fill({
        operationId: operation.id,
        action: 'CREATE',
        newValues: operation.toJSON(),
        changedBy: user.id,
      })
      await history.save()

      await trx.commit()
      session.flash('success', 'Opération financière enregistrée avec succès.')
    } catch (error) {
      await trx.rollback()
      console.error(error)
      session.flash('error', "Erreur lors de l'enregistrement de l'opération.")
    }

    return response.redirect().back()
  }

  /**
   * PUT /admin/finances/operations/:id
   * Modifie une opération existante (et recalcule les taux si la date change).
   */
  async update({ params, request, response, session, auth }: HttpContext) {
    const data = await request.validateUsing(financeOperationValidator)
    const user = auth.user!

    const trx = await db.transaction()

    try {
      const operation = await FinanceOperation.findOrFail(params.id, { client: trx })
      const oldValues = operation.toJSON()

      // Récupération des taux correspondants à la nouvelle date de l'opération
      const [cdfRate, eurRate] = await Promise.all([
        getExchangeRateForDate('CDF', data.date, trx),
        getExchangeRateForDate('EUR', data.date, trx),
      ])

      // Mise à jour de l'opération avec les nouveaux taux figés correspondants à la date
      operation.merge({
        date: data.date,
        montant: data.montant,
        devise: data.devise,
        type: data.type,
        financeCategoryId: data.financeCategoryId,
        description: data.description,
        moyenPaiement: data.moyenPaiement,
        tauxCdfUsd: cdfRate,
        tauxEurUsd: eurRate,
      })
      await operation.save()

      // Enregistrement de l'historique d'audit (Option A)
      const history = new FinanceOperationHistory()
      history.useTransaction(trx)
      history.fill({
        operationId: operation.id,
        action: 'UPDATE',
        oldValues,
        newValues: operation.toJSON(),
        changedBy: user.id,
      })
      await history.save()

      await trx.commit()
      session.flash('success', 'Opération financière modifiée avec succès.')
    } catch (error) {
      await trx.rollback()
      console.error(error)
      session.flash('error', "Erreur lors de la modification de l'opération.")
    }

    return response.redirect().back()
  }

  /**
   * DELETE /admin/finances/operations/:id
   * Supprime définitivement une opération.
   */
  async destroy({ params, response, session, auth }: HttpContext) {
    const user = auth.user!
    const trx = await db.transaction()

    try {
      const operation = await FinanceOperation.findOrFail(params.id, { client: trx })
      const oldValues = operation.toJSON()

      await operation.delete()

      // Log d'audit de la suppression
      const history = new FinanceOperationHistory()
      history.useTransaction(trx)
      history.fill({
        operationId: params.id,
        action: 'DELETE',
        oldValues,
        changedBy: user.id,
      })
      await history.save()

      await trx.commit()
      session.flash('success', 'Opération supprimée avec succès.')
    } catch (error) {
      await trx.rollback()
      console.error(error)
      session.flash('error', "Erreur lors de la suppression de l'opération.")
    }

    return response.redirect().back()
  }

  /**
   * POST /admin/finances/categories
   * Crée une nouvelle catégorie financière.
   */
  async storeCategory({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(financeCategoryValidator, { meta: {} })

    try {
      await FinanceCategory.create({
        name: data.name,
        type: data.type,
      })
      session.flash('success', "Nature d'opération créée avec succès.")
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la création de la catégorie.')
    }

    return response.redirect().back()
  }

  /**
   * PUT /admin/finances/categories/:id
   * Met à jour une catégorie financière existante.
   */
  async updateCategory({ params, request, response, session }: HttpContext) {
    const data = await request.validateUsing(financeCategoryValidator, {
      meta: { categoryId: Number(params.id) },
    })

    try {
      const category = await FinanceCategory.findOrFail(params.id)
      category.merge({
        name: data.name,
        type: data.type,
      })
      await category.save()
      session.flash('success', "Nature d'opération modifiée avec succès.")
    } catch (error) {
      console.error(error)
      session.flash('error', "Erreur lors de la modification de la nature d'opération.")
    }

    return response.redirect().back()
  }

  /**
   * DELETE /admin/finances/categories/:id
   * Supprime une catégorie financière.
   */
  async destroyCategory({ params, response, session }: HttpContext) {
    try {
      const category = await FinanceCategory.findOrFail(params.id)
      await category.delete()
      session.flash('success', "Nature d'opération supprimée avec succès.")
    } catch (error) {
      console.error(error)
      session.flash(
        'error',
        'Impossible de supprimer cette catégorie car elle est associée à des transactions existantes.'
      )
    }

    return response.redirect().back()
  }

  /**
   * POST /admin/finances/rates
   * Met à jour ou crée le taux de change pour aujourd'hui (taux journalier).
   */
  async updateRates({ request, response, session }: HttpContext) {
    const ratesData = request.only(['CDF', 'EUR'])
    const todayStr = DateTime.now().toISODate()!

    const trx = await db.transaction()

    try {
      if (ratesData.CDF !== undefined) {
        const cdfRate = await ExchangeRate.query({ client: trx })
          .where('deviseSource', 'CDF')
          .where('date', todayStr)
          .first()

        if (cdfRate) {
          cdfRate.taux = Number(ratesData.CDF)
          await cdfRate.save()
        } else {
          await ExchangeRate.create(
            {
              date: todayStr,
              deviseSource: 'CDF',
              deviseCible: 'USD',
              taux: Number(ratesData.CDF),
            },
            { client: trx }
          )
        }
      }

      if (ratesData.EUR !== undefined) {
        const eurRate = await ExchangeRate.query({ client: trx })
          .where('deviseSource', 'EUR')
          .where('date', todayStr)
          .first()

        if (eurRate) {
          eurRate.taux = Number(ratesData.EUR)
          await eurRate.save()
        } else {
          await ExchangeRate.create(
            {
              date: todayStr,
              deviseSource: 'EUR',
              deviseCible: 'USD',
              taux: Number(ratesData.EUR),
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
      session.flash('success', 'Taux de change journaliers mis à jour avec succès.')
    } catch (error) {
      await trx.rollback()
      console.error(error)
      session.flash('error', 'Erreur lors de la mise à jour des taux de change.')
    }

    return response.redirect().back()
  }
}
