import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BukuValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    judul: schema.string([
      rules.minLength(4),
      rules.unique({ table: "bukus", column: "judul" }),
    ]),
    ringkasan: schema.string([rules.minLength(4)]),
    tahun_terbit: schema.number([rules.range(1000, new Date().getFullYear())]),
    halaman: schema.number(),
    kategori_id: schema.number([
      rules.exists({ table: "kategoris", column: "id" }),
    ]),
  });

  public messages: CustomMessages = {
    required: "{{field}} buku harus diisi tidak boleh kosong",
    minLength: "input {{field}} buku minimal {{options.minLength}} karakter",
    number: "input {{field}} buku harus berupa angka",
    range:
      "input {{field}} buku minimal 4 angka ({{options.start}} - {{options.stop}})",
    exists: "{{field}} yang Anda input belum terdaftar",
    unique: "{{field}} buku tersebut sudah didaftarkan",
  };
}
