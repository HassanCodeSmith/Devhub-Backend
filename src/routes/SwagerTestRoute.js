import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /v1/api/example:
 *   get:
 *     summary: Example route
 *     description: Returns an example response
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/example', (req, res) => {
  res.json({ message: 'swagger route working!' });
});

export default router;
