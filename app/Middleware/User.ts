import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class User {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const user = auth.user?.role === "user";

    if (user) {
      await next();
    } else {
      return response.unauthorized({
        message: "Anda tidak bisa mengakses halaman ini",
      });
    }
  }
}
