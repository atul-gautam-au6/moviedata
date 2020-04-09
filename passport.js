const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("./model/User");

// Local Strategy login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmailAndPassword(email, password);
        return done(null, user);
      } catch (err) {
        if (err.name === "AuthError")
          done(null, false, { message: 'Incurrect Crediential' });
        done(err);
      }
    }
  )
);

