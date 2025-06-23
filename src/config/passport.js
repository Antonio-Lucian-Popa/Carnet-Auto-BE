const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../prismaClient");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (existingUser) return done(null, existingUser);

        const newUser = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            googleId: profile.id,
          },
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
