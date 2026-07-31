import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'minLength': 'Le champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Le champ ne doit pas dépasser {{ max }} caractères.',
  'enum': 'La valeur sélectionnée est invalide.',
  'unique': 'Cette nature d\'opération existe déjà pour ce type de flux.',
}

/**
 * Règle personnalisée pour vérifier l'unicité de la catégorie pour un type donné.
 */
const isUniqueCategoryName = vine.createRule(
  async (value: unknown, _options: unknown, field: FieldContext) => {
    if (typeof value !== 'string') return

    const categoryId = (field.meta as { categoryId?: number }).categoryId
    const type = (field.data as { type?: 'entrée' | 'sortie' }).type

    if (!type) return

    const query = db
      .from('finance_categories')
      .whereILike('name', value.trim())
      .where('type', type)

    // En mise à jour, on ignore la catégorie en cours d'édition
    if (categoryId) {
      query.whereNot('id', categoryId)
    }

    const exists = await query.first()
    if (exists) {
      field.report(
        'Cette nature d\'opération existe déjà pour ce type de flux.',
        'unique',
        field
      )
    }
  }
)

export const financeCategoryValidator = vine
  .withMetaData<{ categoryId?: number }>()
  .compile(
    vine.object({
      name: vine.string().trim().minLength(2).maxLength(100).use(isUniqueCategoryName({})),
      type: vine.enum(['entrée', 'sortie']),
    })
  )

financeCategoryValidator.messagesProvider = new SimpleMessagesProvider(messages)
