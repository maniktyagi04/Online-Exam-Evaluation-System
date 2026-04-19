import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboardApi, DashboardData } from '../../api/student';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await getStudentDashboardApi();
      setData(dashboardData);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId: string) => {
    sessionStorage.setItem('currentExamId', examId);
    navigate(`/student/exam/${examId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'badge-published';
      case 'IN_PROGRESS': return 'badge-draft';
      default: return 'btn-ghost';
    }
  };

  if (loading) return <div className="page"><p>Loading dashboard...</p></div>;
  if (!data) return <div className="page"><p>No data available.</p></div>;

  return (
    <div className="page">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.name}! 👋</h1>
        <p>Monitor your progress and explore available examinations.</p>
      </header>

      {/* Stats Section */}
      <section className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="stat-card">
          <div className="stat-icon purple">📚</div>
          <div>
            <div className="stat-value">{data.stats.totalAvailable}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">✍️</div>
          <div>
            <div className="stat-value">{data.stats.attempted}</div>
            <div className="stat-label">Attempted</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📈</div>
          <div>
            <div className="stat-value">{data.stats.avgScore}%</div>
            <div className="stat-label">Avg. Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">🏆</div>
          <div>
            <div className="stat-value">{data.stats.highestScore}%</div>
            <div className="stat-label">Highest</div>
          </div>
        </div>
      </section>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Exams Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Available Exams</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.exams.length === 0 && <p>No exams available at the moment.</p>}
            {data.exams.map((exam) => (
              <div key={exam.id} className="card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{exam.title}</h3>
                    <span className={`badge ${exam.status === 'COMPLETED' ? 'badge-published' : exam.status === 'IN_PROGRESS' ? 'badge-draft' : ''}`} style={{ fontSize: '0.65rem' }}>
                      {exam.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem', maxWidth: '500px' }}>{exam.description}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    <span>⏱ {exam.duration} mins</span>
                    <span>📝 {exam.questions?.length || 0} Questions</span>
                  </div>
                </div>
                
                <div style={{ marginLeft: '2rem' }}>
                  {exam.status === 'NOT_STARTED' && (
                    <button className="btn btn-primary" onClick={() => handleStartExam(exam.id)}>Start Exam</button>
                  )}
                  {exam.status === 'IN_PROGRESS' && (
                    <button className="btn btn-secondary" onClick={() => handleStartExam(exam.id)}>Resume Exam</button>
                  )}
                  {exam.status === 'COMPLETED' && (
                    <button className="btn btn-ghost" onClick={() => navigate(`/student/result/${exam.attemptId}`)}>View Result</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Performance</h2>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/student/history')}>View All</button>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            {data.recentAttempts.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>No attempts yet. Take an exam to see your performance!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {data.recentAttempts.map((attempt) => (
                  <div key={attempt.id} style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{attempt.examTitle}</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: attempt.percentage >= 80 ? 'var(--color-success)' : attempt.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                      }}>
                        {attempt.percentage}%
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: '#f1f5f9', 
                      borderRadius: '4px', 
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        width: `${attempt.percentage}%`, 
                        height: '100%', 
                        background: attempt.percentage >= 80 ? 'var(--color-success)' : attempt.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                        transition: 'width 0.6s ease-in-out'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                      Completed on {new Date(attempt.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudentDashboard;
