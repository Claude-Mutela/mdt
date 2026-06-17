import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import FinanceOperation from '#models/finance_operation'

export default class FinanceCategory extends BaseModel {
  static table = 'finance_categories'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: 'entrée' | 'sortie'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => FinanceOperation, { foreignKey: 'financeCategoryId' })
  declare operations: HasMany<typeof FinanceOperation>
}
