import React, { useState, useEffect } from 'react';
import { timetableApi, coursesApi, facultyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Calendar, Plus, Clock, MapPin, User, Trash2, Edit2 } from 'lucide-react';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export default function Timetable() {
  const { isAdmin } = useAuth();
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deptFilter, setDeptFilter] = useState('Computer Science');
  const [semFilter, setSemFilter] = useState(3);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    facultyId: '',
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:30',
    roomNo: 'Hall 201',
    department: 'Computer Science',
    semester: 3,
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, cRes, fRes] = await Promise.all([
        timetableApi.getAll({ department: deptFilter, semester: semFilter }),
        coursesApi.getAll(),
        facultyApi.getAll(),
      ]);
      if (tRes.success) setTimetables(tRes.data);
      if (cRes.success) {
        setCourses(cRes.data);
        if (cRes.data.length > 0 && !formData.courseId) {
          setFormData((prev) => ({ ...prev, courseId: cRes.data[0].id }));
        }
      }
      if (fRes.success) {
        setFacultyList(fRes.data);
        if (fRes.data.length > 0 && !formData.facultyId) {
          setFormData((prev) => ({ ...prev, facultyId: fRes.data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deptFilter, semFilter]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedTimetable(null);
    setFormData({
      courseId: courses[0]?.id || '',
      facultyId: facultyList[0]?.id || '',
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '10:30',
      roomNo: 'Hall 201',
      department: deptFilter,
      semester: semFilter,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setModalMode('edit');
    setSelectedTimetable(t);
    setFormData({
      courseId: t.course?.id || '',
      facultyId: t.faculty?.id || '',
      dayOfWeek: t.dayOfWeek,
      startTime: t.startTime,
      endTime: t.endTime,
      roomNo: t.roomNo,
      department: t.department,
      semester: t.semester,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        course: { id: formData.courseId },
        faculty: { id: formData.facultyId },
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        roomNo: formData.roomNo,
        department: formData.department,
        semester: formData.semester,
      };

      if (modalMode === 'create') {
        await timetableApi.create(payload);
        setFeedback({ type: 'success', message: 'Timetable slot created successfully' });
      } else {
        await timetableApi.update(selectedTimetable.id, payload);
        setFeedback({ type: 'success', message: 'Timetable slot updated successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable slot?')) return;
    try {
      await timetableApi.delete(id);
      setFeedback({ type: 'success', message: 'Timetable slot deleted' });
      fetchData();
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
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Class Timetable & Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly academic class calendar, hall allocations, and faculty assignments
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Slot</span>
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

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
        >
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics & Communication">Electronics & Communication</option>
        </select>
        <select
          value={semFilter}
          onChange={(e) => setSemFilter(parseInt(e.target.value))}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DAYS.map((day) => {
          const slots = timetables.filter((t) => t.dayOfWeek === day);
          return (
            <div
              key={day}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 tracking-wider">
                  {day}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {slots.length} Lectures
                </span>
              </div>

              <div className="p-4 space-y-3 flex-1">
                {slots.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">No scheduled lectures</div>
                ) : (
                  slots.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {s.course?.courseCode}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-800 mt-0.5">
                            {s.course?.courseName}
                          </h4>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {s.roomNo}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {s.faculty?.user?.fullName || 'Faculty'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add Timetable Schedule' : 'Edit Timetable Schedule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} - {c.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Faculty</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.user?.fullName} ({f.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Day</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Room No</label>
              <input
                type="text"
                required
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                placeholder="Hall 201 / Lab 3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs"
            >
              {modalMode === 'create' ? 'Create Class Schedule' : 'Update Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
