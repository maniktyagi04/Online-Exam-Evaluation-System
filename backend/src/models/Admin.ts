import { User, Role } from './User';

/**
 * Admin extends User — has full management capabilities.
 */
export class Admin extends User {
  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date
  ) {
    super(id, name, email, password, Role.ADMIN, createdAt);
  }

  canManageExams(): boolean {
    return true;
  }

  canViewAnalytics(): boolean {
    return true;
  }

  canManageUsers(): boolean {
    return true;
  }
}
