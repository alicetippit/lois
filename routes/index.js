var express = require("express"),
    router = express.Router(),
    passport = require("passport");

router.get("/", passport.authenticate("saml", {failureRedirect: "error", failureFlash: true}, (req, res) => {
  res.redirect("/");
}
));


router.post('/login/callback',
  passport.authenticate("saml", { failureRedirect: "error", failureFlash: true }),
  function(req, res) {
    console.log(req.user);
    res.redirect("/");
  }
);

module.exports = router;