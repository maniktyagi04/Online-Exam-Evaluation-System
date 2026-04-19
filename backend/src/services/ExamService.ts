import { ExamRepository } from '../repositories/ExamRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { ApiError } from '../utils/ApiError';
import { QuestionType } from '@prisma/client';

export class ExamService {
  private examRepository: ExamRepository;
  private questionRepository: QuestionRepository;

  constructor() {
    this.examRepository = new ExamRepository();
    this.questionRepository = new QuestionRepository();
  }

  async createExam(title: string, description: string | undefined, duration: number) {
    if (!title?.trim()) throw ApiError.badRequest('Exam title is required');
    if (!duration || duration < 1) throw ApiError.badRequest('Duration must be at least 1 minute');
    return this.examRepository.create({ title: title.trim(), description, duration });
  }

  async updateExam(
    id: string,
    data: { title?: string; description?: string; duration?: number }
  ) {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw ApiError.notFound('Exam not found');
    return this.examRepository.update(id, data);
  }

  async publishExam(id: string) {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw ApiError.notFound('Exam not found');
    if (!exam.questions || exam.questions.length === 0) {
      throw ApiError.badRequest('Cannot publish an exam with no questions');
    }
    return this.examRepository.publish(id);
  }

  async getExamById(id: string) {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw ApiError.notFound('Exam not found');
    return exam;
  }

  async getAllExams() {
    return this.examRepository.findAll();
  }

  async getPublishedExams() {
    return this.examRepository.findPublished();
  }

  async addQuestion(
    examId: string,
    text: string,
    type: QuestionType,
    marks: number,
    options?: Array<{ optionText: string; isCorrect: boolean }>,
    keywords?: string
  ) {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw ApiError.notFound('Exam not found');
    if (!text?.trim()) throw ApiError.badRequest('Question text is required');
    if (!marks || marks < 1) throw ApiError.badRequest('Marks must be at least 1');

    if (type === QuestionType.MCQ) {
      if (!options || options.length < 2) {
        throw ApiError.badRequest('MCQ questions require at least 2 options');
      }
      const hasCorrect = options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        throw ApiError.badRequest('MCQ questions require exactly one correct option');
      }
    }

    return this.questionRepository.create({
      examId,
      text: text.trim(),
      type,
      marks,
      options,
      keywords,
    });
  }

  async deleteExam(id: string) {
    const exam = await this.examRepository.findById(id);
    if (!exam) throw ApiError.notFound('Exam not found');
    await this.examRepository.delete(id);
  }
}
