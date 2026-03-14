import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "./env";
import { AuthService } from "../services/auth.service";

export const configurePassport = (authService: AuthService): void => {
  // ── Local Strategy ──────────────────────────────────────────────────────────
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await authService.validateLocalUser(email, password);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      },
    ),
  );

  // ── Google Strategy ─────────────────────────────────────────────────────────
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile: any, done) => {
          try {
            const email =
              profile.emails?.[0]?.value ?? `${profile.id}@google.invalid`;
            const avatar = profile.photos?.[0]?.value;

            const user = await authService.findOrCreateSocialUser({
              provider: "google",
              providerId: profile.id,
              email,
              name: profile.displayName || "Google User",
              avatar,
            });
            return done(null, user);
          } catch (err) {
            return done(err as Error, false);
          }
        },
      ),
    );
  }

  // ── GitHub Strategy ─────────────────────────────────────────────────────────
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CALLBACK_URL) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          callbackURL: env.GITHUB_CALLBACK_URL,
        },
        async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
          try {
            const email =
              profile.emails?.[0]?.value ?? `${profile.id}@github.invalid`;
            const avatar = profile.photos?.[0]?.value;

            const user = await authService.findOrCreateSocialUser({
              provider: "github",
              providerId: profile.id,
              email,
              name: profile.displayName || profile.username || "GitHub User",
              avatar,
            });
            return done(null, user);
          } catch (err) {
            return done(err as Error, false);
          }
        },
      ),
    );
  }
};
