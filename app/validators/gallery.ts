import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'Ce champ doit être une chaîne de caractères.',
  'number': 'Ce champ doit être un nombre.',
  'date': 'La date fournie est invalide.',
  'minLength': 'Ce champ doit faire au moins {{ min }} caractères.',
  'maxLength': 'Ce champ ne doit pas dépasser {{ max }} caractères.',
  'title.required': 'Le titre est obligatoire.',
  'title.minLength': 'Le titre doit faire au moins {{ min }} caractères.',
  'catGaleryId.required': 'Veuillez sélectionner une catégorie.',
  'galeryId.required': 'Veuillez sélectionner un album.',
  'file.required': 'Veuillez téléverser une image.',
  'file.size': 'L\'image est trop lourde (max 30Mo).',
  'file.extname': 'Format de fichier non pris en charge. Utilisez JPG, PNG ou WebP.',
}

export const catGalleryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150),
  })
)
catGalleryValidator.messagesProvider = new SimpleMessagesProvider({
  ...messages,
  'name.required': 'Le nom de la catégorie est obligatoire.',
  'name.minLength': 'Le nom de la catégorie doit faire au moins {{ min }} caractères.',
})

export const createGalleryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300),
    catGaleryId: vine.number(),
    file: vine.file({ size: '30mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
  })
)
createGalleryValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const updateGalleryValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300),
    catGaleryId: vine.number(),
    file: vine.file({ size: '30mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
  })
)
updateGalleryValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const createImageValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(300).optional(),
    galeryId: vine.number(),
    date: vine.date().optional(),
    file: vine.file({ size: '30mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }),
  })
)
createImageValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const updateImageValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(300).optional(),
    galeryId: vine.number(),
    date: vine.date().optional(),
    file: vine.file({ size: '30mb', extnames: ['jpg', 'png', 'jpeg', 'webp'] }).optional(),
  })
)
updateImageValidator.messagesProvider = new SimpleMessagesProvider(messages)
