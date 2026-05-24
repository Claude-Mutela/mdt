import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// Messages d'erreur en français
const messages = {
  'required': 'Le champ {{ field }} est obligatoire.',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères.',
  'number': 'Le champ {{ field }} doit être un nombre.',
  'maxLength': 'Le champ {{ field }} ne doit pas dépasser {{ max }} caractères.',
  'minLength': 'Le champ {{ field }} doit faire au moins {{ min }} caractères.',
  'file.size': 'L’image est trop lourde (max 2Mo).',
  'file.extname': 'L’image doit être au format jpg, png ou webp.',
}

export const ministryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(200),
    description: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    coverImg: vine.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
    badgeColor: vine.string().trim().maxLength(50).optional(),
    tag: vine.string().trim().maxLength(100).optional(),
  })
)

// Appliquer les messages par défaut
ministryValidator.messagesProvider = new SimpleMessagesProvider(messages)
