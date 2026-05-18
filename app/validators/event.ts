import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'Ce champ doit être une chaîne de caractères.',
  'number': 'Ce champ doit être un nombre.',
  'date': 'La date fournie est invalide.',
  'enum': 'La valeur sélectionnée est invalide.',
  'minLength': 'Ce champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Ce champ ne doit pas dépasser {{ max }} caractères.',
  'name.required': 'Le titre de l\'événement est obligatoire.',
  'name.minLength': 'Le titre doit faire au moins {{ min }} caractères.',
  'description.minLength': 'La description doit faire au moins {{ min }} caractères.',
  'description.maxLength': 'La description ne doit pas dépasser {{ max }} caractères.',
  'place.minLength': 'Le lieu doit faire au moins {{ min }} caractères.',
  'catEventId.required': 'Veuillez sélectionner une catégorie d\'événement.',
}

export const eventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(10).maxLength(1000).optional(),
    content: vine.string().trim().optional(),
    place: vine.string().trim().minLength(3).optional(),
    date: vine.date().optional(),
    status: vine.enum(['a_venir', 'en_cours', 'termine', 'annule']),
    catEventId: vine.number()
  })
)
eventValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const catEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2)
  })
)
catEventValidator.messagesProvider = new SimpleMessagesProvider({
  'required': 'Le nom de la catégorie est obligatoire.',
  'name.required': 'Le nom de la catégorie est obligatoire.',
  'name.minLength': 'Le nom de la catégorie doit faire au moins {{ min }} caractères.',
})
