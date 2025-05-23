const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    (req, res, next) => {
      console.log("/auth/google hit");
      next();
    },
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      console.log("inside google callback");
      res.redirect("http://localhost:3000/blogs");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000/");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
