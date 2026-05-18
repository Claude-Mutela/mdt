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
  'description.required': 'La description courte est obligatoire.',
  'description.minLength': 'La description doit faire au moins {{ min }} caractères.',
  'description.maxLength': 'La description ne doit pas dépasser {{ max }} caractères.',
  'content.required': 'Le contenu complet est obligatoire.',
  'content.minLength': 'Le contenu complet doit faire au moins {{ min }} caractères.',
  'place.minLength': 'Le lieu doit faire au moins {{ min }} caractères.',
  'date.required': 'La date de début est obligatoire.',
  'dateFin.required': 'La date de fin est obligatoire.',
  'catEventId.required': 'Veuillez sélectionner une catégorie d\'événement.',
  'urlImg.required': 'L\'image de couverture est obligatoire.',
  'file.size': 'L’image est trop lourde (max 2Mo).',
  'file.extname': 'L’image doit être au format jpg, png ou webp.',
}

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(10).maxLength(1000),
    content: vine.string().trim().minLength(10),
    place: vine.string().trim().minLength(3).optional(),
    date: vine.date(),
    dateFin: vine.date(),
    status: vine.enum(['a_venir', 'en_cours', 'termine', 'annule']).optional(),
    catEventId: vine.number(),
    urlImg: vine.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }),
  })
)
createEventValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().trim().minLength(10).maxLength(1000),
    content: vine.string().trim().minLength(10),
    place: vine.string().trim().minLength(3).optional(),
    date: vine.date(),
    dateFin: vine.date(),
    status: vine.enum(['a_venir', 'en_cours', 'termine', 'annule']).optional(),
    catEventId: vine.number(),
    urlImg: vine.file({ size: '2mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
  })
)
updateEventValidator.messagesProvider = new SimpleMessagesProvider(messages)

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
