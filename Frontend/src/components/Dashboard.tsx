import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  UserCheck, 
  Baby, 
  Users, 
  ClipboardCheck, 
  FileText,
  UserX,
  PlusCircle,
  TrendingDown,
  Calculator,
  BellRing,
  AlertTriangle
} from 'lucide-react';

import { DatabaseState, HealthFacility } from '../types';

interface DashboardProps {
  db: DatabaseState;
  onNavigateTab: (tab: string) => void;
  userRole: string;
  onOpenCalculator?: () => void;
}

export default function Dashboard({ db, onNavigateTab, userRole, onOpenCalculator }: DashboardProps) {
  const facilities: HealthFacility[] = ['Bondo', 'Siaya', 'Kuoyo', 'Lumumba'];

  const totalScreened = db.screening.length;
  const totalEligible = db.screening.filter(s => s.eligibility.meetsAllCriteria === 'Yes' && s.eligibility.consentedToParticipate === 'Yes').length;
  const totalEnrolled = db.enrolment.length;
  const totalDelivered = db.delivery.length;
  const totalClosedOut = db.closeout.length;

  const timeNow = new Date().toLocaleString('en-US');

  const facilityStats = facilities.map(fac => {
    const screened = db.screening.filter(s => s.healthFacility === fac).length;
    const eligible = db.screening.filter(s => s.healthFacility === fac && s.eligibility.meetsAllCriteria === 'Yes' && s.eligibility.consentedToParticipate === 'Yes').length;
    const enrolled = db.enrolment.filter(e => e.healthFacility === fac).length;
    
    const delivered = db.delivery.filter(del => {
      const screenRec = db.screening.find(s => s.screeningId === del.deliveryScreeningId);
      return screenRec?.healthFacility === fac;
    }).length;

    const closed = db.closeout.filter(c => {
      const screenRec = db.screening.find(s => s.screeningId === c.sreeningId);
      return screenRec?.healthFacility === fac;
    }).length;

    const enrolmentRate = screened > 0 ? Math.min(100, (enrolled / screened) * 100) : 0;

    const deliveryRate = enrolled > 0 ? (delivered / enrolled) * 105 : 0; // standard conversion

    return {
      name: fac,
      screened,
      eligible,
      enrolled,
      delivered,
      closed,
      enrolmentRate: Math.round(enrolmentRate),
    };
  });

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const ancReminders = db.enrolment.filter(e => {
    const visits = db.anc.filter(v => v.visitNumber.includes(e.screeningId));
    if (visits.length === 0) return true; // Due for first visit if enrolled
    const lastVisit = visits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())[0];
    const nextAppt = new Date(lastVisit.nextAppointment);
    return nextAppt <= nextWeek;
  }).slice(0, 5);

  const deliveryReminders = db.enrolment.filter(e => {
    // Check if already delivered
    if (db.delivery.some(d => d.deliveryScreeningId === e.screeningId)) return false;
    // Check GA > 36 weeks
    const gest = db.gestation.find(g => g.screeningId === e.screeningId);
    if (gest) return (gest.currentGestAge?.gestweeks ?? 0) >= 36;
    return (e.estGestAge || 0) >= 36;
  }).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ... top welcome panel ... */}

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2"
          >
            Maternal Study Hub Dashboard
          </motion.h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the Clinical Trial digitized database. Here you can monitor, enter, and review mother cohorts across all participating centers. High-fidelity screening and validation guidelines are currently active.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {userRole === 'admin' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium rounded-lg text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                Active: Administrator (Full Control)
              </span>
            ) : userRole === 'manager' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-lg text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active: Data Manager (View & Enter)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium rounded-lg text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Active: Field Technician (Read Only)
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 text-xs rounded-lg text-slate-300 font-mono">
              System Time: {timeNow}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Screened</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalScreened}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Interviews</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Eligible</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalEligible}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Consented</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Enrolled</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <ClipboardCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalEnrolled}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Social Data</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Baby className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalDelivered}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Postpartum</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Closed</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <UserX className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalClosedOut}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Completed</p>
          </div>
        </div>
      </div>

      {/* Main Stats Table per Site */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Health Facility Metrics Table</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-100">
            {facilities.length} Active Sites
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Facility
                </th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Scr
                </th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Elig
                </th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Enr
                </th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Del
                </th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Cls
                </th>
                <th scope="col" className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Conv Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {facilityStats.map((stat) => (
                <tr key={stat.name} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-3 whitespace-nowrap text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 block"></span>
                    {stat.name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-xs font-semibold text-slate-700">
                    {stat.screened}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-xs font-medium">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stat.eligible > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-400'
                    }`}>
                      {stat.eligible}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-xs font-semibold text-slate-700">
                    {stat.enrolled}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-xs font-semibold text-slate-700">
                    {stat.delivered}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-center text-xs font-semibold text-slate-500">
                    {stat.closed}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                        <div 
                          className={`h-1.5 rounded-full ${
                            stat.enrolmentRate >= 75 ? 'bg-emerald-500' : stat.enrolmentRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${stat.enrolmentRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-[10px]">
                        {stat.enrolmentRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Workflow Guide & Action Board */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Workflow Guide */}
        <div className="xl:col-span-1 bg-white border border-slate-150 p-6 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-indigo-600" />
            Study Workflow
          </h3>
          <div className="space-y-4">
            {[
              { n: 1, t: 'Screening', d: 'Physical factor checks.', c: 'bg-slate-900' },
              { n: 2, t: 'Enrolment', d: 'Social demographics.', c: 'bg-indigo-600' },
              { n: 3, t: 'Delivery', d: 'Postpartum history.', c: 'bg-violet-600' },
              { n: 4, t: 'Closeout', d: 'Study termination.', c: 'bg-amber-600' },
            ].map(step => (
              <div key={step.n} className="flex gap-3">
                <div className={`w-6 h-6 shrink-0 rounded-full ${step.c} text-white font-mono text-[10px] font-bold flex items-center justify-center`}>{step.n}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.t}</h4>
                  <p className="text-[10px] text-slate-500">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders Column */}
        <div className="xl:col-span-1 bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-indigo-600" />
              Reminders
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">ANC Due (7 Days)</h4>
              {ancReminders.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">None due.</p>
              ) : (
                <div className="space-y-2">
                  {ancReminders.map(r => (
                    <div key={r.screeningId} className="flex items-center justify-between p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                      <span className="text-[10px] font-bold text-indigo-900">{r.screeningId}</span>
                      <button onClick={() => onNavigateTab('anc')} className="text-[9px] font-bold text-indigo-600 hover:underline">Record</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Term ({'>'}36 Wks)</h4>
              {deliveryReminders.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">None near term.</p>
              ) : (
                <div className="space-y-2">
                  {deliveryReminders.map(r => (
                    <div key={r.screeningId} className="flex items-center justify-between p-2 bg-teal-50/50 rounded-lg border border-teal-100/50">
                      <span className="text-[10px] font-bold text-teal-900">{r.screeningId}</span>
                      <button onClick={() => onNavigateTab('delivery')} className="text-[9px] font-bold text-teal-600 hover:underline">Delivery</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action board */}
        <div className="xl:col-span-1 flex flex-col justify-between bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Operations</span>
            <h3 className="text-lg font-bold tracking-tight text-white mt-1 mb-4">Quick Entry</h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {userRole === 'admin' || userRole === 'manager' ? (
              <>
                <button 
                  onClick={() => onNavigateTab('screening')}
                  className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-900/40"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Screen
                </button>
                <button 
                  onClick={() => onNavigateTab('enrolment')}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-[10px] border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-violet-400" /> Enroll
                </button>
                <button 
                  onClick={() => onNavigateTab('anc')}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-[10px] border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> ANC
                </button>
                <button 
                  onClick={() => onNavigateTab('delivery')}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-[10px] border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Baby className="w-3.5 h-3.5 text-teal-400" /> post-p
                </button>
                <button 
                  onClick={() => onNavigateTab('data-quality')}
                  className="px-3 py-2.5 bg-amber-900/20 hover:bg-amber-900/40 text-amber-200 border border-amber-900/40 font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Quality
                </button>
                <button 
                  onClick={() => onNavigateTab('closeout')}
                  className="px-3 py-2.5 bg-red-950/40 hover:bg-red-900/30 text-rose-300 border border-red-900/40 font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TrendingDown className="w-3.5 h-3.5" /> Close
                </button>
              </>
            ) : (
              <div className="col-span-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 font-medium">
                🔒 View-Only Mode
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  );
}
