import { Router } from 'express';
import { ResultController } from '../controllers/ResultController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const resultController = new ResultController();

// GET /api/results/analytics — admin analytics dashboard
router.get('/analytics', authenticate, requireRole('ADMIN'), resultController.getAnalytics);

// GET /api/results/:attemptId — student/admin views result
router.get('/:attemptId', authenticate, resultController.getResult);

export default router;
