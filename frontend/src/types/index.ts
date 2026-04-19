// ──────────────────────────────────────────────
//  Domain Types for ExamFlow
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  questions?: Question[];
  _count?: { questions: number; attempts: number };
}

export interface Option {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  type: 'MCQ' | 'DESCRIPTIVE';
  marks: number;
  keywords?: string;
  options: Option[];
}

export interface Attempt {
  id: string;
  userId: string;
  examId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  exam?: Exam; // Allow full exam for active session
  answers?: Answer[];
  result?: Result;
}

export interface Answer {
  questionId: string;
  response: string;
  awardedMarks?: number;
  question?: Question;
}

export interface Result {
  id: string;
  attemptId: string;
  totalMarks: number;
  percentage: number;
  generatedAt: string;
  attempt?: {
    exam: Exam;
    user?: Pick<User, 'id' | 'name' | 'email'>;
    answers: Answer[];
  };
}

export interface Analytics {
  totalAttempts: number;
  totalStudents: number;
  totalExams: number;
  averageScore: number;
  examStats: Array<{
    id: string;
    title: string;
    status: string;
    totalAttempts: number;
    averageScore: number;
    questionCount: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}
