import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Kategori from "./Kategori";
import User from "./User";

export default class Buku extends BaseModel {
  public static table = "bukus";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public judul: string | undefined;

  @column()
  public ringkasan: string | undefined;

  @column()
  public tahun_terbit: number | undefined;

  @column()
  public halaman: number | undefined;

  @column()
  public kategori_id: number | undefined;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Kategori, {
    foreignKey: "kategori_id",
  })
  public kategoris: BelongsTo<typeof Kategori>;

  @manyToMany(() => User, {
    localKey: "id",
    pivotForeignKey: "buku_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "user_id",
    pivotTable: "peminjamans",
  })
  public peminjamans: ManyToMany<typeof User>;
}
