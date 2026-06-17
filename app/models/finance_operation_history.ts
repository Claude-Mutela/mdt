import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class FinanceOperationHistory extends BaseModel {
  static table = 'finance_operations_history'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare operationId: number

  @column()
  declare action: 'CREATE' | 'UPDATE' | 'DELETE'

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare oldValues: any

  @column({
    prepare: (value) => (value ? JSON.stringify(value) : null),
    consume: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }
      return value
    },
  })
  declare newValues: any

  @column()
  declare changedBy: number | null

  @column.dateTime({ autoCreate: true })
  declare changedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'changedBy' })
  declare user: BelongsTo<typeof User>
}
