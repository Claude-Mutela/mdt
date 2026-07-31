import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Colonnes firstname, lastname, status et role ont été intégrées
 * directement dans 1761885935168_create_users_table.ts
 * Cette migration est conservée vide pour ne pas casser l'historique.
 */
export default class extends BaseSchema {
  async up() {}
  async down() {}
}
