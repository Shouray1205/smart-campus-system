import React, { useState, useEffect } from 'react';
import { attendanceApi, facultyAttendanceApi, coursesApi, studentsApi, facultyApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Users,
  GraduationCap,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    PRESENT:  'bg-emerald-100 text-emerald-800',
    ABSENT:   'bg-rose-100 text-rose-800',
    LATE:     'bg-amber-100 text-amber-800',
    ON_LEAVE: 'bg-amber-100 text-amber-800',
    HALF_DAY: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

export default function Attendance() {
  const { user, isStudent, isFaculty, isAdmin } = useAuth();

  // Admin tab: 'students' | 'faculty'
  const [attendanceType, setAttendanceType] = useState('students');

  // ── Shared ──
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // ── Student personal view ──
  const [studentStats, setStudentStats] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);

  // ── Faculty personal view ──
  const [myFacultyRecords, setMyFacultyRecords] = useState([]);

  // ── Admin → Student Attendance ──
  const [courses, setCourses]               = useState([]);
  const [students, setStudents]             = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate]     = useState(new Date().toISOString().split('T')[0]);
  const [deptFilter, setDeptFilter]         = useState('');
  const [sectionFilter, setSectionFilter]   = useState('');
  const [studentRecords, setStudentRecords] = useState([]);

  // ── Admin → Faculty Attendance ──
  const [facultyList, setFacultyList]   = useState([]);
  const [facultyDate, setFacultyDate]   = useState(new Date().toISOString().split('T')[0]);
  const [facultyRecords, setFacultyRecords] = useState([]);
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('');

  // ─── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Student personal view
        if (isStudent && user?.profileId) {
          const [statsRes, histRes] = await Promise.all([
            attendanceApi.getStudentStats(user.profileId),
            attendanceApi.getByStudent(user.profileId),
          ]);
          if (statsRes.success) setStudentStats(statsRes.data);
          if (histRes.success)  setStudentHistory(histRes.data);
        }

        // Faculty personal view — fetch their own faculty attendance records
        if (isFaculty && user?.profileId) {
          const res = await facultyAttendanceApi.getByFaculty(user.profileId);
          if (res.success) setMyFacultyRecords(res.data);
        }

        // Admin: load full lists
        if (isAdmin) {
          const [cRes, sRes, fRes] = await Promise.all([
            coursesApi.getAll(),
            studentsApi.getAll(),
            facultyApi.getAll(),
          ]);
          if (cRes.success) {
            setCourses(cRes.data);
            if (cRes.data.length > 0) setSelectedCourse(cRes.data[0].id);
          }
          if (sRes.success) setStudents(sRes.data);
          if (fRes.success) setFacultyList(fRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, isStudent, isFaculty, isAdmin]);

  // ─── Load student attendance for course & date (admin) ───────────────────
  const loadStudentAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    try {
      const res = await attendanceApi.getAll({ courseId: selectedCourse, date: selectedDate });
      if (res.success) setStudentRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Load faculty attendance for date (admin) ─────────────────────────────
  const loadFacultyAttendance = async () => {
    if (!facultyDate) return;
    try {
      const res = await facultyAttendanceApi.getAll(facultyDate);
      if (res.success) setFacultyRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAdmin && selectedCourse && selectedDate) loadStudentAttendance();
  }, [selectedCourse, selectedDate, isAdmin]);

  useEffect(() => {
    if (isAdmin && attendanceType === 'faculty' && facultyDate) loadFacultyAttendance();
  }, [attendanceType, facultyDate, isAdmin]);

  // ─── Mark Student Attendance ──────────────────────────────────────────────
  const handleMarkStudent = async (studentId, status) => {
    try {
      await attendanceApi.mark({
        studentId,
        courseId: selectedCourse,
        date: selectedDate,
        status,
        remarks: `Marked by ${user?.fullName || user?.username}`,
      });
      setFeedback({ type: 'success', message: 'Student attendance update ho gaya ✓' });
      loadStudentAttendance();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Attendance mark karne mein error aaya' });
    }
  };

  // ─── Mark Faculty Attendance ──────────────────────────────────────────────
  const handleMarkFaculty = async (facultyId, status) => {
    try {
      await facultyAttendanceApi.mark({
        facultyId,
        date: facultyDate,
        status,
        remarks: 'Daily check recorded by Admin',
      });
      setFeedback({ type: 'success', message: 'Faculty attendance record ho gaya ✓' });
      loadFacultyAttendance();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Faculty attendance mark karne mein error' });
    }
  };

  const getFacultyRecord  = (id) => facultyRecords.find((r) => r.faculty?.id === id);
  const getStudentRecord  = (id) => studentRecords.find((r) => r.student?.id === id);

  // Filtered lists for admin
  const filteredStudents = students.filter((s) => {
    const matchDept    = !deptFilter    || s.department === deptFilter;
    const matchSection = !sectionFilter || s.section    === sectionFilter;
    return matchDept && matchSection;
  });

  const filteredFaculty = facultyList.filter((f) =>
    !facultyDeptFilter || f.department === facultyDeptFilter
  );

  // Unique values for filter dropdowns
  const departments       = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const sections          = [...new Set(students.map((s) => s.section).filter(Boolean))];
  const facultyDepartments = [...new Set(facultyList.map((f) => f.department).filter(Boolean))];

  // Faculty attendance summary
  const myPresent  = myFacultyRecords.filter((r) => r.status === 'PRESENT').length;
  const myAbsent   = myFacultyRecords.filter((r) => r.status === 'ABSENT').length;
  const myLeave    = myFacultyRecords.filter((r) => r.status === 'ON_LEAVE' || r.status === 'HALF_DAY').length;
  const myTotal    = myFacultyRecords.length;
  const myPercent  = myTotal > 0 ? ((myPresent / myTotal) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm gap-2">
        <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
        Loading attendance data...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <span>Attendance Records</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Aapki personal attendance history'
              : isFaculty
              ? 'Aapki faculty attendance log — Admin dwara marked'
              : 'Admin: Student & Faculty attendance manage karo'}
          </p>
        </div>

        {/* Tab Switcher — only for Admin */}
        {isAdmin && (
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setAttendanceType('students')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                attendanceType === 'students'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Student Attendance</span>
            </button>
            <button
              onClick={() => setAttendanceType('faculty')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                attendanceType === 'faculty'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>Faculty Attendance</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Feedback Banner ── */}
      {feedback.message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold text-sm ml-4">×</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW 1: STUDENT PERSONAL ATTENDANCE
      ══════════════════════════════════════════════════════ */}
      {isStudent && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Attendance %" value={`${studentStats?.attendancePercentage ?? 85.0}%`} color="text-emerald-600" />
            <StatCard label="Total Lectures" value={studentStats?.totalClasses ?? 24} color="text-slate-800" />
            <StatCard label="Present" value={studentStats?.presentClasses ?? 21} color="text-blue-600" />
            <StatCard label="Absent" value={studentStats?.absentClasses ?? 3} color="text-rose-600" />
          </div>

          {/* Min. attendance note */}
          {(studentStats?.attendancePercentage ?? 85) < 75 && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Aapki attendance 75% se kam hai! Please apne class coordinator se milo.</span>
            </div>
          )}

          {/* History Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 font-semibold text-xs text-slate-700 bg-slate-50">
              Your Class Attendance History
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Course Code</th>
                    <th className="px-5 py-3">Course Name</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">
                        Koi attendance records nahi mile abhi tak.
                      </td>
                    </tr>
                  ) : (
                    studentHistory.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-slate-700 font-medium">{h.date}</td>
                        <td className="px-5 py-3 font-mono font-bold text-indigo-700">{h.course?.courseCode}</td>
                        <td className="px-5 py-3 text-slate-800">{h.course?.courseName}</td>
                        <td className="px-5 py-3"><StatusBadge status={h.status} /></td>
                        <td className="px-5 py-3 text-slate-500">{h.remarks || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW 2: FACULTY PERSONAL ATTENDANCE
          (Faculty ko apni attendance dikhti hai — admin ne mark ki hui)
      ══════════════════════════════════════════════════════ */}
      {isFaculty && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Attendance %" value={`${myPercent}%`} color="text-emerald-600" />
            <StatCard label="Total Days" value={myTotal} color="text-slate-800" />
            <StatCard label="Days Present" value={myPresent} color="text-blue-600" />
            <StatCard label="Absent / Leave" value={myAbsent + myLeave} color="text-rose-600" />
          </div>

          {/* Info note */}
          <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span>Yahan aapki daily attendance dikhti hai jo Admin ne mark ki hai. Kisi galti ke liye Admin se contact karo.</span>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 font-semibold text-xs text-slate-700 bg-slate-50 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              Meri Faculty Attendance Log
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Day</th>
                    <th className="px-5 py-3">Check-in Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myFacultyRecords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">
                        Abhi tak koi attendance record nahi hai. Admin se baat karo.
                      </td>
                    </tr>
                  ) : (
                    [...myFacultyRecords]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((r) => {
                        const d = new Date(r.date);
                        const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
                        return (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="px-5 py-3 text-slate-700 font-medium">{r.date}</td>
                            <td className="px-5 py-3 text-slate-500">{dayName}</td>
                            <td className="px-5 py-3 font-mono text-slate-600">
                              {r.checkInTime ? r.checkInTime.substring(0, 5) : '—'}
                            </td>
                            <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                            <td className="px-5 py-3 text-slate-500">{r.remarks || '—'}</td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW 3A: ADMIN → STUDENT ATTENDANCE
      ══════════════════════════════════════════════════════ */}
      {isAdmin && attendanceType === 'students' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Course */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseCode} — {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                />
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Department
                </label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Section
                </label>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="">All Sections</option>
                  {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="text-xs text-slate-400 self-center ml-auto">
                Showing <strong className="text-slate-700">{filteredStudents.length}</strong> students
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Enrollment No</th>
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Dept / Section</th>
                    <th className="px-5 py-3">Today's Status</th>
                    <th className="px-5 py-3 text-right">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">
                        Koi student nahi mila selected filters ke liye.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const record = getStudentRecord(s.id);
                      const cs = record?.status;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-mono font-medium text-slate-700">{s.enrollmentNo}</td>
                          <td className="px-5 py-3 font-semibold text-slate-900">{s.user?.fullName}</td>
                          <td className="px-5 py-3 text-slate-600">
                            <div>{s.department}</div>
                            {s.section && <div className="text-[11px] text-indigo-600 font-medium">Section {s.section}</div>}
                          </td>
                          <td className="px-5 py-3">
                            {cs ? <StatusBadge status={cs} /> : <span className="text-slate-400 italic">Pending</span>}
                          </td>
                          <td className="px-5 py-3 text-right space-x-1.5">
                            {['PRESENT', 'ABSENT', 'LATE'].map((st) => {
                              const colors = {
                                PRESENT: { active: 'bg-emerald-600 text-white', idle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                                ABSENT:  { active: 'bg-rose-600 text-white',    idle: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
                                LATE:    { active: 'bg-amber-600 text-white',   idle: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                              };
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleMarkStudent(s.id, st)}
                                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${cs === st ? colors[st].active : colors[st].idle}`}
                                >
                                  {st.charAt(0) + st.slice(1).toLowerCase()}
                                </button>
                              );
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW 3B: ADMIN → FACULTY ATTENDANCE
      ══════════════════════════════════════════════════════ */}
      {isAdmin && attendanceType === 'faculty' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Select Date</label>
                <input
                  type="date"
                  value={facultyDate}
                  onChange={(e) => setFacultyDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                />
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Department
                </label>
                <select
                  value={facultyDeptFilter}
                  onChange={(e) => setFacultyDeptFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                >
                  <option value="">All Departments</option>
                  {facultyDepartments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="text-xs text-slate-500 self-center">
                Faculty: <strong className="text-slate-800">{filteredFaculty.length}</strong>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Admin Daily Staff Register (Present / Absent / On Leave / Half Day)
            </div>
          </div>

          {/* Faculty Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3">Employee ID</th>
                    <th className="px-5 py-3">Faculty Name</th>
                    <th className="px-5 py-3">Dept / Designation</th>
                    <th className="px-5 py-3">Check-In</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Mark Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaculty.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">
                        Koi faculty member nahi mila.
                      </td>
                    </tr>
                  ) : (
                    filteredFaculty.map((f) => {
                      const record = getFacultyRecord(f.id);
                      const cs = record?.status;
                      const statuses = [
                        { key: 'PRESENT',  label: 'Present',  c: { active: 'bg-emerald-600 text-white', idle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' } },
                        { key: 'ON_LEAVE', label: 'Leave',    c: { active: 'bg-amber-600 text-white',   idle: 'bg-amber-50 text-amber-700 hover:bg-amber-100' } },
                        { key: 'HALF_DAY', label: 'Half Day', c: { active: 'bg-blue-600 text-white',    idle: 'bg-blue-50 text-blue-700 hover:bg-blue-100' } },
                        { key: 'ABSENT',   label: 'Absent',   c: { active: 'bg-rose-600 text-white',    idle: 'bg-rose-50 text-rose-700 hover:bg-rose-100' } },
                      ];
                      return (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-mono font-medium text-slate-700">{f.employeeId}</td>
                          <td className="px-5 py-3">
                            <div className="font-semibold text-slate-900">{f.user?.fullName}</div>
                            <div className="text-[11px] text-slate-400">{f.user?.email}</div>
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            <div>{f.department}</div>
                            <div className="text-[11px] text-indigo-600 font-medium">{f.designation}</div>
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-500">
                            {record?.checkInTime ? record.checkInTime.substring(0, 5) : '—'}
                          </td>
                          <td className="px-5 py-3">
                            {cs ? <StatusBadge status={cs} /> : <span className="text-slate-400 italic">Unrecorded</span>}
                          </td>
                          <td className="px-5 py-3 text-right space-x-1">
                            {statuses.map(({ key, label, c }) => (
                              <button
                                key={key}
                                onClick={() => handleMarkFaculty(f.id, key)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${cs === key ? c.active : c.idle}`}
                              >
                                {label}
                              </button>
                            ))}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
