import { QuestionType } from '@prisma/client';
import prisma from '../config/prisma';

export class QuestionRepository {
  async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
  }

  async findByExamId(examId: string) {
    return prisma.question.findMany({
      where: { examId },
      include: { options: true },
      orderBy: { marks: 'desc' },
    });
  }

  async create(data: {
    examId: string;
    text: string;
    type: QuestionType;
    marks: number;
    keywords?: string;
    options?: Array<{ optionText: string; isCorrect: boolean }>;
  }) {
    const { options, ...questionData } = data;
    return prisma.question.create({
      data: {
        ...questionData,
        options: options ? { create: options } : undefined,
      },
      include: { options: true },
    });
  }

  async update(id: string, data: { text?: string; marks?: number }) {
    return prisma.question.update({
      where: { id },
      data,
      include: { options: true },
    });
  }

  async delete(id: string) {
    await prisma.question.delete({ where: { id } });
  }
}
