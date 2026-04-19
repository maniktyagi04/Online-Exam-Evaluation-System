import apiClient from './client';
import type { Attempt, Result } from '../types';

interface AttemptResponse  { success: boolean; data: Attempt;   }
interface AttemptsResponse { success: boolean; data: Attempt[]; }
interface ResultResponse   { success: boolean; data: Result;    }

export const startExamApi = async (examId: string): Promise<Attempt> => {
  const res = await apiClient.post<AttemptResponse>('/attempts/start', { examId });
  return res.data.data!;
};

export const submitExamApi = async (
  attemptId: string,
  answers: Array<{ questionId: string; response: string }>
): Promise<Result> => {
  const res = await apiClient.post<ResultResponse>(
    `/attempts/${attemptId}/submit`,
    { answers }
  );
  return res.data.data!;
};

export const getMyAttemptsApi = async (): Promise<Attempt[]> => {
  const res = await apiClient.get<AttemptsResponse>('/attempts/my');
  return res.data.data ?? [];
};

export const getAllAttemptsApi = async (): Promise<Attempt[]> => {
  const res = await apiClient.get<AttemptsResponse>('/attempts');
  return res.data.data ?? [];
};
