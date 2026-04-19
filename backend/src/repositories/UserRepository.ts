import { User as PrismaUser, Role } from '@prisma/client';
import prisma from '../config/prisma';

export class UserRepository {
  async findById(id: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<PrismaUser[]> {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): Promise<PrismaUser> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<PrismaUser>): Promise<PrismaUser> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
