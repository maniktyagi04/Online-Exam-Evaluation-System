import prisma from '../config/prisma';

export class ResultRepository {
  async findByAttemptId(attemptId: string) {
    return prisma.result.findUnique({
      where: { attemptId },
      include: {
        attempt: {
          include: {
            exam: true,
            user: { select: { id: true, name: true, email: true } },
            answers: {
              include: {
                question: { include: { options: true } },
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    attemptId: string;
    totalMarks: number;
    percentage: number;
  }) {
    return prisma.result.create({ data });
  }

  async getAnalytics() {
    const [totalAttempts, totalStudents, results, exams] = await Promise.all([
      prisma.attempt.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.result.findMany({
        include: { attempt: { include: { exam: true } } },
      }),
      prisma.exam.findMany({
        include: {
          _count: { select: { attempts: true, questions: true } },
          attempts: { include: { result: true } },
        },
      }),
    ]);

    const avgScore =
      results.length > 0
        ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        : 0;

    const examStats = exams.map((exam) => {
      const examResults = exam.attempts
        .filter((a) => a.result)
        .map((a) => a.result!.percentage);
      const examAvg =
        examResults.length > 0
          ? examResults.reduce((sum, p) => sum + p, 0) / examResults.length
          : 0;
      return {
        id: exam.id,
        title: exam.title,
        status: exam.status,
        totalAttempts: exam._count.attempts,
        averageScore: Math.round(examAvg * 100) / 100,
        questionCount: exam._count.questions,
      };
    });

    return {
      totalAttempts,
      totalStudents,
      totalExams: exams.length,
      averageScore: Math.round(avgScore * 100) / 100,
      examStats,
    };
  }
}
