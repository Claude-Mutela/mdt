import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Messages d'erreur en français pour le formulaire de contact.
 */
const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'email': "L'adresse email doit être valide (ex: nom@exemple.com).",
  'minLength': 'Ce champ doit contenir au moins {{ min }} caractères.',
  'maxLength': 'Ce champ ne doit pas dépasser {{ max }} caractères.',
  'name.minLength': 'Le nom doit contenir au moins 2 caractères.',
  'name.maxLength': 'Le nom ne doit pas dépasser 100 caractères.',
  'email.minLength': "L'email doit contenir au moins 5 caractères.",
  'email.maxLength': "L'email ne doit pas dépasser 150 caractères.",
  'subject.in': "Le sujet sélectionné n'est pas valide.",
  'message.minLength': 'Le message doit contenir au moins 10 caractères.',
  'message.maxLength': 'Le message ne doit pas dépasser 2000 caractères.',
}

/**
 * Liste blanche des sujets acceptés.
 */
const ALLOWED_SUBJECTS = [
  "Demande d'information",
  'Sujet de prière',
  'Témoignage',
  'Autre',
] as const

/**
 * Validator du formulaire de contact public.
 *
 * Sécurité :
 *   - Longueurs min/max sur tous les champs (lutte contre les payloads XXL)
 *   - Regex sur le nom (pas de balises HTML ni de scripts)
 *   - Liste blanche sur le sujet (pas d'injection de valeurs arbitraires)
 *   - trim() systématique (espaces avant/après)
 *   - escape() implicite via trim + maxLength (XSS atténué côté back)
 */
export const contactValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      // Interdit les balises HTML/script et caractères de contrôle
      .regex(/^[^<>{}\\;'"\/\0\r\n]{2,100}$/),

    email: vine.string().trim().minLength(5).maxLength(150).email(),

    subject: vine.string().trim().in(ALLOWED_SUBJECTS),

    message: vine.string().trim().minLength(10).maxLength(2000),
  })
)

contactValidator.messagesProvider = new SimpleMessagesProvider(messages)
