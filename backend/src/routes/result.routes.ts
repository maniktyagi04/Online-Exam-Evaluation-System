import { Router } from 'express';
import { ResultController } from '../controllers/ResultController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const resultController = new ResultController();

router.get('/analytics', authenticate, requireRole('ADMIN'), resultController.getAnalytics);

router.get('/:attemptId', authenticate, resultController.getResult);

export default router;
