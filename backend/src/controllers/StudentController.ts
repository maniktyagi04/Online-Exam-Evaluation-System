import { Response } from 'express';
import { StudentService } from '../services/StudentService';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const data = await this.studentService.getDashboardData(userId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const history = await this.studentService.getAttemptHistory(userId);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  private handleError(err: unknown, res: Response): void {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ success: false, message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
