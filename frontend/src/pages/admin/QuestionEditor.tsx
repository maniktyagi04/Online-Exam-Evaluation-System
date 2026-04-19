import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamByIdApi, addQuestionApi } from '../../api/exams';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Exam, Question } from '../../types';

interface OptionForm { optionText: string; isCorrect: boolean; }

interface QuestionForm {
  text: string;
  type: 'MCQ' | 'DESCRIPTIVE';
  marks: string;
  keywords: string;
  options: OptionForm[];
}

const defaultQuestion: QuestionForm = {
  text: '',
  type: 'MCQ',
  marks: '5',
  keywords: '',
  options: [
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
  ],
};

const QuestionEditor: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate    = useNavigate();

  const [exam, setExam]         = useState<Exam | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [form, setForm]         = useState<QuestionForm>(defaultQuestion);
  const [saving, setSaving]     = useState(false);

  const loadExam = () =>
    getExamByIdApi(examId!)
      .then(setExam)
      .catch(() => setError('Failed to load exam.'))
      .finally(() => setLoading(false));

  useEffect(() => { if (examId) loadExam(); }, [examId]);

  const setOption = (i: number, field: keyof OptionForm, value: string | boolean) => {
    const opts = [...form.options];
    // For isCorrect radio — only one correct at a time
    if (field === 'isCorrect' && value === true) {
      opts.forEach((o, idx) => (opts[idx] = { ...o, isCorrect: idx === i }));
    } else {
      opts[i] = { ...opts[i], [field]: value };
    }
    setForm({ ...form, options: opts });
  };

  const addOption = () =>
    setForm({ ...form, options: [...form.options, { optionText: '', isCorrect: false }] });

  const removeOption = (i: number) =>
    setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.type === 'MCQ') {
      const filled = form.options.filter((o) => o.optionText.trim());
      if (filled.length < 2) { setError('At least 2 options are required.'); return; }
      const hasCorrect = form.options.some((o) => o.isCorrect);
      if (!hasCorrect) { setError('Mark one option as correct.'); return; }
    }

    setSaving(true);
    try {
      await addQuestionApi(examId!, {
        text: form.text,
        type: form.type,
        marks: Number(form.marks),
        keywords: form.type === 'DESCRIPTIVE' ? form.keywords : undefined,
        options:
          form.type === 'MCQ'
            ? form.options
                .filter((o) => o.optionText.trim())
                .map((o) => ({ optionText: o.optionText, isCorrect: o.isCorrect }))
            : undefined,
      });
      setSuccess('Question added!');
      setForm(defaultQuestion);
      loadExam();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to add question.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading exam…" />;

  const questions: Question[] = exam?.questions ?? [];

  return (
    <div className="page" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/exams')}
            style={{ marginBottom: '0.5rem' }}>
            ← Back to Exams
          </button>
          <h2>{exam?.title}</h2>
          <p>
            {exam?.duration} min · {questions.length} question{questions.length !== 1 ? 's' : ''} ·{' '}
            <span className={`badge badge-${exam?.status?.toLowerCase()}`}>{exam?.status}</span>
          </p>
        </div>
      </div>

      <div className="layout-split">
        {/* Add Question Form */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>➕ Add Question</h3>

            {error   && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}

            <form onSubmit={handleSubmit} id="question-form">
              <div className="form-group">
                <label htmlFor="q-text">Question Text *</label>
                <textarea
                  id="q-text"
                  placeholder="Enter the question…"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="q-type">Question Type</label>
                  <select
                    id="q-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as 'MCQ' | 'DESCRIPTIVE' })
                    }
                  >
                    <option value="MCQ">MCQ — Multiple Choice</option>
                    <option value="DESCRIPTIVE">Descriptive — Written</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="q-marks">Marks *</label>
                  <input
                    id="q-marks"
                    type="number"
                    min={1}
                    max={100}
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: e.target.value })}
                    required
                  />
                </div>
              </div>

              {form.type === 'DESCRIPTIVE' && (
                <div className="form-group">
                  <label htmlFor="q-keywords">Keywords (comma separated) *</label>
                  <input
                    id="q-keywords"
                    type="text"
                    placeholder="e.g. React, Hooks, State, Lifecycle"
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    💡 These words will be used by the "Website Brain" to automatically grade student answers.
                  </p>
                </div>
              )}

              {/* MCQ Options */}
              {form.type === 'MCQ' && (
                <div>
                  <label style={{ marginBottom: '0.75rem', display: 'block' }}>
                    Options (mark one correct)
                  </label>
                  {form.options.map((opt, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}
                      id={`option-row-${i}`}
                    >
                      <input
                        id={`opt-correct-${i}`}
                        type="radio"
                        name="correct-option"
                        checked={opt.isCorrect}
                        onChange={() => setOption(i, 'isCorrect', true)}
                        title="Mark as correct"
                        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', flexShrink: 0 }}
                      />
                      <input
                        id={`opt-text-${i}`}
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt.optionText}
                        onChange={(e) => setOption(i, 'optionText', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      {form.options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeOption(i)}
                          title="Remove option"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={addOption}
                    style={{ marginTop: '0.25rem' }}
                    id="btn-add-option"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              {form.type === 'DESCRIPTIVE' && (
                <div className="alert alert-info" style={{ fontSize: '0.82rem' }}>
                  ℹ️ Descriptive answers are submitted as free text and require manual grading.
                </div>
              )}

              <button
                id="btn-add-question"
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: '1rem' }}
                disabled={saving}
              >
                {saving ? 'Adding…' : 'Add Question'}
              </button>
            </form>
          </div>
        </div>

        {/* Questions list */}
        <div>
          <div className="section-title">📋 Questions ({questions.length})</div>
          {questions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
              <p>No questions yet. Add your first question.</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div
                key={q.id}
                className="card"
                id={`q-list-${q.id}`}
                style={{ marginBottom: '0.75rem', padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span
                      style={{
                        background: 'var(--grad-primary)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className={`badge ${q.type === 'MCQ' ? 'badge-mcq' : 'badge-desc'}`}>
                      {q.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                    {q.marks}m
                  </span>
                </div>
                <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: q.options?.length ? '0.75rem' : 0 }}>
                  {q.text}
                </p>
                {q.options?.length > 0 && (
                  <div>
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        style={{
                          fontSize: '0.8rem',
                          color: opt.isCorrect ? 'var(--color-success)' : 'var(--color-text-muted)',
                          display: 'flex',
                          gap: '0.4rem',
                          marginBottom: '0.2rem',
                        }}
                      >
                        <span>{opt.isCorrect ? '✓' : '○'}</span>
                        <span>{opt.optionText}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
