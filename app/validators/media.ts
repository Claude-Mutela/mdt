import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'Ce champ doit être une chaîne de caractères.',
  'number': 'Ce champ doit être un nombre.',
  'date': 'La date fournie est invalide.',
  'enum': 'Le format sélectionné est invalide.',
  'minLength': 'Ce champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Ce champ ne doit pas dépasser {{ max }} caractères.',
  'title.required': 'Le titre du média est obligatoire.',
  'title.minLength': 'Le titre doit faire au moins {{ min }} caractères.',
  'format.required': 'Le format du média est obligatoire.',
  'catMediaId.required': 'Veuillez sélectionner une catégorie.',
  'file.size': 'Le fichier est trop lourd (max 10Mo).',
}

export const createMediaValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300),
    format: vine.enum(['audio', 'video', 'texte', 'podcast']),
    orateur: vine.string().trim().maxLength(200).optional(),
    duration: vine.number().min(0).optional(),
    date: vine.date().optional(),
    catMediaId: vine.number(),
    urlFile: vine.string().trim().maxLength(500).optional(),
    file: vine.file({ size: '10mb', extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp3', 'mp4', 'pdf'] }).optional(),
  })
)
createMediaValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const updateMediaValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300),
    format: vine.enum(['audio', 'video', 'texte', 'podcast']),
    orateur: vine.string().trim().maxLength(200).optional(),
    duration: vine.number().min(0).optional(),
    date: vine.date().optional(),
    catMediaId: vine.number(),
    urlFile: vine.string().trim().maxLength(500).optional(),
    file: vine.file({ size: '10mb', extnames: ['jpg', 'png', 'jpeg', 'webp', 'mp3', 'mp4', 'pdf'] }).optional(),
  })
)
updateMediaValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const catMediaValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(150)
  })
)
catMediaValidator.messagesProvider = new SimpleMessagesProvider({
  'required': 'Le nom de la catégorie est obligatoire.',
  'name.required': 'Le nom de la catégorie est obligatoire.',
  'name.minLength': 'Le nom de la catégorie doit faire au moins {{ min }} caractères.',
  'name.maxLength': 'Le nom de la catégorie ne doit pas dépasser {{ max }} caractères.',
})
