import apiClient from './client';
import type { Exam, Question } from '../types';

interface ExamsResponse { success: boolean; data: Exam[]; }
interface ExamResponse  { success: boolean; data: Exam;   }
interface QuestionResponse { success: boolean; data: Question; }

export const getExamsApi = async (): Promise<Exam[]> => {
  const res = await apiClient.get<ExamsResponse>('/exams');
  return res.data.data ?? [];
};

export const getExamByIdApi = async (id: string): Promise<Exam> => {
  const res = await apiClient.get<ExamResponse>(`/exams/${id}`);
  return res.data.data!;
};

export const createExamApi = async (data: {
  title: string;
  description?: string;
  duration: number;
}): Promise<Exam> => {
  const res = await apiClient.post<ExamResponse>('/exams', data);
  return res.data.data!;
};

export const updateExamApi = async (
  id: string,
  data: { title?: string; description?: string; duration?: number }
): Promise<Exam> => {
  const res = await apiClient.put<ExamResponse>(`/exams/${id}`, data);
  return res.data.data!;
};

export const publishExamApi = async (id: string): Promise<Exam> => {
  const res = await apiClient.patch<ExamResponse>(`/exams/${id}/publish`);
  return res.data.data!;
};

export const deleteExamApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/exams/${id}`);
};

export const addQuestionApi = async (
  examId: string,
  data: {
    text: string;
    type: 'MCQ' | 'DESCRIPTIVE';
    marks: number;
    options?: Array<{ optionText: string; isCorrect: boolean }>;
    keywords?: string;
  }
): Promise<Question> => {
  const res = await apiClient.post<QuestionResponse>(`/exams/${examId}/questions`, data);
  return res.data.data!;
};
