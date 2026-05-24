import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CatGalery from '#models/cat_galery'
import Image from '#models/image'

export default class Galery extends BaseModel {
  static table = 'galery'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({ columnName: 'cover_img' })
  declare coverImg: string | null

  @column({ columnName: 'url_img' })
  declare urlImg: string | null

  @column({ columnName: 'img_nber' })
  declare imgNber: number

  @column({ columnName: 'cat_galery_id' })
  declare catGaleryId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CatGalery)
  declare catGalery: BelongsTo<typeof CatGalery>

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>
}
