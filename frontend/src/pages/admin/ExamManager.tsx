import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getExamsApi,
  createExamApi,
  updateExamApi,
  publishExamApi,
  deleteExamApi,
} from '../../api/exams';
import LoadingSpinner from '../../components/LoadingSpinner';
import type { Exam } from '../../types';

interface ExamForm {
  title: string;
  description: string;
  duration: string;
}

const defaultForm: ExamForm = { title: '', description: '', duration: '30' };

const ExamManager: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams]         = useState<Exam[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState<ExamForm>(defaultForm);
  const [saving, setSaving]       = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const loadExams = () =>
    getExamsApi()
      .then(setExams)
      .catch(() => setError('Failed to load exams.'))
      .finally(() => setLoading(false));

  useEffect(() => { loadExams(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (exam: Exam) => {
    setEditId(exam.id);
    setForm({
      title: exam.title,
      description: exam.description ?? '',
      duration: String(exam.duration),
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        duration: Number(form.duration),
      };
      if (editId) {
        await updateExamApi(editId, payload);
        setSuccess('Exam updated.');
      } else {
        await createExamApi(payload);
        setSuccess('Exam created.');
      }
      setShowModal(false);
      loadExams();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Save failed.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id: string) => {
    setPublishing(id);
    setError('');
    try {
      await publishExamApi(id);
      setSuccess('Exam published!');
      loadExams();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Publish failed.';
      setError(msg);
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this exam? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteExamApi(id);
      setSuccess('Exam deleted.');
      loadExams();
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading exams…" />;

  return (
    <div className="page" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="page-header">
        <div>
          <h2>Exam Manager</h2>
          <p>Create, edit, and publish exams.</p>
        </div>
        <button id="btn-create-exam" className="btn btn-primary" onClick={openCreate}>
          + New Exam
        </button>
      </div>

      {error   && <div className="alert alert-error"   id="exam-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success" id="exam-success">✓ {success}</div>}

      {exams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No exams yet</h3>
          <p>Click "New Exam" to create your first exam.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} id={`exam-row-${exam.id}`}>
                  <td style={{ fontWeight: 500 }}>{exam.title}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{exam.duration} min</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{exam._count?.questions ?? 0}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{exam._count?.attempts ?? 0}</td>
                  <td>
                    <span className={`badge badge-${exam.status.toLowerCase()}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        id={`btn-questions-${exam.id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/admin/exams/${exam.id}/questions`)}
                      >
                        Questions
                      </button>
                      <button
                        id={`btn-edit-${exam.id}`}
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(exam)}
                      >
                        Edit
                      </button>
                      {exam.status === 'DRAFT' && (
                        <button
                          id={`btn-publish-${exam.id}`}
                          className="btn btn-success btn-sm"
                          onClick={() => handlePublish(exam.id)}
                          disabled={publishing === exam.id}
                        >
                          {publishing === exam.id ? '…' : 'Publish'}
                        </button>
                      )}
                      <button
                        id={`btn-delete-${exam.id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(exam.id)}
                        disabled={deleting === exam.id}
                      >
                        {deleting === exam.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? 'Edit Exam' : 'Create New Exam'}</h3>
              <button
                id="btn-close-modal"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} id="exam-form">
              <div className="form-group">
                <label htmlFor="exam-title">Exam Title *</label>
                <input
                  id="exam-title"
                  type="text"
                  placeholder="e.g. Introduction to Data Structures"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="exam-desc">Description</label>
                <textarea
                  id="exam-desc"
                  placeholder="Optional description…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exam-duration">Duration (minutes) *</label>
                <input
                  id="exam-duration"
                  type="number"
                  min={1}
                  max={300}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  id="btn-save-exam"
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : editId ? 'Update Exam' : 'Create Exam'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManager;
