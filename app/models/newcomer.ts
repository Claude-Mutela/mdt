import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Newcomer extends BaseModel {
  static table = 'newcomers'

  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare date: DateTime

  @column()
  declare lastname: string

  @column()
  declare firstname: string

  @column()
  declare gender: 'M' | 'F'

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare profession: string | null

  @column({ columnName: 'marital_status' })
  declare maritalStatus: string | null

  @column()
  declare city: string | null

  @column()
  declare address: string | null

  @column({ columnName: 'heard_about' })
  declare heardAbout: string

  @column({ columnName: 'come_back' })
  declare comeBack: boolean

  @column()
  declare baptized: boolean

  @column({ columnName: 'spiritual_followup' })
  declare spiritualFollowup: boolean

  @column({ columnName: 'receive_jesus' })
  declare receiveJesus: boolean

  @column({ columnName: 'join_cell' })
  declare joinCell: boolean

  @column()
  declare serve: boolean

  @column()
  declare suggestions: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
