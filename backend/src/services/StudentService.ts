import { ExamRepository } from '../repositories/ExamRepository';
import { AttemptRepository } from '../repositories/AttemptRepository';
import { ApiError } from '../utils/ApiError';

export class StudentService {
  private examRepository: ExamRepository;
  private attemptRepository: AttemptRepository;

  constructor() {
    this.examRepository = new ExamRepository();
    this.attemptRepository = new AttemptRepository();
  }

  async getDashboardData(userId: string) {

    const stats = await this.attemptRepository.getStudentStats(userId);
    const publishedExams = await this.examRepository.findPublished();
    

    const userAttempts = await this.attemptRepository.findByUser(userId);
    
    const examsWithStatus = publishedExams.map(exam => {
      const attempt = userAttempts.find(a => a.examId === exam.id);
      let status = 'NOT_STARTED';
      
      if (attempt) {
        status = attempt.endTime ? 'COMPLETED' : 'IN_PROGRESS';
      }

      return {
        ...exam,
        status,
        attemptId: attempt?.id || null
      };
    });

    const dashboardStats = {
      totalAvailable: publishedExams.length,
      attempted: stats.attemptedCount,
      avgScore: stats.avgScore,
      highestScore: stats.highestScore
    };

    const recentAttempts = userAttempts
      .filter(a => a.endTime !== null)
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        examTitle: a.exam.title,
        score: a.score,
        percentage: a.result?.percentage || 0,
        date: a.endTime
      }));

    return {
      stats: dashboardStats,
      exams: examsWithStatus,
      recentAttempts
    };
  }

  async getAttemptHistory(userId: string) {
    const attempts = await this.attemptRepository.findByUser(userId);
    return attempts.map(a => ({
      id: a.id,
      examId: a.examId,
      examTitle: a.exam.title,
      duration: a.exam.duration,
      startTime: a.startTime,
      endTime: a.endTime,
      score: a.score,
      percentage: a.result?.percentage || 0,
      status: a.endTime ? 'COMPLETED' : 'IN_PROGRESS'
    }));
  }
}
