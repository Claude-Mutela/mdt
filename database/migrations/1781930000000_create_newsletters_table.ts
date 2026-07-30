import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Migration de création de la table 'newsletters'.
 * Stocke les abonnements à la newsletter avec le système de Double Opt-in.
 */
export default class extends BaseSchema {
  protected tableName = 'newsletters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      // Adresse e-mail de l'abonné (unique)
      table.string('email').notNullable().unique()
      
      // Jeton d'activation unique généré lors de la demande (nul une fois confirmé)
      table.string('token', 64).nullable()
      
      // Statut de l'abonnement : 'en_attente' par défaut, passe à 'actif' lors du clic sur l'e-mail
      table.enum('status', ['en_attente', 'actif']).defaultTo('en_attente')
      
      // Date et heure à laquelle l'abonné a confirmé son inscription
      table.datetime('confirmed_at').nullable()
      
      // Horodatages système de création et mise à jour
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
