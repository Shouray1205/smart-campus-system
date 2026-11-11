import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Courses from './pages/Courses';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import Fees from './pages/Fees';
import Notices from './pages/Notices';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Smart Campus...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onNoticeClick={() => setActiveTab('notices')} />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 lg:p-8 bg-slate-50 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'students' && <Students />}
          {activeTab === 'faculty' && <Faculty />}
          {activeTab === 'courses' && <Courses />}
          {activeTab === 'attendance' && <Attendance />}
          {activeTab === 'timetable' && <Timetable />}
          {activeTab === 'fees' && <Fees />}
          {activeTab === 'notices' && <Notices />}
        </main>
      </div>
    </div>
  );
}
