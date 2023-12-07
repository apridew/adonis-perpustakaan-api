import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.unique({ table: "users", column: "name" })]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
    ]),
    password: schema.string({}, [rules.minLength(6)]),
    role: schema.enum(["user", "admin"]),
  });

  public messages: CustomMessages = {
    required: "{{field}} user harus diisi tidak boleh kosong",
    minLength: "input {{field}} user minimal {{options.minLength}} karakter",
    unique: "{{field}} user tersebut sudah didaftarkan",
  };
}
