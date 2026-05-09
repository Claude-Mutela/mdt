import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ministry from '#models/ministry'
import User from '#models/user'

export default class Member extends BaseModel {
  static table = 'members'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare email: string | null

  @column()
  declare coverImg: string | null

  @column()
  declare phone: string | null

  @column()
  declare gender: 'M' | 'F' | null

  @column.date()
  declare dateIntegration: DateTime | null

  @column()
  declare statut: 'actif' | 'inactif'

  @column()
  declare typeMember: 'responsable' | 'membre' | 'visiteur' | null

  @column()
  declare ministryId: number | null

  @column()
  declare userId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Ministry)
  declare ministry: BelongsTo<typeof Ministry>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
