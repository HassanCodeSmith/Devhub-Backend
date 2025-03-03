import { Router } from 'express';
import authRoutes from './auth/AuthRoutes.js';

export default (app) => {
  app.use('/api/auth', authRoutes);
};
