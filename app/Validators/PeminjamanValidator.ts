import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BukuValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    tanggal_pinjam: schema.date(
      {
        format: "dd-MM-yyyy",
      },
      [rules.afterOrEqual("today"), rules.beforeField("tanggal_kembali")]
    ),
    tanggal_kembali: schema.date(
      {
        format: "dd-MM-yyyy",
      },
      [rules.afterField("tanggal_pinjam")]
    ),
  });

  public messages: CustomMessages = {
    required: "{{field}} buku harus diisi tidak boleh kosong",
    beforeField: "{{field}} harus sebelum tanggal kembali",
    afterField: "{{field}} harus setelah tanggal pinjam",
    afterOrEqual: "{{field}} harus tanggal hari ini atau setelahnya",
  };
}
