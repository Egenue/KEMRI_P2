import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Calendar, Clock, Baby, ChevronRight, AlertTriangle } from 'lucide-react';
import { EnrolmentRecord } from '../types';
import { calculateGAIA, formatToDdmMmyyyy } from '../lib/dateUtils';

interface GestationTrackerProps {
  enrolledRecords: EnrolmentRecord[];
}

export default function GestationTracker({ enrolledRecords }: GestationTrackerProps) {
  const calculations = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return enrolledRecords.map(record => {
      if (!record.gaParameters) return { record, gaia: null };
      
      const gaia = calculateGAIA({
        ultrasoundDate: record.gaParameters.ultrasoundDate,
        usWeeks: record.gaParameters.usWeeks,
        usDays: record.gaParameters.usDays,
        lmpDate: record.gaParameters.lmpDate,
        lmpCertainty: record.gaParameters.lmpCertainty,
        enrolmentDate: today // Calculate current GA as of today
      });
      
      return { record, gaia };
    });
  }, [enrolledRecords]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-50 rounded-xl">
            <Calculator className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Automatic Gestational Age Tracking</h2>
            <p className="text-xs text-slate-500">Live monitoring of participant pregnancy progression based on GAIA standards</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participant ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolment Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">GA at Enrolment</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-indigo-50/30">Current GA (Today)</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Due Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {calculations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No enrolled participants found with GAIA metrics.
                  </td>
                </tr>
              ) : (
                calculations.map(({ record, gaia }) => (
                  <tr key={record.screeningId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono font-bold text-slate-900">{record.screeningId}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      {new Date(record.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-700">
                      {record.estGestAge ? `${record.estGestAge} Weeks` : 'N/A'}
                    </td>
                    <td className="px-4 py-4 bg-indigo-50/20">
                      {gaia ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-sm font-extrabold text-indigo-700">
                            {Math.floor(gaia.gaAtEnrolmentDays / 7)}w {gaia.gaAtEnrolmentDays % 7}d
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No GAIA Data</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                      {gaia ? formatToDdmMmyyyy(gaia.edd) : '--'}
                    </td>
                    <td className="px-4 py-4">
                      {gaia ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          gaia.trimester === 'First' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          gaia.trimester === 'Second' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {gaia.trimester} Trimester
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-150 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Baby className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Tracking</span>
            <div className="text-xl font-extrabold text-slate-900">{calculations.length} Participants</div>
          </div>
        </div>
        {/* Add more stats if needed */}
      </div>
    </div>
  );
}
