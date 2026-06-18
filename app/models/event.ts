import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatEvent from '#models/cat_event'

export default class Event extends BaseModel {
  static table = 'events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string | null

  @column()
  declare urlImg: string | null

  @column()
  declare description: string | null

  @column()
  declare content: string | null

  @column()
  declare place: string | null

  @column.date()
  declare date: DateTime | null

  @column.date({ columnName: 'date_fin' })
  declare dateFin: DateTime | null

  @column({ columnName: 'start_time' })
  declare startTime: string | null

  @column({ columnName: 'end_time' })
  declare endTime: string | null

  @column()
  declare status: 'a_venir' | 'en_cours' | 'termine' | 'annule'

  @column()
  declare catEventId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CatEvent)
  declare catEvent: BelongsTo<typeof CatEvent>

  /**
   * Synchronise les statuts des événements en base de données en fonction de la date courante.
   */
  public static async syncStatuses() {
    const today = DateTime.now().toSQLDate()!

    // 1. Passer à 'termine' les événements dont la date de fin (ou date) est passée
    await this.query()
      .whereNot('status', 'annule')
      .whereNot('status', 'termine')
      .andWhere(q => {
        q.whereNotNull('date_fin')
          .andWhere('date_fin', '<', today)
          .orWhere(q2 => q2.whereNull('date_fin').andWhere('date', '<', today))
      })
      .update({ status: 'termine' })

    // 2. Passer à 'en_cours' les événements qui ont commencé et ne sont pas encore terminés
    await this.query()
      .where('status', 'a_venir')
      .andWhere('date', '<=', today)
      .andWhere(q => {
        q.whereNull('date_fin').orWhere('date_fin', '>=', today)
      })
      .update({ status: 'en_cours' })
  }
}
