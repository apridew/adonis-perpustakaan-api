import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Buku from "./Buku";

export default class Peminjaman extends BaseModel {
  public static table = "peminjamans";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public tanggal_pinjam: DateTime;

  @column()
  public tanggal_kembali: DateTime;

  @column()
  public user_id: number | undefined;

  @column()
  public buku_id: number | undefined;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public users: BelongsTo<typeof User>;

  @belongsTo(() => Buku, {
    foreignKey: "buku_id",
  })
  public bukus: BelongsTo<typeof Buku>;
}
