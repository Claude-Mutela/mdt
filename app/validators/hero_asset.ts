import vine from '@vinejs/vine'

export const heroAssetValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    status: vine.enum(['active', 'inactive']),
  })
)
