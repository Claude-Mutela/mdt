import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'finance_operations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('date').notNullable()
      table.decimal('montant', 15, 2).notNullable()
      table.enum('devise', ['USD', 'CDF', 'EUR']).notNullable().defaultTo('USD')
      table.enum('type', ['entrée', 'sortie']).notNullable()
      
      // Clé étrangère vers la catégorie (nature d'opération)
      table
        .integer('finance_category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('finance_categories')
        .onDelete('RESTRICT') // Empêche de supprimer une catégorie utilisée

      table.text('description').notNullable()
      table.enum('moyen_paiement', [
        'espèce',
        'chèque',
        'virement bancaire',
        'mobile money',
        'terminal',
        'FlexPay',
        'Autres'
      ]).notNullable()

      // Trace de l'auteur de l'opération
      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      // Taux de change gelés au moment de l'opération
      table.decimal('taux_cdf_usd', 12, 4).notNullable().defaultTo(2400.0000)
      table.decimal('taux_eur_usd', 12, 4).notNullable().defaultTo(1.0800)

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()

      // Index pour optimiser les performances des requêtes analytiques
      table.index(['date', 'type', 'devise'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
