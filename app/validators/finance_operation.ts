import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'number': 'La valeur doit être un nombre valide.',
  'positive': 'Le montant doit être supérieur à 0.',
  'enum': 'La valeur sélectionnée est invalide.',
  'regex': 'Le format est invalide.',
  'date.regex': 'Le format de la date doit être AAAA-MM-JJ.',
}

export const financeOperationValidator = vine.compile(
  vine.object({
    date: vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    montant: vine.number().positive(),
    devise: vine.enum(['USD', 'CDF', 'EUR']),
    type: vine.enum(['entrée', 'sortie']),
    financeCategoryId: vine.number(),
    description: vine.string().trim().minLength(3).maxLength(1000),
    moyenPaiement: vine.enum([
      'espèce',
      'chèque',
      'virement bancaire',
      'mobile money',
      'terminal',
      'FlexPay',
    ]),
  })
)

financeOperationValidator.messagesProvider = new SimpleMessagesProvider(messages)
