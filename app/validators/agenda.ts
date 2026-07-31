import vine from '@vinejs/vine'

export const agendaValidator = vine.compile(
  vine.object({
    day: vine.date(),
    title: vine.string().trim(),
    hourStart: vine.string().optional(),
    hourEnd: vine.string().optional(),
    place: vine.string().optional(),
    catActivityId: vine.number()
  })
)

export const catActivityValidator = vine.compile(
  vine.object({
    name: vine.string().trim()
  })
)
