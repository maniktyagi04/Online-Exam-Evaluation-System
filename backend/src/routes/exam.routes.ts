import { Router } from 'express';
import { ExamController } from '../controllers/ExamController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const examController = new ExamController();

// GET /api/exams — students see published, admins see all
router.get('/', authenticate, examController.getAllExams);

// GET /api/exams/:id — fetch exam with questions
router.get('/:id', authenticate, examController.getExamById);

// POST /api/exams — admin only
router.post('/', authenticate, requireRole('ADMIN'), examController.createExam);

// PUT /api/exams/:id — admin only
router.put('/:id', authenticate, requireRole('ADMIN'), examController.updateExam);

// PATCH /api/exams/:id/publish — admin only
router.patch('/:id/publish', authenticate, requireRole('ADMIN'), examController.publishExam);

// DELETE /api/exams/:id — admin only
router.delete('/:id', authenticate, requireRole('ADMIN'), examController.deleteExam);

// POST /api/exams/:id/questions — admin only
router.post('/:id/questions', authenticate, requireRole('ADMIN'), examController.addQuestion);

export default router;
