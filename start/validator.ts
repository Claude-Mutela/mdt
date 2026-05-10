import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Configuration des messages d'erreur en français pour VineJS
 */
vine.messagesProvider = new SimpleMessagesProvider({
  // Messages par défaut pour toutes les règles
  'required': 'Le champ {{ field }} est obligatoire',
  'email': 'L\'adresse email doit être une adresse valide',
  'minLength': 'Le champ {{ field }} doit avoir au moins {{ min }} caractères',
  'maxLength': 'Le champ {{ field }} ne doit pas dépasser {{ max }} caractères',
  'unique': 'Cette valeur est déjà utilisée par un autre compte',
  'enum': 'La valeur sélectionnée pour {{ field }} est invalide',
  'confirmed': 'La confirmation du champ {{ field }} ne correspond pas',
  'number': 'Le champ {{ field }} doit être un nombre',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères',
  
  // Vous pouvez aussi traduire les noms des champs
  'firstname': 'Prénom',
  'lastname': 'Nom',
  'email_address': 'Adresse email',
  'password': 'Mot de passe',
  'role': 'Rôle',
  'status': 'Statut'
})
