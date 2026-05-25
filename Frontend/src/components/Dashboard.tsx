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
  TrendingDown
} from 'lucide-react';
import { DatabaseState, HealthFacility } from '../types';

interface DashboardProps {
  db: DatabaseState;
  onNavigateTab: (tab: string) => void;
  userRole: string;
}

export default function Dashboard({ db, onNavigateTab, userRole }: DashboardProps) {
  const facilities: HealthFacility[] = ['Bondo', 'Siaya', 'Kuoyo', 'Lumumba'];

  const totalScreened = db.screening.length;
  const totalEligible = db.screening.filter(s => s.eligibility.meetsAllCriteria === 'Yes' && s.eligibility.consentedToParticipate === 'Yes').length;
  const totalEnrolled = db.enrolment.length;
  const totalDelivered = db.delivery.length;
  const totalClosedOut = db.closeout.length;

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

    const enrolmentRate = eligible > 0 ? (enrolled / eligible) * 100 : 0;

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Panel */}
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
              System Time: 2026-05-21
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Screened</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalScreened}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Total interviews completed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eligible & Consent</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalEligible}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Meets inclusion limit checks</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalEnrolled}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Demographics saved</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalDelivered}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Postpartum evaluations</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Closed Out</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalClosedOut}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Completed / Terminated visits</p>
          </div>
        </div>
      </div>

      {/* Main Stats Table per Site */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Health Facility Metrics Table</h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Real-time summaries aggregated across active patient nodes</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
            {facilities.length} Active Sites
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Health Facility Center
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Screened
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Eligible (Consented)
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Successfully Enrolled
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Delivery Record
                </th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Study Closeout
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Enrolment Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {facilityStats.map((stat, idx) => (
                <tr key={stat.name} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-slate-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 block"></span>
                    {stat.name}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-semibold text-slate-700">
                    {stat.screened}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-medium">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      stat.eligible > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 lg:bg-transparent text-slate-500'
                    }`}>
                      {stat.eligible}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-semibold text-slate-700">
                    {stat.enrolled}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-semibold text-slate-700">
                    {stat.delivered}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-semibold text-slate-500">
                    {stat.closed}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-24 bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stat.enrolmentRate >= 75 
                              ? 'bg-emerald-500' 
                              : stat.enrolmentRate >= 40 
                                ? 'bg-amber-500' 
                                : stat.enrolmentRate > 0 
                                  ? 'bg-rose-500' 
                                  : 'bg-slate-200'
                          }`}
                          style={{ width: `${stat.enrolmentRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 text-xs w-9">
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

      {/* Quick Access Workflow Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            Study Workflow Guidelines
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">1</div>
                <div className="w-0.5 h-8 bg-slate-200"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Step 1: Patient Screening</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluate basic physical factors and inclusion/exclusion limits. Eligibility is computed from compliance across all checks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">2</div>
                <div className="w-0.5 h-8 bg-slate-200"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Step 2: Study Enrolment</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Only eligible screened patients who consented can enroll. Select the Screening ID to input full social demographics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-mono text-xs font-bold flex items-center justify-center">3</div>
                <div className="w-0.5 h-8 bg-slate-200"></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Step 3: Postpartum Delivery Care</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Retrieve completed enrolments to insert postpartum evaluation history, mode of deliveries, and clinical notes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center">4</div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Step 4: Closeout Termination</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Complete regular graduation or execute priority discontinuation (Adverse Event, Lost to Follow-up) for any Screening ID.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action board */}
        <div className="flex flex-col justify-between bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Active Operations Panel</span>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1 mb-3">Begin Data Entry</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Launch corresponding standardized forms to input records. The system records log audits including credentials, timestamp logs, and error validations automatically.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {userRole === 'admin' || userRole === 'manager' ? (
              <>
                <button 
                  onClick={() => onNavigateTab('screening')}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-900/40"
                  id="dash-launch-screening-btn"
                >
                  <PlusCircle className="w-4 h-4" /> Screen Mother
                </button>
                <button 
                  onClick={() => onNavigateTab('enrolment')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="dash-launch-enrolment-btn"
                >
                  <ClipboardCheck className="w-4 h-4 text-violet-400" /> Enroll Mother
                </button>
                <button 
                  onClick={() => onNavigateTab('delivery')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="dash-launch-delivery-btn"
                >
                  <Baby className="w-4 h-4 text-teal-400" /> post-partum Delivery
                </button>
                <button 
                  onClick={() => onNavigateTab('closeout')}
                  className="px-4 py-3 bg-red-950/40 hover:bg-red-900/30 text-rose-300 border border-red-900/40 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  id="dash-launch-closeout-btn"
                >
                  <TrendingDown className="w-4 h-4" /> Closeout Termination
                </button>
              </>
            ) : (
              <div className="col-span-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-medium">
                🔒 You are logged in with Field Technician permissions. Screening, Enrolment, and Delivery records are restricted as View-Only. Please select "Audit Log Table" above to view records.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
