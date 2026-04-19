import { Role } from '@prisma/client';
import { UserRepository } from '../repositories/UserRepository';
import { ApiError } from '../utils/ApiError';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { Student } from '../models/Student';
import { Admin } from '../models/Admin';
import { User } from '../models/User';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }


  async register(name: string, email: string, password: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    if (password.length < 6) {
      throw ApiError.badRequest('Password must be at least 6 characters');
    }

    const hashedPassword = await hashPassword(password);

    const userRecord = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: Role.STUDENT,
    });

    const student = new Student(
      userRecord.id,
      userRecord.name,
      userRecord.email,
      userRecord.password,
      userRecord.createdAt
    );

    const token = signToken({ userId: userRecord.id, role: userRecord.role });
    return { user: student.toPublicJSON(), token };
  }

  async login(email: string, password: string) {
    const userRecord = await this.userRepository.findByEmail(
      email.toLowerCase().trim()
    );
    if (!userRecord) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const valid = await comparePassword(password, userRecord.password);
    if (!valid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    let userModel: User;
    if (userRecord.role === Role.ADMIN) {
      userModel = new Admin(
        userRecord.id,
        userRecord.name,
        userRecord.email,
        userRecord.password,
        userRecord.createdAt
      );
    } else {
      userModel = new Student(
        userRecord.id,
        userRecord.name,
        userRecord.email,
        userRecord.password,
        userRecord.createdAt
      );
    }

    const token = signToken({ userId: userRecord.id, role: userRecord.role });
    return { user: userModel.toPublicJSON(), token };
  }
}
