import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import Login    from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import ExamAttempt      from './pages/student/ExamAttempt';
import ResultView       from './pages/student/ResultView';
import AttemptHistory   from './pages/student/AttemptHistory';


import AdminDashboard from './pages/admin/AdminDashboard';
import ExamManager    from './pages/admin/ExamManager';
import QuestionEditor from './pages/admin/QuestionEditor';
import AttemptsList   from './pages/admin/AttemptsList';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin' : '/student'} replace />;
};

const AppRoutes: React.FC = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <RoleRoute requiredRole="STUDENT">
            <StudentDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <RoleRoute requiredRole="STUDENT">
            <AttemptHistory />
          </RoleRoute>
        }
      />
      <Route
        path="/student/exam/:examId"
        element={
          <RoleRoute requiredRole="STUDENT">
            <ExamAttempt />
          </RoleRoute>
        }
      />
      <Route
        path="/student/result/:attemptId"
        element={
          <ProtectedRoute>
            <ResultView />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <RoleRoute requiredRole="ADMIN">
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <RoleRoute requiredRole="ADMIN">
            <ExamManager />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/exams/:examId/questions"
        element={
          <RoleRoute requiredRole="ADMIN">
            <QuestionEditor />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/attempts"
        element={
          <RoleRoute requiredRole="ADMIN">
            <AttemptsList />
          </RoleRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
