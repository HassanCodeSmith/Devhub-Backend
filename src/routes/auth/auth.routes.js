import { Router } from 'express';
import passport from 'passport';

import { githubCallback } from '../../controllers/auth.controllers.js';

const router = Router();

router.get('/github', (req, res, next) => {
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', githubCallback);

export default router;
