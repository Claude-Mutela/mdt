import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ministry from '#models/ministry'

export default class CatMinistry extends BaseModel {
  static table = 'cat_ministries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare catMinName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Ministry)
  declare ministries: HasMany<typeof Ministry>
}
