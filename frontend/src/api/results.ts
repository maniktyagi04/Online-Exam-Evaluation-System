import apiClient from './client';
import type { Result, Analytics } from '../types';

interface ResultResponse    { success: boolean; data: Result;    }
interface AnalyticsResponse { success: boolean; data: Analytics; }

export const getResultApi = async (attemptId: string): Promise<Result> => {
  const res = await apiClient.get<ResultResponse>(`/results/${attemptId}`);
  return res.data.data!;
};

export const getAnalyticsApi = async (): Promise<Analytics> => {
  const res = await apiClient.get<AnalyticsResponse>('/results/analytics');
  return res.data.data!;
};
