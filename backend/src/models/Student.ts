import { User, Role } from './User';

export class Student extends User {
  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date
  ) {
    super(id, name, email, password, Role.STUDENT, createdAt);
  }

  canAttemptExam(): boolean {
    return true;
  }

  canViewOwnResults(): boolean {
    return true;
  }
}
