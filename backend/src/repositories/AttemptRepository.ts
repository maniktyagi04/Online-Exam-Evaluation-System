import prisma from '../config/prisma';

export class AttemptRepository {
  async findById(id: string) {
    return prisma.attempt.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            question: { include: { options: true } },
          },
        },
        exam: {
          include: { questions: { include: { options: true } } },
        },
        user: { select: { id: true, name: true, email: true, role: true } },
        result: true,
      },
    });
  }

  async findByUserAndExam(userId: string, examId: string) {
    return prisma.attempt.findFirst({
      where: { userId, examId },
      include: {
        exam: {
          include: { questions: { include: { options: true } } },
        },
        result: true,
      },
    });
  }

  async findByUser(userId: string) {
    return prisma.attempt.findMany({
      where: { userId },
      include: {
        exam: { select: { id: true, title: true, duration: true } },
        result: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findByExam(examId: string) {
    return prisma.attempt.findMany({
      where: { examId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        result: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findAll() {
    return prisma.attempt.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        exam: { select: { id: true, title: true } },
        result: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async create(data: { userId: string; examId: string }) {
    return prisma.attempt.create({
      data,
      include: { exam: { include: { questions: { include: { options: true } } } } },
    });
  }

  async createAnswers(
    attemptId: string,
    answers: Array<{ questionId: string; response: string; awardedMarks: number }>
  ) {
    return prisma.answer.createMany({
      data: answers.map((a) => ({ ...a, attemptId })),
    });
  }

  async complete(id: string, score: number) {
    return prisma.attempt.update({
      where: { id },
      data: { endTime: new Date(), score },
    });
  }

  async getStudentStats(userId: string) {
    const attempts = await prisma.attempt.findMany({
      where: { userId, NOT: { endTime: null } },
      include: { result: true },
    });

    const attemptedCount = new Set(attempts.map((a) => a.examId)).size;
    const scores = attempts.filter((a) => a.result).map((a) => a.result!.percentage);
    
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    return {
      attemptedCount,
      avgScore: Number(avgScore.toFixed(2)),
      highestScore: Number(highestScore.toFixed(2)),
    };
  }
}
