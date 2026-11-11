import React, { useState, useEffect } from 'react';
import { noticesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Bell, Plus, Trash2, Edit2, AlertCircle, Pin, Calendar, User } from 'lucide-react';

export default function Notices() {
  const { user, isAdmin, isFaculty } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'ALL',
    important: false,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticesApi.getAll(user?.role);
      if (res.success) setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        postedBy: user?.fullName || user?.username,
      };
      await noticesApi.create(payload);
      setFeedback({ type: 'success', message: 'Campus announcement published successfully' });
      setIsModalOpen(false);
      setFormData({
        title: '',
        content: '',
        targetAudience: 'ALL',
        important: false,
      });
      fetchNotices();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to post notice' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await noticesApi.delete(id);
      setFeedback({ type: 'success', message: 'Notice deleted' });
      fetchNotices();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Campus Notice Board</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official university announcements, circulars, exam notices, and event updates
          </p>
        </div>

        {(isAdmin || isFaculty) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold">
            ×
          </button>
        </div>
      )}

      {/* Notices List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading campus notices...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">No announcements found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
                n.important ? 'border-red-200 bg-red-50/20 ring-1 ring-red-500/10' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        n.targetAudience === 'ALL'
                          ? 'bg-blue-100 text-blue-800'
                          : n.targetAudience === 'STUDENTS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {n.targetAudience}
                    </span>
                    {n.important && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        <Pin className="w-2.5 h-2.5" />
                        Urgent
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">{n.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {n.content}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {n.postedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Campus Announcement"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              placeholder="e.g. Schedule for Mid-Term Examination 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="ALL">Everyone (All Campus)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.important}
                  onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-red-700 font-semibold">Mark as Urgent Notice</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Content / Body</label>
            <textarea
              rows="4"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs leading-relaxed"
              placeholder="Enter full details of circular or announcement..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
            >
              Publish Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
