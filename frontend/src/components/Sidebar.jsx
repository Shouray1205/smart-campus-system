import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Calendar,
  CreditCard,
  Bell,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',        icon: LayoutDashboard, roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'students',   label: 'Students',          icon: Users,           roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'faculty',    label: 'Faculty',           icon: GraduationCap,   roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'courses',    label: 'Courses',           icon: BookOpen,        roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'attendance', label: 'Attendance',        icon: CalendarCheck,   roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'timetable',  label: 'Timetable',         icon: Calendar,        roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
    { id: 'fees',       label: 'Fee Management',    icon: CreditCard,      roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] },
    { id: 'notices',    label: 'Notice Board',      icon: Bell,            roles: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'] },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role));
  const roleName = user?.role?.replace('ROLE_', '') || 'User';

  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] flex flex-col shrink-0">

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-2">
          Navigation
        </p>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-200">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 mb-0.5">
            <ShieldCheck className="w-3 h-3" />
            <span>Logged in as</span>
          </div>
          <p className="text-xs font-bold text-slate-800">{roleName}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            JWT Auth Active
          </div>
        </div>
      </div>

    </aside>
  );
}
