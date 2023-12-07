import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class KategoriValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.minLength(4),
      rules.unique({ table: "kategoris", column: "name" }),
    ]),
  });

  public messages: CustomMessages = {
    required: "{{field}} kategori harus diisi tidak boleh kosong",
    minLength:
      "input {{field}} kategori minimal {{options.minLength}} karakter",
    unique: "{{field}} kategori tersebut sudah didaftarkan",
  };
}
