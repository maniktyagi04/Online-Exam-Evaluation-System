import { Router } from 'express';
import { AttemptController } from '../controllers/AttemptController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const attemptController = new AttemptController();

// POST /api/attempts/start — student starts an exam
router.post('/start', authenticate, requireRole('STUDENT'), attemptController.startExam);

// POST /api/attempts/:attemptId/submit — student submits answers
router.post('/:attemptId/submit', authenticate, requireRole('STUDENT'), attemptController.submitExam);

// GET /api/attempts/my — student views their own attempts
router.get('/my', authenticate, requireRole('STUDENT'), attemptController.getMyAttempts);

// GET /api/attempts — admin views all attempts
router.get('/', authenticate, requireRole('ADMIN'), attemptController.getAllAttempts);

export default router;
