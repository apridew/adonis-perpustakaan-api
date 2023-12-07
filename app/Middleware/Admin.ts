import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Admin {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const userAdmin = auth.user?.role === "admin";

    if (userAdmin) {
      await next();
    } else {
      return response.unauthorized({
        message: "Anda tidak bisa mengakses halaman ini",
      });
    }
  }
}
