import Route from "@ioc:Adonis/Core/Route";

// -------------------Route Buku & Kategori-------------------
Route.group(() => {
  Route.resource("/kategori", "KategorisController")
    // .middleware({ "*": ["auth", "admin"] })
    .middleware({
      index: ["auth"],
      show: ["auth"],
      store: ["auth", "admin"],
      update: ["auth", "admin"],
      destroy: ["auth", "admin"],
    })
    .apiOnly();

  Route.resource("/buku", "BukusController")
    .middleware({
      index: ["auth"],
      show: ["auth"],
      store: ["auth", "admin"],
      update: ["auth", "admin"],
      destroy: ["auth", "admin"],
    })
    .apiOnly();
}).prefix("/api/v1");

// ----------------------Route Peminjaman-------------------
Route.group(() => {
  Route.post("buku/:id/peminjaman", "PeminjamansController.store").middleware([
    "auth",
    "user",
  ]);
  Route.get("peminjaman/:id", "PeminjamansController.show").middleware([
    "auth",
  ]);
  Route.get("peminjaman", "PeminjamansController.index").middleware(["auth"]);
}).prefix("/api/v1");

// ---------------------Route Auth------------------------
Route.group(() => {
  Route.post("/register", "AuthController.register");
  Route.post("/login", "AuthController.login").middleware("verify");
  Route.post("/otp-confirmation", "AuthController.otpConfirmation");
  Route.get("/profile", "AuthController.profile").middleware(["auth"]);
  Route.post("/profile", "AuthController.updateProfile").middleware(["auth"]);
}).prefix("/api/v1");
