import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class VerifyUser {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const email = request.input("email");

    const user = await User.findBy("email", email);
    const userVerified = user?.is_verified;

    if (!user) {
      return response.badRequest({
        message: "Email belum terdaftar",
      });
    }

    if (userVerified) {
      await next();
    } else {
      return response.badRequest({
        message: "Silahkan konfirmasi OTP terlebih dahulu",
      });
    }
  }
}
