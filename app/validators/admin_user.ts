import vine from '@vinejs/vine'

/**
 * Validateur pour la création d'un utilisateur par un admin
 */
export const createUserValidator = vine.compile(
  vine.object({
    firstname: vine.string().maxLength(50).minLength(4),
    lastname: vine.string().maxLength(50).minLength(4),
    email: vine.string().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
    role: vine.enum([
      'admin',
      'user',
      'pasteur',
      'superadmin',
      'tresorier',
      'financier',
      'mdtcom',
      'administration',
      'porte_integration',
    ] as const),
    status: vine.enum(['en_attente', 'actif', 'inactif', 'suspendu'] as const).optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un utilisateur par un admin
 */
export const updateUserValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number(),
    }),
    firstname: vine.string().maxLength(50).minLength(4),
    lastname: vine.string().maxLength(50).minLength(4),
    email: vine
      .string()
      .email()
      .unique({
        table: 'users',
        column: 'email',
        filter: (db: any, _value: any, field: any) => {
          db.whereNot('id', field.meta.userId)
        },
      }),
    password: vine.string().minLength(8).optional(),
    role: vine.enum([
      'admin',
      'user',
      'pasteur',
      'superadmin',
      'tresorier',
      'financier',
      'mdtcom',
      'administration',
      'porte_integration',
    ] as const),
    status: vine.enum(['en_attente', 'actif', 'inactif', 'suspendu'] as const),
  })
)
