import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startExamApi, submitExamApi } from '../../api/attempts';
import { useTimer } from '../../hooks/useTimer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/shared/ConfirmModal';
import type { Exam, Question } from '../../types';

const ExamAttempt: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQ, setActiveQ] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (examId) {
      initExam(examId);
    }
  }, [examId]);

  const initExam = async (id: string) => {
    try {
      setLoading(true);
      const attempt = await startExamApi(id);
      setAttemptId(attempt.id);
      setExam(attempt.exam ?? null);
      
      // Load any existing answers if resuming
      if (attempt.answers && attempt.answers.length > 0) {
        const loadedAnswers: Record<string, string> = {};
        attempt.answers.forEach((ans: any) => {
          loadedAnswers[ans.questionId] = ans.response;
        });
        setAnswers(loadedAnswers);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize exam.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (hasSubmitted.current || !attemptId || !exam) return;
      
      hasSubmitted.current = true;
      setSubmitting(true);
      setIsConfirmOpen(false);

      try {
        const answerList = (exam.questions ?? []).map((q) => ({
          questionId: q.id,
          response: answers[q.id] ?? '',
        }));
        
        const result = await submitExamApi(attemptId, answerList);
        navigate(`/student/result/${attemptId}`, {
          state: { result, auto },
        });
      } catch (err: any) {
        hasSubmitted.current = false;
        setError(err.response?.data?.message || 'Submission failed.');
        setSubmitting(false);
      }
    },
    [attemptId, answers, exam, navigate]
  );

  const { formatted, urgency } = useTimer({
    durationMinutes: exam?.duration ?? 60,
    onExpire: () => handleSubmit(true),
  });

  const questions: Question[] = exam?.questions ?? [];
  const answeredCount = Object.keys(answers).filter((k) => answers[k].trim() !== '').length;

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) return <LoadingSpinner message="Initializing examination session..." />;
  
  if (error) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ marginBottom: '1rem' }}>Session Error</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/student')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '900px' }}>
      {/* Timer & Status Bar */}
      <div className="timer-bar" style={{ position: 'sticky', top: '90px', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--color-primary-light)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
             Active Session: {exam?.title}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {answeredCount} of {questions.length} questions answered
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: '150px' }}>
          <div className={`timer-display timer-${urgency}`} style={{ fontSize: '2rem', lineHeight: 1 }}>
            {formatted}
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsConfirmOpen(true)}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Finish & Submit'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        {/* Question Navigation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setActiveQ(i)}
              className="btn btn-sm"
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                borderRadius: '8px',
                background: i === activeQ ? 'var(--color-primary)' : answers[q.id] ? '#dcfce7' : 'white',
                color: i === activeQ ? 'white' : answers[q.id] ? '#166534' : 'var(--color-text-muted)',
                border: i === activeQ ? 'none' : answers[q.id] ? '1px solid #bbf7d0' : '1px solid var(--color-border)',
                fontWeight: 700
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Panel */}
        <div className="card" style={{ padding: '3rem', animation: 'slideUp 0.4s ease' }}>
          {questions.length > 0 && (() => {
            const q = questions[activeQ];
            return (
              <div key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <span className={`badge ${q.type === 'MCQ' ? 'badge-mcq' : 'badge-desc'}`} style={{ padding: '0.4rem 1rem' }}>
                    {q.type} Question
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Worth {q.marks} Marks
                  </span>
                </div>

                <h2 style={{ fontSize: '1.4rem', lineHeight: 1.5, marginBottom: '2.5rem', color: 'var(--color-text)' }}>
                  {q.text}
                </h2>

                <div style={{ marginTop: '1.5rem' }}>
                  {q.type === 'MCQ' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {q.options.map((opt) => (
                        <label 
                          key={opt.id} 
                          className={`option-label ${answers[q.id] === opt.id ? 'selected' : ''}`}
                          style={{ padding: '1.25rem 1.5rem', borderRadius: '12px' }}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.id}
                            checked={answers[q.id] === opt.id}
                            onChange={() => setAnswer(q.id, opt.id)}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Your Detailed Answer</label>
                      <textarea
                        placeholder="Provide your comprehensive response here..."
                        value={answers[q.id] ?? ''}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        rows={10}
                        style={{ padding: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => setActiveQ(p => Math.max(0, p - 1))}
            disabled={activeQ === 0}
          >
            ← Previous Question
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setActiveQ(p => Math.min(questions.length - 1, p + 1))}
            disabled={activeQ === questions.length - 1}
          >
            Next Question →
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Submit Examination?"
        message={`You have answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to finish and submit your attempt? This action cannot be undone.`}
        confirmText="Yes, Submit My Exam"
        onConfirm={() => handleSubmit(false)}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default ExamAttempt;
