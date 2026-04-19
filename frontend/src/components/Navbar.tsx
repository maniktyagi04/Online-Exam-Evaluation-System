import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAdmin ? '/admin' : '/student'} className="navbar-brand">
          ⚡ ExamFlow
        </Link>

        <div className="navbar-nav">
          {isAdmin ? (
            <>
              <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
              <Link to="/admin/exams" className={isActive('/admin/exams')}>Exams</Link>
              <Link to="/admin/attempts" className={isActive('/admin/attempts')}>Attempts</Link>
            </>
          ) : (
            <>
              <Link to="/student" className={isActive('/student')}>Dashboard</Link>
            </>
          )}

          <span className={`nav-role-badge ${isAdmin ? 'badge-admin' : 'badge-student'}`}>
            {user?.role}
          </span>

          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '0.25rem' }}>
            {user?.name}
          </span>

          <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
