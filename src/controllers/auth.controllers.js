import passport from 'passport';
import { sendResponse, generateToken } from '../utils/index.js';

export const githubCallback = (req, res, next) => {
  passport.authenticate(
    'github',
    { failureRedirect: '/login' },
    (err, user, info) => {
      if (err || !user) {
        return res.redirect('/login');
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      return sendResponse(
        res,
        200,
        {
          username: user.username,
          email: user.email,
          avatar_url: user.avatar?.url || '',
          bio: user.bio || '',
          github_username: user.github_username || '',
          token,
        },
        'GitHub login successful'
      );
    }
  )(req, res, next);
};
