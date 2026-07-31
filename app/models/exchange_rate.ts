import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ExchangeRate extends BaseModel {
  static table = 'exchange_rates'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare date: string // Format YYYY-MM-DD

  @column()
  declare deviseSource: string

  @column()
  declare deviseCible: string

  @column()
  declare taux: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
