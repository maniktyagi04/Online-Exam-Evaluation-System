import apiClient from './client';
import { Exam } from '../types';

export interface DashboardStats {
  totalAvailable: number;
  attempted: number;
  avgScore: number;
  highestScore: number;
}

export interface ExamWithStatus extends Omit<Exam, 'status'> {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  attemptId: string | null;
}

export interface RecentAttempt {
  id: string;
  examTitle: string;
  score: number;
  percentage: number;
  date: string;
}

export interface DashboardData {
  stats: DashboardStats;
  exams: ExamWithStatus[];
  recentAttempts: RecentAttempt[];
}

export interface AttemptHistoryItem {
  id: string;
  examId: string;
  examTitle: string;
  duration: number;
  startTime: string;
  endTime: string;
  score: number;
  percentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export const getStudentDashboardApi = async (): Promise<DashboardData> => {
  const res = await apiClient.get<{ success: boolean; data: DashboardData }>('/student/dashboard');
  return res.data.data;
};


export const getAttemptHistoryApi = async (): Promise<AttemptHistoryItem[]> => {
  const res = await apiClient.get<{ success: boolean; data: AttemptHistoryItem[] }>('/student/history');
  return res.data.data;
};
