import { Response } from 'express';
import { ExamService } from '../services/ExamService';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';
import { QuestionType } from '@prisma/client';

export class ExamController {
  private examService: ExamService;

  constructor() {
    this.examService = new ExamService();
  }

  getAllExams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const role = req.user?.role;
      const exams =
        role === 'ADMIN'
          ? await this.examService.getAllExams()
          : await this.examService.getPublishedExams();
      res.status(200).json({ success: true, data: exams });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  getExamById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const exam = await this.examService.getExamById(req.params.id);
      res.status(200).json({ success: true, data: exam });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  createExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, duration } = req.body;
      const exam = await this.examService.createExam(title, description, Number(duration));
      res.status(201).json({ success: true, data: exam, message: 'Exam created' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  updateExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, duration } = req.body;
      const exam = await this.examService.updateExam(req.params.id, {
        title,
        description,
        duration: duration ? Number(duration) : undefined,
      });
      res.status(200).json({ success: true, data: exam, message: 'Exam updated' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  publishExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const exam = await this.examService.publishExam(req.params.id);
      res.status(200).json({ success: true, data: exam, message: 'Exam published' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  deleteExam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.examService.deleteExam(req.params.id);
      res.status(200).json({ success: true, message: 'Exam deleted' });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  addQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { text, type, marks, options, keywords } = req.body;
      const question = await this.examService.addQuestion(
        req.params.id,
        text,
        type as QuestionType,
        Number(marks),
        options,
        keywords
      );
      res.status(201).json({ success: true, data: question, message: 'Question added' });
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
