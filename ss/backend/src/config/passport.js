const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: profile.emails?.[0]?.value });
            if (user) {
              user.googleId = profile.id;
              user.isEmailVerified = true;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value || "",
                isEmailVerified: true,
                role: "client",
              });
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );
}

module.exports = passport;
