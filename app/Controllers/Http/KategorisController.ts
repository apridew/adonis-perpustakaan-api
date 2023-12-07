import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import KategoriValidator from "App/Validators/KategoriValidator";
import Kategori from "App/Models/Kategori";

export default class KategorisController {
  public async store({ request, response }: HttpContextContract) {
    const kategorisPayload = await request.validate(KategoriValidator);

    await Kategori.create(kategorisPayload);

    return response.created({
      message: "Berhasil Add Kategori",
    });
  }

  public async index({ response }: HttpContextContract) {
    const kategoris = await Kategori.query().preload("bukus");

    return response.ok({
      message: "Tampil semua data Kategori",
      data: kategoris,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const kategoris = await Kategori.query()
      .where("id", params.id)
      .preload("bukus")
      .first();

    if (!kategoris) {
      return response.notFound({
        message: "Detail Kategori yang Anda cari tidak terdaftar",
        status: "error",
      });
    }

    return response.ok({
      message: "Tampil detail Kategori",
      data: kategoris,
    });
  }

  public async update({ response, request, params }: HttpContextContract) {
    const kategorisPayload = await request.validate(KategoriValidator);

    const kategori = await Kategori.findOrFail(params.id);
    kategori.name = kategorisPayload.name;

    await kategori.save();

    return response.created({
      message: "Berhasil Update Kategori",
    });
  }

  public async destroy({ response, params }: HttpContextContract) {
    const kategoris = await Kategori.find(params.id);

    if (!kategoris) {
      return response.notFound({
        message: "Id kategori yang ingin dihapus tidak terdaftar",
        status: "error",
      });
    }

    await kategoris.delete();

    return response.ok({
      message: "Berhasil Delete Kategori",
    });
  }
}
