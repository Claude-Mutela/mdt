import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CatMedia from '#models/cat_media'

export default class Media extends BaseModel {
  static table = 'media'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare format: 'audio' | 'video' | 'texte' | 'podcast'

  @column()
  declare file: string | null

  @column()
  declare urlFile: string | null

  @column()
  declare orateur: string | null

  @column()
  declare duration: number | null // secondes

  @column.date()
  declare date: DateTime | null

  @column()
  declare catMediaId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CatMedia)
  declare catMedia: BelongsTo<typeof CatMedia>
}
