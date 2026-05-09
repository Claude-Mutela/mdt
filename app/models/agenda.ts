import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatActivity from '#models/cat_activity'

export default class Agenda extends BaseModel {
  static table = 'agenda'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare day: DateTime

  @column()
  declare title: string

  @column()
  declare hourStart: string | null

  @column()
  declare hourEnd: string | null

  @column()
  declare place: string | null

  @column()
  declare catActivityId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CatActivity)
  declare catActivity: BelongsTo<typeof CatActivity>
}
