import { ResultRepository } from '../repositories/ResultRepository';
import { ApiError } from '../utils/ApiError';

export class ResultService {
  private resultRepository: ResultRepository;

  constructor() {
    this.resultRepository = new ResultRepository();
  }

  async generateResult(
    attemptId: string,
    totalMarks: number,
    totalPossible: number
  ) {
    const percentage =
      totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;
    return this.resultRepository.create({
      attemptId,
      totalMarks,
      percentage: Math.round(percentage * 100) / 100,
    });
  }

  async getResultByAttemptId(attemptId: string, userId: string, role: string) {
    const result = await this.resultRepository.findByAttemptId(attemptId);
    if (!result) throw ApiError.notFound('Result not found');

    if (role !== 'ADMIN' && result.attempt.userId !== userId) {
      throw ApiError.forbidden('You are not authorised to view this result');
    }

    return result;
  }

  async getAnalytics() {
    return this.resultRepository.getAnalytics();
  }
}
