import { Router } from 'express';
import { AttemptController } from '../controllers/AttemptController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const attemptController = new AttemptController();

router.post('/start', authenticate, requireRole('STUDENT'), attemptController.startExam);

router.post('/:attemptId/submit', authenticate, requireRole('STUDENT'), attemptController.submitExam);

router.get('/my', authenticate, requireRole('STUDENT'), attemptController.getMyAttempts);

router.get('/', authenticate, requireRole('ADMIN'), attemptController.getAllAttempts);

export default router;
