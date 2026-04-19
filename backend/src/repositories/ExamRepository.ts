import { Exam, ExamStatus } from '@prisma/client';
import prisma from '../config/prisma';

export class ExamRepository {
  async findById(id: string) {
    return prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { marks: 'desc' },
        },
      },
    });
  }

  async findAll() {
    return prisma.exam.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: true, attempts: true } },
      },
    });
  }

  async findPublished() {
    return prisma.exam.findMany({
      where: { status: ExamStatus.PUBLISHED },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: true, attempts: true } },
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    duration: number;
  }) {
    return prisma.exam.create({ data });
  }

  async update(id: string, data: Partial<Exam>) {
    return prisma.exam.update({ where: { id }, data });
  }

  async publish(id: string) {
    return prisma.exam.update({
      where: { id },
      data: { status: ExamStatus.PUBLISHED },
    });
  }

  async delete(id: string) {
    await prisma.exam.delete({ where: { id } });
  }
}
