import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAttemptsApi } from '../../api/attempts';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Attempt } from '../../types';

const AttemptsList: React.FC = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getAllAttemptsApi()
      .then(setAttempts)
      .catch(() => setError('Failed to load attempts.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = attempts.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.exam as unknown as { title: string })?.title?.toLowerCase().includes(q) ||
      (a as unknown as { user: { name: string; email: string } }).user?.name?.toLowerCase().includes(q) ||
      (a as unknown as { user: { name: string; email: string } }).user?.email?.toLowerCase().includes(q)
    );
  });

  if (loading) return <LoadingSpinner message="Loading attempts…" />;

  return (
    <div className="page" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2>All Attempts</h2>
          <p>{attempts.length} total submission{attempts.length !== 1 ? 's' : ''}.</p>
        </div>
        <input
          id="search-attempts"
          type="text"
          placeholder="Search by name, email, or exam…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>{search ? 'No results' : 'No attempts yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Students have not attempted any exams yet.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Started</th>
                <th>Submitted</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const user = (a as unknown as { user: { name: string; email: string } }).user;
                const exam = (a as unknown as { exam: { title: string } }).exam;
                return (
                  <tr key={a.id} id={`attempt-row-${a.id}`}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{user?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {user?.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{exam?.title}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      {new Date(a.startTime).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {a.endTime ? (
                        <span style={{ color: 'var(--color-success)' }}>
                          ✓ {new Date(a.endTime).toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-warning)' }}>In progress</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {a.score !== null && a.score !== undefined ? a.score : '—'}
                    </td>
                    <td>
                      {a.result ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              a.result.percentage >= 50
                                ? 'var(--color-success)'
                                : 'var(--color-danger)',
                          }}
                        >
                          {a.result.percentage.toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {a.result && (
                        <button
                          id={`btn-view-result-${a.id}`}
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/student/result/${a.id}`)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttemptsList;
