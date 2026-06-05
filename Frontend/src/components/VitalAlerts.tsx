/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Ban } from 'lucide-react';
import { ValidationResult } from '../lib/vitalsValidation';

interface VitalAlertProps {
  results: (ValidationResult | null)[];
}

export const VitalAlerts: React.FC<VitalAlertProps> = ({ results }) => {
  const activeResults = results.filter((r): r is ValidationResult => r !== null && r.level !== 'normal');

  if (activeResults.length === 0) return null;

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          container: 'bg-red-100 border-red-200 text-red-800',
          icon: <Ban className="w-5 h-5 text-red-600" />,
          badge: 'bg-red-200 text-red-900'
        };
      case 'error':
        return {
          container: 'bg-rose-50 border-rose-100 text-rose-800',
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
          badge: 'bg-rose-100 text-rose-900'
        };
      case 'alert':
        return {
          container: 'bg-amber-50 border-amber-100 text-amber-800',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          badge: 'bg-amber-100 text-amber-900'
        };
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-100 text-orange-800',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          badge: 'bg-orange-100 text-orange-900'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-100 text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          badge: 'bg-blue-100 text-blue-900'
        };
      default:
        return {
          container: 'bg-slate-50 border-slate-100 text-slate-800',
          icon: <CheckCircle className="w-5 h-5 text-slate-600" />,
          badge: 'bg-slate-100 text-slate-900'
        };
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <AlertCircle className="w-3 h-3" />
        Clinical Alerts & Observations
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {activeResults.map((res, idx) => {
          const styles = getLevelStyles(res.level);
          return (
            <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border ${styles.container} transition-all animate-in fade-in slide-in-from-top-1`}>
              <div className="mt-0.5">{styles.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${styles.badge}`}>
                    {res.category}
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed">
                  {res.interpretation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
