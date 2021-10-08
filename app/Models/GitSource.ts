import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import cuid from 'cuid'
import Application from './Application'
import GithubApp from './GithubApp'

export default class GitSource extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public organization: string

  @column()
  public githubAppId: string

  @belongsTo(() => GithubApp)
  public githubApp: BelongsTo<typeof GithubApp>

  @hasMany(() => Application)
  public applications: HasMany<typeof Application>

  @column()
  public htmlUrl: string

  @column()
  public apiUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(gitsource: GitSource) {
    gitsource.id = cuid()
  }
}
