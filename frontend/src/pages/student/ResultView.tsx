import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getResultApi } from '../../api/results';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Result } from '../../types';

const ResultView: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate       = useNavigate();
  const location       = useLocation();

  const [result, setResult]   = useState<Result | null>(
    (location.state as { result?: Result })?.result ?? null
  );
  const [loading, setLoading] = useState(!result);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!result && attemptId) {
      getResultApi(attemptId)
        .then(setResult)
        .catch(() => setError('Could not load result.'))
        .finally(() => setLoading(false));
    }
  }, [attemptId, result]);

  if (loading) return <LoadingSpinner message="Loading result…" />;
  if (error)
    return (
      <div className="page">
        <div className="alert alert-error">⚠️ {error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/student')}>
          ← Back
        </button>
      </div>
    );
  if (!result) return null;

  const pct      = result.percentage;
  const passed   = pct >= 40;
  const radius   = 54;
  const circ     = 2 * Math.PI * radius;
  const offset   = circ - (pct / 100) * circ;

  const exam     = result.attempt?.exam;
  const answers  = result.attempt?.answers ?? [];
  const totalPossible = answers.reduce((s, a) => s + (a.question?.marks ?? 0), 0);

  return (
    <div className="page" style={{ animation: 'slideUp 0.4s ease', maxWidth: 800 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>{exam?.title ?? 'Exam Result'}</h2>
        <p style={{ fontSize: '0.9rem' }}>
          Completed on{' '}
          {new Date(result.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* Score Ring */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem' }}>
        <div className="result-score-ring">
          <svg className="score-circle" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6c63ff" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle className="score-circle-bg" cx="60" cy="60" r={radius} strokeWidth="10" />
            <circle
              className="score-circle-fill"
              cx="60"
              cy="60"
              r={radius}
              strokeWidth="10"
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score-text">
            <div className="score-number">{pct.toFixed(0)}%</div>
            <div className="score-label">{passed ? '✓ Passed' : '✗ Failed'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
              {result.totalMarks}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Marks Scored
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>
              {totalPossible}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Marks
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: passed ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              {passed ? 'PASS' : 'FAIL'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </div>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      {answers.length > 0 && (
        <div className="section">
          <div className="section-title">📝 Answer Review</div>
          {answers.map((ans, idx) => {
            const q        = ans.question;
            const awarded  = ans.awardedMarks ?? 0;
            const maxMarks = q?.marks ?? 0;
            const correct  = awarded === maxMarks && maxMarks > 0;

            return (
              <div
                key={idx}
                className="question-block"
                id={`review-q-${idx}`}
                style={{
                  borderLeft: `3px solid ${correct ? 'var(--color-success)' : q?.type === 'DESCRIPTIVE' ? 'var(--color-warning)' : 'var(--color-danger)'}`,
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    Q{idx + 1} · {q?.type ?? 'MCQ'}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: correct
                        ? 'var(--color-success)'
                        : q?.type === 'DESCRIPTIVE'
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {awarded}/{maxMarks} marks
                  </span>
                </div>
                <p style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>{q?.text}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-muted)' }}>Your answer: </strong>
                  {ans.response
                    ? q?.type === 'MCQ'
                      ? q?.options?.find((o) => o.id === ans.response)?.optionText ?? ans.response
                      : ans.response
                    : <span style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>No answer</span>
                  }
                </div>
                {q?.type === 'MCQ' && !correct && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-success)', marginTop: '0.3rem' }}>
                    ✓ Correct: {q?.options?.find((o) => o.isCorrect)?.optionText}
                  </div>
                )}
                {q?.type === 'DESCRIPTIVE' && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '0.3rem', fontWeight: 600 }}>
                    🤖 Auto-graded by System Brain based on keywords
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          id="btn-back-dashboard"
          className="btn btn-secondary"
          onClick={() => navigate('/student')}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultView;
