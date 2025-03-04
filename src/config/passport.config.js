import { config } from 'dotenv';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.model.js';

config();

// GitHub OAuth configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:8080/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await User.findOne({ github_username: profile.username });

        if (!user) {
          user = new User({
            username: profile.username,
            email: profile?.emails?.[0]?.value || '',
            github_username: profile.username,
            avatar: {
              url: profile?.photos?.[0]?.value || '',
              name: `${profile.username}-avatar`,
              size: 0, // Size is unknown, can be updated later
              fileType: 'image/png', // Assuming PNG, update as needed
            },
            bio: profile._json.bio || '',
          });

          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export const initialize = () => passport.initialize();
export const session = () => passport.session();
export default passport;
