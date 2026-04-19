import axios from 'axios';

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('exam_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('exam_token');
      localStorage.removeItem('exam_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
