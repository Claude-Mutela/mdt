import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Member from '#models/member'

export default class Ministry extends BaseModel {
  static table = 'ministries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare content: string | null

  @column()
  declare coverImg: string | null

  @column()
  declare urlImg: string | null

  @column()
  declare badgeColor: string | null

  @column()
  declare tag: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Member)
  declare members: HasMany<typeof Member>
}
