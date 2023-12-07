import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import AuthValidator from "App/Validators/AuthValidator";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Mail from "@ioc:Adonis/Addons/Mail";
import OTPConfirmation from "App/Models/OtpCode";
import Profile from "App/Models/Profile";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const AuthPayload = await request.validate(AuthValidator);

      const newUser = await User.create(AuthPayload);

      const otp_code = Math.floor(100000 + Math.random() * 900000);

      await OTPConfirmation.create({
        otp_confirmation: otp_code,
        user_id: newUser.id,
      });

      await Mail.sendLater((message) => {
        message
          .from("admin@perpustakaan.com")
          .to(AuthPayload.email)
          .subject("Welcome Onboard!")
          .htmlView("emails/otp_confirmation", {
            user: { name: AuthPayload.name },
            otp_code: otp_code,
          });
      });

      return response.created({
        message: "Register Berhasil, silahkan verifikasi kode OTP",
      });
    } catch (error) {
      return response.unprocessableEntity({
        message: error,
      });
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const newLoginSchema = schema.create({
      email: schema.string([rules.email()]),
      password: schema.string(),
    });

    await request.validate({
      schema: newLoginSchema,
      messages: {
        required: "{{field}} user harus diisi tidak boleh kosong",
      },
    });

    const email = request.input("email");
    const password = request.input("password");

    try {
      const token = await auth
        .use("api")
        .attempt(email, password, { expiresIn: "7 days" });
      return response.ok({
        message: "Log In Berhasil",
        token,
      });
    } catch (error) {
      console.log(error);
      return response.unauthorized({
        message: "Password yang Anda masukan salah",
        result: error,
      });
    }
  }

  public async profile({ response }: HttpContextContract) {
    const userData = await Profile.query().preload("users");

    return response.ok({
      message: userData,
    });
  }

  public async updateProfile({ auth, request, response }: HttpContextContract) {
    const userData = auth.user;

    const profileSchema = schema.create({
      bio: schema.string(),
      alamat: schema.string(),
    });

    await request.validate({
      schema: profileSchema,
      messages: {
        required: "{{field}} user harus diisi tidak boleh kosong",
      },
    });

    const alamat = request.input("alamat");
    const bio = request.input("bio");

    const dataProfile = {
      alamat,
      bio,
    };

    await userData?.related("profiles").updateOrCreate({}, dataProfile);

    return response.ok({
      message: "Profile berhasil diupdate",
    });
  }

  public async otpConfirmation({ request, response }: HttpContextContract) {
    const otpSchema = schema.create({
      otp_code: schema.number(),
      email: schema.string(),
    });

    await request.validate({
      schema: otpSchema,
      messages: {
        required: "{{field}} harus diisi tidak boleh kosong",
        number: "{{field}} harus berupa angka",
      },
    });

    const otpCode = request.input("otp_code");
    const email = request.input("email");

    const user = await User.findBy("email", email);
    const otpCheck = await OTPConfirmation.findBy("otp_confirmation", otpCode);

    if (user?.id === otpCheck?.user_id) {
      await user?.merge({ is_verified: true }).save();

      return response.ok({
        message: "OTP Berhasil diverifikasi, silahkan login",
      });
    } else {
      return response.badRequest({
        message: "OTP yang anda masukkan salah",
      });
    }
  }
}
