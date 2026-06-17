import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FinanceCategory from '#models/finance_category'
import User from '#models/user'

export default class FinanceOperation extends BaseModel {
  static table = 'finance_operations'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare date: string // Format YYYY-MM-DD

  @column()
  declare montant: number

  @column()
  declare devise: 'USD' | 'CDF' | 'EUR'

  @column()
  declare type: 'entrée' | 'sortie'

  @column()
  declare financeCategoryId: number

  @column()
  declare description: string

  @column()
  declare moyenPaiement:
    | 'espèce'
    | 'chèque'
    | 'virement bancaire'
    | 'mobile money'
    | 'terminal'
    | 'FlexPay'

  @column()
  declare createdBy: number | null

  @column()
  declare tauxCdfUsd: number

  @column()
  declare tauxEurUsd: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => FinanceCategory, { foreignKey: 'financeCategoryId' })
  declare category: BelongsTo<typeof FinanceCategory>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: BelongsTo<typeof User>
}
