import React, { useState, useEffect } from 'react';
import { facultyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { GraduationCap, Search, Plus, Trash2, Edit2, Award, Briefcase } from 'lucide-react';

export default function Faculty() {
  const { isAdmin } = useAuth();
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    employeeId: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: '',
    specialization: '',
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyApi.getAll(deptFilter);
      if (res.success) {
        setFacultyList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [deptFilter]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedFaculty(null);
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      employeeId: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'Ph.D / M.Tech',
      specialization: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setModalMode('edit');
    setSelectedFaculty(faculty);
    setFormData({
      fullName: faculty.user?.fullName || '',
      email: faculty.user?.email || '',
      username: faculty.user?.username || '',
      password: '',
      employeeId: faculty.employeeId,
      department: faculty.department,
      designation: faculty.designation,
      qualification: faculty.qualification || '',
      specialization: faculty.specialization || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        const payload = {
          employeeId: formData.employeeId,
          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          specialization: formData.specialization,
          user: {
            username: formData.username,
            password: formData.password || 'Faculty@123',
            email: formData.email,
            fullName: formData.fullName,
            role: 'ROLE_FACULTY',
          },
        };
        await facultyApi.create(payload);
        setFeedback({ type: 'success', message: 'Faculty profile created successfully' });
      } else {
        const payload = {
          ...selectedFaculty,
          employeeId: formData.employeeId,
          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          specialization: formData.specialization,
          user: {
            ...selectedFaculty.user,
            fullName: formData.fullName,
            email: formData.email,
          },
        };
        await facultyApi.update(selectedFaculty.id, payload);
        setFeedback({ type: 'success', message: 'Faculty profile updated successfully' });
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await facultyApi.delete(id);
      setFeedback({ type: 'success', message: 'Faculty member deleted' });
      fetchFaculty();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.employeeId?.toLowerCase().includes(q) ||
      f.user?.fullName?.toLowerCase().includes(q) ||
      f.department?.toLowerCase().includes(q) ||
      f.designation?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Faculty Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic staff profiles, designations, qualifications, and departments
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by faculty name, employee ID, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-hidden"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics & Communication">Electronics & Communication</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Faculty Member</th>
                <th className="px-5 py-3.5">Employee ID</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Designation</th>
                <th className="px-5 py-3.5">Specialization</th>
                {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    Loading faculty records...
                  </td>
                </tr>
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">
                    No faculty found.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{f.user?.fullName}</div>
                      <div className="text-slate-400 text-[11px]">{f.user?.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 font-medium">
                      {f.employeeId}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{f.department}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px]">
                        {f.designation}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <div>{f.specialization || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{f.qualification}</div>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(f)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Faculty' : 'Edit Faculty Details'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                placeholder="Dr. John Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                placeholder="smith@campus.edu"
              />
            </div>
          </div>

          {modalMode === 'create' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="dr_smith"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  placeholder="Defaults to Faculty@123"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                placeholder="Ph.D, M.Tech"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              placeholder="e.g. Distributed Computing & AI"
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
              {modalMode === 'create' ? 'Save Faculty' : 'Update Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
