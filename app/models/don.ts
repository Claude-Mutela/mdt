import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CatDon from '#models/cat_don'
import DonHistory from '#models/don_history'

export default class Don extends BaseModel {
  static table = 'dons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare amount: number

  @column.date()
  declare date: DateTime

  @column()
  declare status: 'en_attente' | 'confirme' | 'rejete' | 'rembourse'

  @column()
  declare donateur: string | null

  @column()
  declare catDonId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CatDon)
  declare catDon: BelongsTo<typeof CatDon>

  @hasMany(() => DonHistory)
  declare histories: HasMany<typeof DonHistory>
}
