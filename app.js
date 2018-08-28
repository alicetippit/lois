/* Requests path for testing: 
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=200.94+M496
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=B2849.H57+K84+2012
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=420+B234e
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=805+S759
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=813.5+A549w
/findMap?library_code=MAIN&location_code=nstx&location_name=Stacks&call_number=823.8+G24Zs
/findMap?library_code=MAIN&location_code=narchlg&location_name=Art+Library&call_number=N7432.5.A78+087+2018
/findMap?library_code=MAIN&location_code=nart&location_name=Art+Library&call_number=720.952+F996r
/findMap?library_code=MAIN&location_code=mlc&location_name=Music+Listening+Center&call_number=CD31729
/findMap?library_code=MAIN&location_code=ngov&location_name=Government+Info&call_number=abunchofnumbers
/findMap?library_code=MAIN&location_code=naarch&location_name=University+Archives&call_number=Archives
/findMap?library_code=MAIN&location_code=tran&location_name=Transportation&call_number=some+number
/findMap?library_code=MAIN&location_code=mstx&location_name=Music+Library+Stacks&call_number=ML73.5+.K53
/findMap?library_code=MAIN&location_code=mstx&location_name=Music+Library+Stacks&call_number=M512.4.S38+D.667
/findMap?library_code=MAIN&location_code=mcoll&location_name=Music+Library+Stacks&call_number=M3+.B111+v.46
*/

const express = require("express"),
      app = express(),
      path = require("path"),
      bodyParser = require("body-parser"),
      db = require("./models/dbconnection"),
      session = require("express-session"),
      flash = require("connect-flash"),
      methodOverride = require("method-override"),
      passport = require("passport"),
      samlStrategy = require('passport-saml').Strategy,
      mapsRoutes = require("./routes/maps"),
      errorsRoutes = require("./routes/error"),
      locationsRoutes = require("./routes/locations"),
      mappingsRoutes = require("./routes/mappings"),
      usersRoutes = require("./routes/users"),
      indexRoutes= require("./routes/index");
    
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'catpants',
    cookie: { maxAge: 60000 }
}));
app.use(flash());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Passport config
passport.use("saml", new samlStrategy({
    path: "/login/callback",
    entryPoint: "https://www.northwestern.edu/",
    issuer: "passport-saml",
    cert:""
}, 
function(profile, done){
    console.log(profile);
    db.query("SELECT * FROM users;", (err, user, fields) => {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  })
);

app.use(mapsRoutes);
app.use(indexRoutes);
app.use(errorsRoutes);
app.use(locationsRoutes);
app.use(mappingsRoutes);
app.use(usersRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is listening!");
});