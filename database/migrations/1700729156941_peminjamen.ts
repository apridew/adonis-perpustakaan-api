import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "peminjamans";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("tanggal_pinjam").notNullable();
      table.string("tanggal_kembali").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("buku_id")
        .unsigned()
        .references("bukus.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.unique(["user_id", "buku_id"]);

      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
