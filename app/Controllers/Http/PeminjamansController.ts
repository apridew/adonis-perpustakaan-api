import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Buku from "App/Models/Buku";
import Peminjaman from "App/Models/Peminjaman";
import PeminjamanValidator from "App/Validators/PeminjamanValidator";

export default class PeminjamansController {
  public async store({ request, response, params, auth }: HttpContextContract) {
    await request.validate(PeminjamanValidator);

    const bukuId = parseInt(params.id);
    const bukuExists = await Buku.find(bukuId);

    if (!bukuExists) {
      return response.notFound({
        message: "Buku ID yang ingin dipinjam belum terdaftar",
      });
    }

    await Peminjaman.create({
      tanggal_pinjam: request.input("tanggal_pinjam"),
      tanggal_kembali: request.input("tanggal_kembali"),
      user_id: auth.user?.id,
      buku_id: params.id,
    });

    return response.ok({
      message: "Berhasil Meminjam Buku",
    });
  }

  public async index({ response }: HttpContextContract) {
    const dataPeminjam = await Peminjaman.query()
      .preload("users")
      .preload("bukus");

    return response.ok({
      message: "Tampil semua data peminjam",
      data: dataPeminjam,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    const peminjamans = await Peminjaman.query()
      .where("id", params.id)
      .preload("users")
      .preload("bukus")
      .first();

    if (!peminjamans) {
      return response.notFound({
        message: "Detail Peminjam yang Anda cari tidak terdaftar",
        status: "error",
      });
    }

    return response.ok({
      message: "Tampil detail Peminjam",
      data: peminjamans,
    });
  }
}
