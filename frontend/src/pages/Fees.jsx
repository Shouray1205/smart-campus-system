import React, { useState, useEffect } from 'react';
import { feesApi, studentsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { CreditCard, CheckCircle2, Plus, Receipt } from 'lucide-react';

export default function Fees() {
  const { user, isStudent, isAdmin } = useAuth();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Pay Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');

  // Create Fee Modal (Admin)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({
    studentId: '',
    feeType: 'TUITION',
    amount: '45000.00',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remarks: 'Semester Fee',
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchFees = async () => {
    setLoading(true);
    try {
      if (isStudent && user?.profileId) {
        const res = await feesApi.getByStudent(user.profileId);
        if (res.success) setFees(res.data);
      } else if (isAdmin) {
        const res = await feesApi.getAll();
        if (res.success) setFees(res.data);
        const sRes = await studentsApi.getAll();
        if (sRes.success) {
          setStudents(sRes.data);
          if (sRes.data.length > 0 && !createData.studentId) {
            setCreateData((prev) => ({ ...prev, studentId: sRes.data[0].id }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [user, isStudent, isAdmin]);

  const handlePayClick = (fee) => {
    setSelectedFee(fee);
    const due = Number(fee.amount) - Number(fee.paidAmount || 0);
    setPayAmount(due.toFixed(2));
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      await feesApi.pay(selectedFee.id, parseFloat(payAmount));
      setFeedback({ type: 'success', message: 'Payment successfully ho gaya! Transaction receipt generate ho chuka hai.' });
      setIsPayModalOpen(false);
      fetchFees();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Payment process karne me error aayi' });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await feesApi.create(createData.studentId, {
        feeType: createData.feeType,
        amount: parseFloat(createData.amount),
        dueDate: createData.dueDate,
        remarks: createData.remarks,
      });
      setFeedback({ type: 'success', message: 'Student ke liye fee invoice generate ho gaya' });
      setIsCreateModalOpen(false);
      fetchFees();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Invoice create karne me error aayi' });
    }
  };

  const filteredFees = fees.filter((f) => {
    if (!statusFilter) return true;
    return f.paymentStatus === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Fees & Payment Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student fee invoices, receipts, and online payment processing
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Fee Invoice</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold text-sm">
            ×
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
        >
          <option value="">All Payment Statuses</option>
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="PARTIAL">PARTIAL</option>
        </select>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Total (₹)</th>
                <th className="px-5 py-3">Paid (₹)</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Txn ID</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-slate-400">Loading fee records...</td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-slate-400">No fee records found.</td>
                </tr>
              ) : (
                filteredFees.map((f) => {
                  const balance = Number(f.amount) - Number(f.paidAmount || 0);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-slate-800">
                          {f.student?.user?.fullName || 'Student'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {f.student?.enrollmentNo}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-700">{f.feeType}</td>
                      <td className="px-5 py-3 font-bold text-slate-900">
                        ₹{Number(f.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3 font-semibold text-emerald-700">
                        ₹{Number(f.paidAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{f.dueDate}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            f.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : f.paymentStatus === 'PARTIAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {f.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                        {f.transactionId || '-'}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {f.paymentStatus !== 'PAID' ? (
                          <button
                            onClick={() => handlePayClick(f)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs"
                          >
                            Pay Online (₹{balance.toLocaleString('en-IN')})
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pay Fees (Indian Rupees ₹)"
      >
        <form onSubmit={handlePaySubmit} className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-800">{selectedFee?.feeType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Billed:</span>
              <span className="font-bold text-slate-800">
                ₹{Number(selectedFee?.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Remaining Balance:</span>
              <span className="font-bold text-rose-600">
                ₹{(Number(selectedFee?.amount || 0) - Number(selectedFee?.paidAmount || 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Payment Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 shrink-0 text-blue-600" />
            <span>Digital payment receipt with unique Transaction ID generate hoga.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
            >
              Confirm & Pay ₹{Number(payAmount || 0).toLocaleString('en-IN')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Issue Fee Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Issue Fee Invoice"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Select Student</label>
            <select
              value={createData.studentId}
              onChange={(e) => setCreateData({ ...createData, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.fullName} ({s.enrollmentNo}) - {s.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={createData.feeType}
                onChange={(e) => setCreateData({ ...createData, feeType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="TUITION">TUITION</option>
                <option value="EXAM">EXAM</option>
                <option value="LIBRARY">LIBRARY</option>
                <option value="HOSTEL">HOSTEL</option>
                <option value="LABORATORY">LABORATORY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={createData.amount}
                onChange={(e) => setCreateData({ ...createData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                placeholder="45000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={createData.dueDate}
              onChange={(e) => setCreateData({ ...createData, dueDate: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Remarks</label>
            <input
              type="text"
              value={createData.remarks}
              onChange={(e) => setCreateData({ ...createData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              placeholder="e.g. Semester 3 Tuition Fee"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
