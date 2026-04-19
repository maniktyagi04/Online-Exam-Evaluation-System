import { Role } from '@prisma/client';

export { Role };

export class User {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly email: string;
  protected readonly password: string;
  protected readonly role: Role;
  protected readonly createdAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    createdAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }

  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }
  getRole(): Role { return this.role; }
  getCreatedAt(): Date { return this.createdAt; }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
