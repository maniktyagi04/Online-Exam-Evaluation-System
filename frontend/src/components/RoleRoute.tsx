import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requiredRole: 'ADMIN' | 'STUDENT';
}

const RoleRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/student'} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
