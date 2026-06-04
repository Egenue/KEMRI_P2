import React from 'react';
import { DatabaseState } from '../types';
import { AlertTriangle, Info, CheckCircle, Search } from 'lucide-react';

interface DataQualityReportProps {
  db: DatabaseState;
}

export default function DataQualityReport({ db }: DataQualityReportProps) {
  const issues: { recordId: string; module: string; issue: string; type: 'warning' | 'error' | 'info' }[] = [];

  // Screening Issues
  db.screening.forEach(r => {
    if (r.BMI > 30) issues.push({ recordId: r.screeningId, module: 'Screening', issue: `High BMI: ${r.BMI}`, type: 'warning' });
    if (r.BMI < 18.5 && r.BMI > 0) issues.push({ recordId: r.screeningId, module: 'Screening', issue: `Low BMI: ${r.BMI}`, type: 'warning' });
    if (r.vitalSigns.bloodPressure.systolic > 140) issues.push({ recordId: r.screeningId, module: 'Screening', issue: `High Systolic BP: ${r.vitalSigns.bloodPressure.systolic}`, type: 'error' });
    if (r.vitalSigns.temperature.value > 38) issues.push({ recordId: r.screeningId, module: 'Screening', issue: `High Temperature: ${r.vitalSigns.temperature.value}`, type: 'error' });
  });

  // Enrollment Issues
  db.enrolment.forEach(r => {
    if (r.BMI > 30) issues.push({ recordId: r.screeningId, module: 'Enrollment', issue: `High BMI: ${r.BMI}`, type: 'warning' });
    if (!r.gaParameters?.edd) issues.push({ recordId: r.screeningId, module: 'Enrollment', issue: 'Missing Estimated Date of Delivery (EDD)', type: 'error' });
  });

  // Delivery Issues
  db.delivery.forEach(r => {
    if (r.physicalExam.vitalSigns.bloodPressure.systolic > 140) issues.push({ recordId: r.deliveryScreeningId, module: 'Delivery', issue: `High BP: ${r.physicalExam.vitalSigns.bloodPressure.systolic}/${r.physicalExam.vitalSigns.bloodPressure.diastolic}`, type: 'error' });
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Data Quality Report
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Reviewing {issues.length} flagged records for missing or suspicious clinical data.
        </p>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150">
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Module</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Record ID</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Flag / Issue</th>
              <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[10px]">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {issues.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                    <p className="text-slate-500 font-medium">No data quality issues detected!</p>
                  </div>
                </td>
              </tr>
            ) : (
              issues.map((issue, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{issue.module}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{issue.recordId}</td>
                  <td className="px-6 py-4 text-slate-600">{issue.issue}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      issue.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      issue.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {issue.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
