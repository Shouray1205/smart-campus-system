import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Shield,
  UserCheck,
  User,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Building2,
  Calendar,
  BookOpen,
  Briefcase,
  Award,
  IdCard
} from 'lucide-react';

export default function Login() {
  const { login, register } = useAuth();
  // 'login' | 'student-admission' | 'faculty-join'
  const [activeMode, setActiveMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // New Student Admission Form
  const [studentForm, setStudentForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    enrollmentNo: `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    studentDepartment: 'Computer Science',
    semester: 1,
    section: 'A',
    dateOfBirth: '2004-01-15',
    address: '',
    guardianName: '',
    guardianPhone: '',
  });

  // New Faculty Onboarding Form
  const [facultyForm, setFacultyForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    employeeId: `FAC-${Math.floor(2000 + Math.random() * 8000)}`,
    facultyDepartment: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: 'M.Tech / Ph.D in Computer Science',
    specialization: 'Artificial Intelligence & Cloud Systems',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Galat username ya password dala hai. Kripya check karein!');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAdmission = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const payload = {
        ...studentForm,
        role: 'ROLE_STUDENT',
      };
      await register(payload);
      setSuccessMsg(
        `Badhai ho! New Admission ho gaya! Enrollment ID: ${studentForm.enrollmentNo}. Ab aap Username: "${studentForm.username}" ke sath turant login kar sakte hain.`
      );
      setUsername(studentForm.username);
      setPassword(studentForm.password);
      setActiveMode('login');
    } catch (err) {
      setError(err.message || 'Admission registration me koi error aayi hai');
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyOnboarding = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const payload = {
        ...facultyForm,
        role: 'ROLE_FACULTY',
      };
      await register(payload);
      setSuccessMsg(
        `Faculty ID successfully ban gayi! Employee ID: ${facultyForm.employeeId}. Ab aap Username: "${facultyForm.username}" ke sath turant login karein.`
      );
      setUsername(facultyForm.username);
      setPassword(facultyForm.password);
      setActiveMode('login');
    } catch (err) {
      setError(err.message || 'Faculty registration fail hua');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className={`w-full ${activeMode === 'login' ? 'max-w-md' : 'max-w-2xl'} transition-all duration-300 relative z-10`}>
        {/* Campus Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 items-center justify-center text-white shadow-xl shadow-indigo-500/25 ring-4 ring-white/10 mb-3 animate-bounce-slow">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Campus Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete Digital University Management System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/80 p-6 sm:p-8">
          {/* Navigation Mode Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6">
            <button
              onClick={() => { setActiveMode('login'); setError(''); }}
              className={`text-xs font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              onClick={() => { setActiveMode('student-admission'); setError(''); }}
              className={`text-xs font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'student-admission'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>New Student</span>
            </button>
            <button
              onClick={() => { setActiveMode('faculty-join'); setError(''); }}
              className={`text-xs font-semibold py-2.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'faculty-join'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>New Faculty</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {activeMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (e.g. admin)"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Campus'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Fast Logins */}
              <div className="pt-5 mt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>Quick Demo Logins</span>
                  </span>
                  <span className="text-[10px] text-slate-500">1-Click Auto-Fill</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => quickLogin('admin', 'Admin@123')}
                    className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium text-center transition-all flex flex-col items-center gap-1 group"
                  >
                    <Shield className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('dr_smith', 'Faculty@123')}
                    className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium text-center transition-all flex flex-col items-center gap-1 group"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Faculty</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickLogin('alex_student', 'Student@123')}
                    className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-medium text-center transition-all flex flex-col items-center gap-1 group"
                  >
                    <User className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Student</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. NEW STUDENT ADMISSION FORM */}
          {activeMode === 'student-admission' && (
            <form onSubmit={handleStudentAdmission} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>New Student Admission Form</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Naye student ki registration aur student ID yahan generate hogi
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Enrollment ID:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{studentForm.enrollmentNo}</span>
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.username}
                    onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="e.g. rahul_kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Login Password *</label>
                  <input
                    type="password"
                    required
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="e.g. Rahul Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="rahul@student.campus.edu"
                  />
                </div>
              </div>

              {/* Academic Course Allocation */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department *</label>
                  <select
                    value={studentForm.studentDepartment}
                    onChange={(e) => setStudentForm({ ...studentForm, studentDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Comm.</option>
                    <option value="Mechanical Engineering">Mechanical Engg.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Semester *</label>
                  <select
                    value={studentForm.semester}
                    onChange={(e) => setStudentForm({ ...studentForm, semester: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Section</label>
                  <input
                    type="text"
                    value={studentForm.section}
                    onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-emerald-500"
                    placeholder="A"
                  />
                </div>
              </div>

              {/* Contact & Guardian */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Guardian / Parent Name</label>
                  <input
                    type="text"
                    value={studentForm.guardianName}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Guardian Phone No</label>
                  <input
                    type="text"
                    value={studentForm.guardianPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Processing Admission...' : 'Confirm Student Admission & Generate Login ID'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. NEW FACULTY ONBOARDING FORM */}
          {activeMode === 'faculty-join' && (
            <form onSubmit={handleFacultyOnboarding} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Faculty Member Onboarding</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Naye professor / faculty member ka account aur employee profile create karein
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Employee ID:</span>
                  <span className="text-xs font-mono font-bold text-purple-400">{facultyForm.employeeId}</span>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Username *</label>
                  <input
                    type="text"
                    required
                    value={facultyForm.username}
                    onChange={(e) => setFacultyForm({ ...facultyForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500"
                    placeholder="e.g. dr_sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={facultyForm.password}
                    onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {/* Faculty Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    value={facultyForm.fullName}
                    onChange={(e) => setFacultyForm({ ...facultyForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500"
                    placeholder="Dr. Rajesh Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-purple-500"
                    placeholder="sharma@campus.edu"
                  />
                </div>
              </div>

              {/* Department & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department *</label>
                  <select
                    value={facultyForm.facultyDepartment}
                    onChange={(e) => setFacultyForm({ ...facultyForm, facultyDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Comm.</option>
                    <option value="Mechanical Engineering">Mechanical Engg.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Designation *</label>
                  <select
                    value={facultyForm.designation}
                    onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Professor & Head of Dept">Professor & Head of Dept</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Visiting Lecturer">Visiting Lecturer</option>
                  </select>
                </div>
              </div>

              {/* Qualification & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    value={facultyForm.qualification}
                    onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-purple-500"
                    placeholder="Ph.D, M.Tech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Specialization Area</label>
                  <input
                    type="text"
                    value={facultyForm.specialization}
                    onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-hidden focus:border-purple-500"
                    placeholder="e.g. Machine Learning & Cyber Security"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Creating Faculty Account...' : 'Complete Faculty Onboarding & Generate ID'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
