import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';

export default (app) => {
  app.use('/api/auth', authRoutes);
};
