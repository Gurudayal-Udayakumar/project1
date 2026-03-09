import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getSafeGoogleCallbackUrl = () => {
  const fallbackPath = "/api/auth/google/callback";
  const configured = process.env.GOOGLE_CALLBACK_URL;

  if (!configured) {
    return fallbackPath;
  }

  try {
    const parsed = new URL(configured);
    return `${parsed.origin}${fallbackPath}`;
  } catch {
    return fallbackPath;
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getSafeGoogleCallbackUrl(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
