import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Galery from '#models/galery'

export default class Image extends BaseModel {
  static table = 'images'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string | null

  @column()
  declare url: string

  @column.date()
  declare date: DateTime | null

  @column()
  declare galeryId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Galery)
  declare galery: BelongsTo<typeof Galery>
}
