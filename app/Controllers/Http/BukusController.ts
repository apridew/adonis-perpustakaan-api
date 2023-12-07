import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BukuValidator from "App/Validators/BukuValidator";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Buku from "App/Models/Buku";

export default class BukusController {
  public async index({ response }: HttpContextContract) {
    const bukus = await Buku.query()
      .preload("kategoris")
      .preload("peminjamans");

    return response.ok({
      message: "Tampil semua data Buku",
      data: bukus,
    });
  }

  public async store({ request, response }: HttpContextContract) {
    const addBukusPayload = await request.validate(BukuValidator);

    await Buku.create(addBukusPayload);

    return response.ok({
      message: "Berhasil Add Buku",
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const bukus = await Buku.query()
      .where("id", params.id)
      .preload("kategoris")
      .preload("peminjamans")
      .first();

    if (!bukus) {
      return response.notFound({
        message: "Detail Buku yang Anda cari tidak terdaftar",
        status: "error",
      });
    }

    return response.ok({
      message: "Tampil detail Buku",
      data: bukus,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
    const newUpdateBukuSchema = schema.create({
      judul: schema.string.optional([rules.minLength(4)]),
      ringkasan: schema.string.optional([rules.minLength(4)]),
      tahun_terbit: schema.number.optional([
        rules.range(1000, new Date().getFullYear()),
      ]),
      halaman: schema.number.optional(),
      kategori_id: schema.number.optional([
        rules.exists({ table: "kategoris", column: "id" }),
        rules.unique({ table: "kategoris", column: "id" }),
      ]),
    });

    const updateBukusPayload = await request.validate({
      schema: newUpdateBukuSchema,
      messages: {
        exists: "{{field}} yang Anda input belum terdaftar",
        unique: "Gagal update {{field}} buku karena sudah sesuai",
      },
    });

    const isFieldUpdated = Object.values(updateBukusPayload).some(
      (value) => value !== undefined
    );

    if (!isFieldUpdated) {
      return response.badRequest({
        message: "Isi minimal 1 kolom untuk melakukan update",
        status: "error",
      });
    }

    const buku = await Buku.find(params.id);
    if (!buku) {
      return response.notFound({
        message: "Buku yang ingin diupdate tidak terdaftar",
        status: "error",
      });
    }

    await buku.merge(updateBukusPayload).save();

    return response.created({
      message: "Berhasil Update Buku",
    });
  }

  public async destroy({ response, params }: HttpContextContract) {
    const bukus = await Buku.find(params.id);

    if (!bukus) {
      return response.notFound({
        message: "Id Buku yang ingin dihapus tidak terdaftar",
        status: "error",
      });
    }
    await bukus.delete();

    return response.ok({
      message: "Berhasil Delete Buku",
    });
  }
}
