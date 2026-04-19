import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsApi } from '../../api/results';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Analytics } from '../../types';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getAnalyticsApi()
      .then(setAnalytics)
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics…" />;

  return (
    <div className="page" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Overview of exam performance and student activity.</p>
        </div>
        <Link to="/admin/exams" className="btn btn-primary" id="btn-manage-exams">
          + Manage Exams
        </Link>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div>
            <div className="stat-value">{analytics?.totalExams ?? 0}</div>
            <div className="stat-label">Total Exams</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">🎓</div>
          <div>
            <div className="stat-value">{analytics?.totalStudents ?? 0}</div>
            <div className="stat-label">Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{analytics?.totalAttempts ?? 0}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">📊</div>
          <div>
            <div className="stat-value">{analytics?.averageScore ?? 0}%</div>
            <div className="stat-label">Avg Score</div>
          </div>
        </div>
      </div>

      {/* Exam Performance Table */}
      <div className="section">
        <div className="section-title">📈 Exam Performance</div>

        {!analytics?.examStats?.length ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No data yet</h3>
            <p>Create and publish exams to see analytics here.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Status</th>
                  <th>Questions</th>
                  <th>Attempts</th>
                  <th>Avg Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {analytics.examStats.map((stat) => (
                  <tr key={stat.id} id={`analytics-row-${stat.id}`}>
                    <td style={{ fontWeight: 500 }}>{stat.title}</td>
                    <td>
                      <span className={`badge badge-${stat.status.toLowerCase()}`}>
                        {stat.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{stat.questionCount}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{stat.totalAttempts}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            stat.averageScore >= 75
                              ? 'var(--color-success)'
                              : stat.averageScore >= 40
                              ? 'var(--color-warning)'
                              : 'var(--color-danger)',
                        }}
                      >
                        {stat.averageScore}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="progress-track" style={{ width: 90 }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${stat.averageScore}%` }}
                          />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', minWidth: 35 }}>
                          {stat.averageScore}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid-2">
        <Link to="/admin/exams" className="card" style={{ textDecoration: 'none' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>📝 Exam Manager</h3>
          <p style={{ fontSize: '0.88rem' }}>
            Create, edit, and publish exams. Add MCQ and descriptive questions.
          </p>
        </Link>
        <Link to="/admin/attempts" className="card" style={{ textDecoration: 'none' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>📋 View Attempts</h3>
          <p style={{ fontSize: '0.88rem' }}>
            Browse all student submissions and individual results.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
