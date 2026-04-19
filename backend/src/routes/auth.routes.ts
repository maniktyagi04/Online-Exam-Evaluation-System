import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register — creates STUDENT only
router.post('/register', authController.register);

// POST /api/auth/login — returns JWT
router.post('/login', authController.login);

export default router;
