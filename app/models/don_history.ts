import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Don from '#models/don'
import User from '#models/user'

export default class DonHistory extends BaseModel {
  static table = 'don_histories'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donId: number

  @column()
  declare userId: number

  @column()
  declare status: 'soumis' | 'valide' | 'rejete' | 'modifie'

  @column()
  declare note: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Don)
  declare don: BelongsTo<typeof Don>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
