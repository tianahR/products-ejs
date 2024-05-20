const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

/**when someone sends a POST request to the /sessions/logon path, 
 * Passport will call the function we defined earlier and registered to the name "local".
 *  If that function completes successfully (done(...) is called with no error argument), then it 
 * will redirect the page to the successRedirect page. If there is an error, then it will redirect to the failureRedirect page, 
 * and also set a flash message with the message property from the object we passed to done(...). */

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );
router.route("/logoff").post(logoff);

module.exports = router;
