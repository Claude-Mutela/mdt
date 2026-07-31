import { column, BaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

/**
 * Modèle ORM Lucid représentant une inscription à la Newsletter.
 */
export default class Newsletter extends BaseModel {
  /** Identifiant unique */
  @column({ isPrimary: true })
  declare id: number

  /** Adresse e-mail de l'abonné */
  @column()
  declare email: string

  /** Jeton unique d'activation transmis par e-mail */
  @column()
  declare token: string | null

  /** Statut de l'abonnement : 'en_attente' | 'actif' */
  @column()
  declare status: 'en_attente' | 'actif'

  /** Date et heure de confirmation de l'abonnement */
  @column.dateTime()
  declare confirmedAt: DateTime | null

  /** Date de création du compte d'abonnement */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /** Date de dernière modification */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
