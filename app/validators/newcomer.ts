import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'email': 'L’adresse email n’est pas valide (ex: nom@domaine.com).',
  'enum': 'La valeur sélectionnée n’est pas valide.',
  'minLength': 'Le champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Le champ ne doit pas dépasser {{ max }} caractères.',
  'boolean': 'La valeur doit être un booléen.',
  'phone.minLength': 'Le numéro de téléphone doit contenir exactement 10 caractères.',
  'phone.maxLength': 'Le numéro de téléphone doit contenir exactement 10 caractères.',
}

export const newcomerValidator = vine.compile(
  vine.object({
    date: vine.string().trim(),
    lastname: vine.string().trim().minLength(2).maxLength(100),
    firstname: vine.string().trim().minLength(2).maxLength(100),
    gender: vine.enum(['M', 'F'] as const),
    phone: vine.string().trim().minLength(10).maxLength(10).nullable().optional(),
    email: vine.string().trim().email().nullable().optional(),
    profession: vine.string().trim().maxLength(150).nullable().optional(),
    maritalStatus: vine.string().trim().maxLength(50).nullable().optional(),
    city: vine.string().trim().maxLength(100).nullable().optional(),
    address: vine.string().trim().nullable().optional(),
    heardAbout: vine.string().trim().maxLength(100),
    comeBack: vine.boolean(),
    baptized: vine.boolean(),
    spiritualFollowup: vine.boolean(),
    receiveJesus: vine.boolean(),
    joinCell: vine.boolean(),
    serve: vine.boolean(),
    suggestions: vine.string().trim().nullable().optional(),
  })
)

newcomerValidator.messagesProvider = new SimpleMessagesProvider(messages)
