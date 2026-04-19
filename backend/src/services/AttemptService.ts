import { AttemptRepository } from '../repositories/AttemptRepository';
import { ExamRepository } from '../repositories/ExamRepository';
import { EvaluationService } from './EvaluationService';
import { ResultService } from './ResultService';
import { ApiError } from '../utils/ApiError';
import { ExamStatus } from '@prisma/client';

export class AttemptService {
  private attemptRepository: AttemptRepository;
  private examRepository: ExamRepository;
  private evaluationService: EvaluationService;
  private resultService: ResultService;

  constructor() {
    this.attemptRepository = new AttemptRepository();
    this.examRepository = new ExamRepository();
    this.evaluationService = new EvaluationService();
    this.resultService = new ResultService();
  }

  async startExam(userId: string, examId: string) {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw ApiError.notFound('Exam not found');

    if (exam.status !== ExamStatus.PUBLISHED) {
      throw ApiError.badRequest('This exam is not yet published');
    }

    const existing = await this.attemptRepository.findByUserAndExam(userId, examId);
    if (existing) {
      if (existing.endTime) {
        throw new ApiError('You have already attempted this exam', 400);
      }
      return existing; // Resume existing attempt
    }

    return this.attemptRepository.create({ userId, examId });
  }

  async submitExam(
    attemptId: string,
    userId: string,
    answers: Array<{ questionId: string; response: string }>
  ) {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) throw ApiError.notFound('Attempt not found');
    if (attempt.userId !== userId) throw ApiError.forbidden('Access denied');
    if (attempt.endTime) throw ApiError.badRequest('This exam has already been submitted');

    const questions = attempt.exam.questions;
    const { evaluated, totalScore } = this.evaluationService.evaluate(questions, answers);

    await this.attemptRepository.createAnswers(attemptId, evaluated);
    await this.attemptRepository.complete(attemptId, totalScore);

    const totalPossible = questions.reduce((sum, q) => sum + q.marks, 0);
    return this.resultService.generateResult(attemptId, totalScore, totalPossible);
  }

  async getAttemptsByUser(userId: string) {
    return this.attemptRepository.findByUser(userId);
  }

  async getAllAttempts() {
    return this.attemptRepository.findAll();
  }

  async getAttemptsByExam(examId: string) {
    return this.attemptRepository.findByExam(examId);
  }
}
