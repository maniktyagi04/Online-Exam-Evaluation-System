import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttemptHistoryApi, AttemptHistoryItem } from '../../api/student';

const AttemptHistory: React.FC = () => {
  const [history, setHistory] = useState<AttemptHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [searchTerm, sortBy, history]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAttemptHistoryApi();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let result = [...history];
    
    if (searchTerm) {
      result = result.filter(item => 
        item.examTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      } else {
        return b.percentage - a.percentage;
      }
    });

    setFilteredHistory(result);
  };

  if (loading) return <div className="page"><p>Loading history...</p></div>;

  return (
    <div className="page">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Attempt History</h1>
          <p>Review all your past examinations and performance metrics.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0 }}>
            <label>Search Exams</label>
            <input 
              type="text" 
              placeholder="Filter by exam title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}>
              <option value="date">Most Recent</option>
              <option value="score">Highest Score</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Exam Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No attempts found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.examTitle}</td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {new Date(item.startTime).toLocaleDateString()}
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                      {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.status === 'COMPLETED' ? 'badge-published' : 'badge-draft'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.status === 'COMPLETED' ? item.score : '-'}</td>
                  <td>
                    {item.status === 'COMPLETED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${item.percentage}%`, 
                            height: '100%', 
                            background: item.percentage >= 80 ? 'var(--color-success)' : item.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-danger)'
                          }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.percentage}%</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    {item.status === 'COMPLETED' ? (
                      <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/student/result/${item.id}`)}>
                        View Details
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/student/exam/${item.id}`)}>
                        Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttemptHistory;
