import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'required': 'Ce champ est obligatoire.',
  'string': 'La valeur doit être du texte.',
  'email': 'L\'adresse email doit être valide.',
  'phone.minLength': 'Le numéro de téléphone est trop court.',
  'phone.maxLength': 'Le numéro de téléphone est trop long.',
  'phone.regex': 'Le numéro de téléphone est invalide. Seuls les chiffres, les espaces, les parenthèses, les tirets et le symbole "+" sont autorisés.',
  'format.in': 'Format de rendez-vous invalide.',
  'appointmentDate.date': 'La date doit être valide.',
  'appointmentTime.regex': 'L\'heure doit être au format HH:MM (ex: 10:30).',
  'status.in': 'Statut invalide.',
}

export const appointmentValidator = vine.compile(
  vine.object({
    lastName: vine.string().trim().minLength(2).maxLength(100),
    firstName: vine.string().trim().minLength(2).maxLength(100),
    phone: vine.string().trim().regex(/^[+]?[0-9\s\-()]{9,18}$/).minLength(6).maxLength(30),
    email: vine.string().trim().email().nullable().optional(),
    reason: vine.string().trim().minLength(2).maxLength(200),
    format: vine.string().trim().in(['presentiel', 'enligne', 'enligne_vocal']),
    appointmentDate: vine.date(),
    appointmentTime: vine.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })
)

appointmentValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const appointmentStatusValidator = vine.compile(
  vine.object({
    status: vine.string().trim().in(['pending', 'confirmed', 'cancelled']),
  })
)

appointmentStatusValidator.messagesProvider = new SimpleMessagesProvider(messages)

export const appointmentRescheduleValidator = vine.compile(
  vine.object({
    appointmentDate: vine.date(),
    appointmentTime: vine.string().trim().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })
)

appointmentRescheduleValidator.messagesProvider = new SimpleMessagesProvider({
  ...messages,
  'appointmentDate.required': 'La nouvelle date est obligatoire.',
  'appointmentTime.required': 'La nouvelle heure est obligatoire.',
})
