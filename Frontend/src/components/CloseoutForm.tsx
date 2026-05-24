import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Lock, ShieldAlert, HeartCrack, Skull } from 'lucide-react';
import { CloseoutRecord, ScreeningRecord } from '../types';

interface CloseoutFormProps {
  onSave: (record: CloseoutRecord) => void;
  onCancel: () => void;
  existingRecord?: CloseoutRecord;
  closeoutRecords: CloseoutRecord[];
  screeningRecords: ScreeningRecord[];
  userInitials: string;
  readOnly?: boolean;
}

export default function CloseoutForm({
  onSave,
  onCancel,
  existingRecord,
  closeoutRecords,
  screeningRecords,
  userInitials,
  readOnly = false
}: CloseoutFormProps) {
  const [screeningId, setScreeningId] = useState('');
  const [dateOfInterview, setDateOfInterview] = useState('');
  const [dateOfStudyTermination, setDateOfStudyTermination] = useState('');
  const [participantStatus, setParticipantStatus] = useState<'Completed study visits' | 'Participation terminated prior to completion of study visits' | 'Screen failure before enrolment'>('Completed study visits');
  const [discontinuationReason, setDiscontinuationReason] = useState<'Adverse event' | 'Death' | 'Lost to follow-up' | 'Physician decision' | 'Protocol deviation' | 'Screen failure' | 'Study terminated by sponsor' | 'Withdrawal by participant' | 'Other' | ''>('');
  const [discontinuationReasonDetail, setDiscontinuationReasonDetail] = useState('');
  const [deathDate, setDeathDate] = useState('');

  useEffect(() => {
    if (existingRecord) {
      setScreeningId(existingRecord.screeningId);
      setDateOfInterview(existingRecord.dateOfInterview);
      setDateOfStudyTermination(existingRecord.dateOfStudyTermination);
      setParticipantStatus(existingRecord.participantStatus);
      setDiscontinuationReason(existingRecord.discontinuationReason || '');
      setDiscontinuationReasonDetail(existingRecord.discontinuationReasonDetail || '');
      setDeathDate(existingRecord.deathDate || '');
    } else {
      const todayISO = new Date().toISOString().split('T')[0];
      setDateOfInterview(todayISO);
      setDateOfStudyTermination(todayISO);
    }
  }, [existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!screeningId) {
      alert('Screening ID is a required field.');
      return;
    }

    if (participantStatus !== 'Completed study visits' && !discontinuationReason) {
      alert('Please specify a discontinuation reason.');
      return;
    }

    if (discontinuationReason === 'Death' && !deathDate) {
      alert('Kindly provide the Date of Death.');
      return;
    }

    const record: CloseoutRecord = {
      screeningId,
      dateOfInterview,
      dateOfStudyTermination,
      participantStatus,
      discontinuationReason: participantStatus !== 'Completed study visits' ? discontinuationReason : '',
      discontinuationReasonDetail: (participantStatus !== 'Completed study visits' && ['Adverse event', 'Protocol deviation', 'Withdrawal by participant', 'Other'].includes(discontinuationReason)) ? discontinuationReasonDetail : '',
      deathDate: (participantStatus !== 'Completed study visits' && discontinuationReason === 'Death') ? deathDate : '',
      submittedBy: existingRecord ? existingRecord.submittedBy : userInitials,
      submittedAt: existingRecord ? existingRecord.submittedAt : new Date().toISOString(),
      updatedBy: existingRecord ? userInitials : undefined,
      updatedAt: existingRecord ? new Date().toISOString() : undefined,
    };

    onSave(record);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl p-6 md:p-8 space-y-8 max-w-4xl mx-auto shadow-amber-100/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-amber-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
            Form 4: Patient Closeout / Termination
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit Closeout Record' : 'Digitize Graduation / Termination'}
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Formal registry graduation or protocol safety drop-out tracking for any Screening ID
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          id="btn-cancel"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Screening ID dropdown Selection - ANY Screening ID allowed */}
        <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">
              Verify Subject Screening ID <span className="text-red-500">*</span>
            </label>
            {existingRecord ? (
              <div className="bg-white border border-amber-200 px-4 py-2.5 rounded-lg font-mono font-bold text-slate-900 shadow-xs">
                {screeningId}
              </div>
            ) : (
              <select
                required
                value={screeningId}
                onChange={(e) => setScreeningId(e.target.value)}
                disabled={readOnly}
                className="block w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 font-mono text-sm font-bold rounded-lg shadow-xs"
                id="f4-screening-id-select"
              >
                <option value="">-- Available Trial Screening IDs --</option>
                {screeningRecords.map(cand => (
                  <option key={cand.screeningId} value={cand.screeningId}>
                    {cand.screeningId} - {cand.facility} ({cand.isEligible ? 'Eligible' : 'Screen Fail'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              value={dateOfInterview}
              onChange={(e) => setDateOfInterview(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              id="f4-interview-date"
            />
          </div>
        </div>

        {/* Date of Study Termination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Date of Study Termination <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              value={dateOfStudyTermination}
              onChange={(e) => setDateOfStudyTermination(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
              id="f4-termination-date"
            />
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 select-none" />
              <span>Make sure discontinuation dates match clinical record sheets before confirmation.</span>
            </div>
          </div>
        </div>

        {/* Participant Status Checklist */}
        <div className="space-y-3 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            4. What was the participant's status? <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'Completed study visits', label: 'Completed Study Visits' },
              { id: 'Participation terminated prior to completion of study visits', label: 'Terminated Prior to Completion' },
              { id: 'Screen failure before enrolment', label: 'Screen Failure Before enrolment' }
            ].map(status => (
              <button
                key={status.id}
                type="button"
                disabled={readOnly}
                onClick={() => {
                  setParticipantStatus(status.id as any);
                  if (status.id === 'Completed study visits') {
                    setDiscontinuationReason('');
                    setDiscontinuationReasonDetail('');
                  } else if (status.id === 'Screen failure before enrolment') {
                    setDiscontinuationReason('Screen failure');
                  } else {
                    setDiscontinuationReason('');
                  }
                }}
                className={`p-4 border text-center rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  participantStatus === status.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
                id={`status-btn-${status.id}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Discontinuation Reason */}
        {participantStatus !== 'Completed study visits' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-5 border border-dashed border-slate-300 rounded-xl space-y-4 bg-slate-50/50"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <HeartCrack className="w-5 h-5" />
              <h4 className="text-sm font-bold">Discontinuation Reasons Registry</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { val: 'Adverse event', lbl: 'Adverse Event (AE)' },
                { val: 'Death', lbl: 'Death occurred' },
                { val: 'Lost to follow-up', lbl: 'Lost to Follow-up' },
                { val: 'Physician decision', lbl: 'Physician Decision' },
                { val: 'Protocol deviation', lbl: 'Protocol Deviation' },
                { val: 'Screen failure', lbl: 'Screen Failure' },
                { val: 'Study terminated by sponsor', lbl: 'Terminated by Sponsor' },
                { val: 'Withdrawal by participant', lbl: 'Withdrawal by Participant' },
                { val: 'Other', lbl: 'Other (specify)' }
              ].map(reason => (
                <button
                  key={reason.val}
                  type="button"
                  disabled={readOnly || participantStatus === 'Screen failure before enrolment'}
                  onClick={() => setDiscontinuationReason(reason.val as any)}
                  className={`p-3 border text-left rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    discontinuationReason === reason.val
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}
                  id={`disc-reason-${reason.val}`}
                >
                  <span>{reason.lbl}</span>
                  {discontinuationReason === reason.val && <Check className="w-3.5 h-3.5 text-amber-700 font-bold" />}
                </button>
              ))}
            </div>

            {/* Death Specific Input */}
            {discontinuationReason === 'Death' && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-2 text-red-400">
                  <Skull className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Deceased Record Declaration</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                    Date of Death <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    disabled={readOnly}
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="block px-3 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white rounded-lg text-xs"
                    id="f4-death-date"
                  />
                </div>
              </motion.div>
            )}

            {/* Custom specification Text Detail */}
            {['Adverse event', 'Protocol deviation', 'Withdrawal by participant', 'Other'].includes(discontinuationReason) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-1 bg-white p-3 rounded-xl border border-slate-200"
              >
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                  Specify details regarding discontinued reason ({discontinuationReason}) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  disabled={readOnly}
                  rows={2}
                  value={discontinuationReasonDetail}
                  onChange={(e) => setDiscontinuationReasonDetail(e.target.value)}
                  placeholder="Insert exact notes or protocol code specification details"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  id="f4-discon-detail"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Buttons Operations */}
        {!readOnly && (
          <div className="flex justify-end gap-3.5 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
              id="form-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!screeningId}
              className="px-6 py-3 bg-indigo-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-lg hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
              id="form-save-btn"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Closeout' : 'Submit Graduation Log'}
            </button>
          </div>
        )}

        {readOnly && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-xs text-amber-800">
            <Lock className="w-4 h-4 shrink-0" />
            <span>You are previewing this Clinical Record in Read-Only view. To make amendments, make sure you are logged in as a <strong>Data Manager</strong>.</span>
          </div>
        )}
      </form>
    </div>
  );
}
