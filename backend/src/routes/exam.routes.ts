import { Router } from 'express';
import { ExamController } from '../controllers/ExamController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const examController = new ExamController();

router.get('/', authenticate, examController.getAllExams);

router.get('/:id', authenticate, examController.getExamById);

router.post('/', authenticate, requireRole('ADMIN'), examController.createExam);

router.put('/:id', authenticate, requireRole('ADMIN'), examController.updateExam);

router.patch('/:id/publish', authenticate, requireRole('ADMIN'), examController.publishExam);

router.delete('/:id', authenticate, requireRole('ADMIN'), examController.deleteExam);

router.post('/:id/questions', authenticate, requireRole('ADMIN'), examController.addQuestion);

export default router;
