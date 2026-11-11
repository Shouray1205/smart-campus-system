import React, { useEffect, useState } from 'react';
import { dashboardApi, noticesApi, feesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Bell,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const { user, isAdmin, isStudent, isFaculty } = useAuth();
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [myPendingFees, setMyPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, noticesRes] = await Promise.all([
          dashboardApi.getStats(),
          noticesApi.getAll(user?.role),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (noticesRes.success) setNotices(noticesRes.data.slice(0, 4));

        // Student: load their own pending fees
        if (isStudent && user?.profileId) {
          const feesRes = await feesApi.getByStudent(user.profileId);
          if (feesRes.success) {
            const pending = feesRes.data.filter(
              (f) => f.paymentStatus === 'PENDING' || f.paymentStatus === 'PARTIAL'
            );
            setMyPendingFees(pending);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isStudent]);

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tab: 'students',
    },
    {
      title: 'Faculty Members',
      value: stats?.totalFaculty ?? 0,
      icon: GraduationCap,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tab: 'faculty',
    },
    {
      title: 'Active Courses',
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      tab: 'courses',
    },
    {
      title: 'Overall Attendance',
      value: stats?.overallAttendanceRate ? `${stats.overallAttendanceRate}%` : '85.4%',
      icon: CalendarCheck,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      tab: 'attendance',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Simple Clean Welcome Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Welcome, {user?.fullName || user?.username}!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Smart Campus Portal • Role: <strong className="text-slate-700">{user?.role?.replace('ROLE_', '')}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Check Attendance
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            View Notices
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveTab(card.tab)}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '...' : card.value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Fee Section — Role Based */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ADMIN ONLY: Campus Fee Collection stats */}
        {isAdmin && (
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Campus Fee Collection</span>
              </h3>
              <button onClick={() => setActiveTab('fees')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                Manage
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Total Collected</div>
                <div className="text-xl font-bold text-emerald-700 mt-1">
                  ₹{Number(stats?.totalFeesCollected ?? 67500).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Pending Campus-wide</div>
                <div className="text-xl font-bold text-amber-700 mt-1">
                  ₹{Number(stats?.pendingFeesAmount ?? 26000).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT ONLY: My Pending Fees */}
        {isStudent && (
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-500" />
                <span>My Fee Dues</span>
              </h3>
              <button onClick={() => setActiveTab('fees')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                Pay Now
              </button>
            </div>
            {myPendingFees.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 font-medium flex items-center gap-2">
                <span>✓</span> Koi pending fee nahi hai — sab clear hai!
              </div>
            ) : (
              <div className="space-y-2.5">
                {myPendingFees.map((f) => {
                  const due = Number(f.amount) - Number(f.paidAmount || 0);
                  return (
                    <div key={f.id} className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800">{f.feeType} Fee</div>
                        <div className="text-xs text-rose-700 font-bold mt-0.5">
                          ₹{due.toLocaleString('en-IN')} remaining
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Due: {f.dueDate}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        f.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {f.paymentStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Notices */}
        <div className={`bg-white rounded-xl p-5 border border-slate-200 ${isFaculty ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Campus Announcements</span>
            </h3>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({stats?.totalNotices ?? notices.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {notices.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No active circulars</div>
            ) : (
              notices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notices')}
                  className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{n.title}</h4>
                    {n.important && (
                      <span className="shrink-0 text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>By: {n.postedBy}</span>
                    <span>•</span>
                    <span>For: {n.targetAudience}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
