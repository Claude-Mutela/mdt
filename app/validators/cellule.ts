import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'minLength': 'Le champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Le champ ne doit pas dépasser {{ max }} caractères.',
  'number': 'La valeur doit être un nombre.',
  'regex': 'Le format de ce champ est invalide.',
  'contact.regex': 'Le numéro doit contenir exactement 10 chiffres (ex: 0812345678).',
  'unique': 'Ce nom est déjà utilisé par une autre cellule.',
}

/**
 * Règle VineJS personnalisée : vérifie l'unicité du nom dans `cellules`.
 * En mode édition, la cellule courante (meta.celluleId) est ignorée
 * pour permettre la sauvegarde sans changer le nom.
 */
const isUniqueCelluleName = vine.createRule(
  async (value: unknown, _options: unknown, field: FieldContext) => {
    if (typeof value !== 'string') return

    const celluleId = (field.meta as { celluleId?: number }).celluleId

    const query = db.from('cellules').whereILike('name', value.trim())

    // En update, on ignore l'id de la cellule en cours d'édition
    if (celluleId) {
      query.whereNot('id', celluleId)
    }

    const exists = await query.first()
    if (exists) {
      field.report('Ce nom est déjà utilisé par une autre cellule.', 'unique', field)
    }
  }
)

/**
 * Validator unique pour create ET update.
 * - Create : pas de meta  → vérifie l'unicité globale
 * - Update : meta.celluleId → exclut la cellule courante de la vérification
 */
export const celluleValidator = vine
  .withMetaData<{ celluleId?: number }>()
  .compile(
    vine.object({
      name: vine.string().trim().minLength(2).maxLength(100).use(isUniqueCelluleName({})),
      description: vine.string().trim().maxLength(500),
      horaire: vine.string().trim().maxLength(200),
      adresse: vine.string().trim().maxLength(300),
      contact: vine.string().trim().regex(/^[0-9]{10}$/),
      responsableId: vine.number().nullable(),
    })
  )

celluleValidator.messagesProvider = new SimpleMessagesProvider(messages)
