const express = require("express");
require("express-async-errors");
require("dotenv").config(); 
const session = require("express-session");
require('connect-flash');
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));


const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

/**This registers our local Passport strategy, 
 * and sets up the serializeUser and deserializeUser functions onto the passport object. */

passportInit();

/**sets up Passport to work with Express and sessions) */

app.use(passport.initialize());

/**sets up an Express middleware that runs on all requests, checks the session cookie for a user id, 
 * and if it finds one, deserializes and attaches it to the req.user property */
app.use(passport.session());

// this code must come after the app.use that sets up sessions, because flash depends on sessions
app.use(require("connect-flash")());

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));




// These lines should be added before any of the lines that govern routes, such as the app.get and app.post statements:
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );


//replace the app.get and app.post statements for the "/secretWord" 
// Turning on protection is simple. You add the authentication middleware "auth" to the route 

app.use("/secretWord", auth, secretWordRouter);


// // secret word handling
// let secretWord = "syzygy";
// app.get("/secretWord", (req, res) => {
//   // res.render("secretWord", { secretWord });
//   if (!req.session.secretWord) {
//     req.session.secretWord = "syzygy";
//   }
//   res.locals.info = req.flash("info");
//   res.locals.errors = req.flash("error");
//   res.render("secretWord", { secretWord: req.session.secretWord });
// });
// // app.post("/secretWord", (req, res) => {
// //   secretWord = req.body.secretWord;
// //   res.redirect("/secretWord");
// // });
// app.post("/secretWord", (req, res) => {
//   if (req.body.secretWord.toUpperCase()[0] == "P") {
//     req.flash("error", "That word won't work!");
//     req.flash("error", "You can't use words that start with p.");
//   } else {
//     req.session.secretWord = req.body.secretWord;
//     req.flash("info", "The secret word was changed.");
//   }
//   // res.render("secretWord", {
//   //   secretWord,
//   //   errors: flash("errors"),
//   //   info: flash("info"),
//   // });
//   res.redirect("/secretWord");
// });

//end comment 05/20/2024

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();