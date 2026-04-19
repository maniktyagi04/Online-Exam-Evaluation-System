import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = Router();
const studentController = new StudentController();

// All student routes are protected and restricted to STUDENT role
router.use(authenticate, requireRole('STUDENT'));

router.get('/dashboard', studentController.getDashboard);
router.get('/history', studentController.getHistory);

export default router;
