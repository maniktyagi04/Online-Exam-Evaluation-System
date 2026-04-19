import { Response } from 'express';
import { ResultService } from '../services/ResultService';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

export class ResultController {
  private resultService: ResultService;

  constructor() {
    this.resultService = new ResultService();
  }

  getResult = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const { attemptId } = req.params;
      const result = await this.resultService.getResultByAttemptId(attemptId, userId, role);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  };

  getAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const analytics = await this.resultService.getAnalytics();
      res.status(200).json({ success: true, data: analytics });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}
