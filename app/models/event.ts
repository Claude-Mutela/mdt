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
}
