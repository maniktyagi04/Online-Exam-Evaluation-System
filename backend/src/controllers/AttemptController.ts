import { Response } from 'express';
import { AttemptService } from '../services/AttemptService';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

export class AttemptController {
  private attemptService: AttemptService;

  constructor() {
    this.attemptService = new AttemptService();
  }

  startExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { examId } = req.body;
      if (!examId) {
        res.status(400).json({ success: false, message: 'examId is required' });
        return;
      }
      const attempt = await this.attemptService.startExam(userId, examId);
      res.status(201).json({ success: true, data: attempt, message: 'Exam started' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  submitExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { attemptId } = req.params;
      const { answers } = req.body;

      if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ success: false, message: 'answers array is required' });
        return;
      }

      const result = await this.attemptService.submitExam(attemptId, userId, answers);
      res.status(200).json({ success: true, data: result, message: 'Exam submitted' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  getMyAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const attempts = await this.attemptService.getAttemptsByUser(userId);
      res.status(200).json({ success: true, data: attempts });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  getAllAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const attempts = await this.attemptService.getAllAttempts();
      res.status(200).json({ success: true, data: attempts });
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
