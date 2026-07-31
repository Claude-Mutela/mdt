import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Member from '#models/member'

export default class Cellule extends BaseModel {
  static table = 'cellules'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare horaire: string | null

  @column()
  declare adresse: string | null

  @column()
  declare contact: string | null

  @column()
  declare responsableId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Member, { foreignKey: 'responsableId' })
  declare responsable: BelongsTo<typeof Member>
}
