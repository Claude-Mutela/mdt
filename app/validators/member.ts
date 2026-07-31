import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'email': 'L’adresse email n’est pas valide (ex: nom@domaine.com).',
  'enum': 'La valeur sélectionnée n’est pas valide.',
  'minLength': 'Le champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Le champ ne doit pas dépasser {{ max }} caractères.',
  'number': 'La valeur doit être un nombre.',
  'file.size': 'L’image est trop lourde (max 2Mo).',
  'file.extname': 'L’image doit être au format jpg, png ou webp.',
}

export const memberValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().minLength(2).maxLength(50),
    lastname: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().trim().email().nullable().optional(),
    phone: vine.string().trim().maxLength(10).nullable(),
    gender: vine.enum(['M', 'F'] as const).nullable(),
    dateIntegration: vine.string().nullable().optional(),
    statut: vine.enum(['actif', 'inactif'] as const),
    typeMember: vine.enum(['responsable', 'membre', 'visiteur'] as const).optional(),
    ministryId: vine.number().optional(),
    userId: vine.number().optional(),
    coverImg: vine.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
  })
)


memberValidator.messagesProvider = new SimpleMessagesProvider(messages)

