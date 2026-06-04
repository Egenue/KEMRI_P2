import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, FileText, Calendar, Weight, Activity, AlertCircle, ChevronDown } from 'lucide-react';
import { EnrolmentRecord, AncVisitRecord } from '../types';


interface AncVisitFormProps {
  onSave: (record: any) => void;
  onCancel: () => void;
  existingRecord?: AncVisitRecord;
  enrolledRecords: EnrolmentRecord[];
  ancRecords: AncVisitRecord[];
  userInitials: string;
  readOnly?: boolean;
}

export default function AncVisitForm({
  onSave,
  onCancel,
  existingRecord,
  enrolledRecords,
  ancRecords,
  userInitials,
  readOnly = false
}: AncVisitFormProps) {
  const [visitNumber, setVisitNumber] = useState('');
  const [screeningId, setScreeningId] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [gestWeeks, setGestWeeks] = useState<number | ''>('');
  const [gestDays, setGestDays] = useState<number | ''>('');
  const [weightKilos, setWeightKilos] = useState<number | ''>('');
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [fundalHeight, setFundalHeight] = useState<number | ''>('');
  const [muac, setMuac] = useState<number | ''>('');
  const [complaints, setComplaints] = useState('None');
  const [medicationGiven, setMedicationGiven] = useState('None');
  const [nextAppointment, setNextAppointment] = useState('');

  useEffect(() => {
    if (existingRecord) {
      setVisitNumber(existingRecord.visitNumber);
      // Extract screening ID from visit number if it follows the V[n]-[facility]-[id] format
      // Or if there's a property in the record. For now, assume it's part of the visitNumber
      const idParts = existingRecord.visitNumber.split('-');
      if (idParts.length >= 3) {
        setScreeningId(`${idParts[1]}-${idParts[2]}`);
      }
      
      setVisitDate(existingRecord.visitDate.split('T')[0]);
      setGestWeeks(existingRecord.gestationAge?.gestWeeks || 0);
      setGestDays(existingRecord.gestationAge?.gestDays || 0);
      setWeightKilos(existingRecord.weightKilos);
      setSystolic(existingRecord.bloodPressure?.systolic || 0);
      setDiastolic(existingRecord.bloodPressure?.diastolic || 0);
      setFundalHeight(existingRecord.fundalHeight);
      setMuac(existingRecord.muac);
      setComplaints(existingRecord.complaints);
      setMedicationGiven(existingRecord.medicationGiven);
      setNextAppointment(existingRecord.nextAppointment.split('T')[0]);
    }
  }, [existingRecord]);

  // Handle Screening ID selection to auto-generate Visit Number
  const handleIdSelection = (id: string) => {
    setScreeningId(id);
    if (!existingRecord && id) {
      // Find how many visits this ID already has
      const previousVisits = ancRecords.filter(v => v.visitNumber.includes(id));
      const nextVisitNum = previousVisits.length + 1;
      setVisitNumber(`V${nextVisitNum}-${id}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!screeningId) {
      alert('Please select a participant before saving.');
      return;
    }

    const record = {
      visitNumber,
      visitDate,
      gestationAge: {
        gestWeeks: Number(gestWeeks),
        gestDays: Number(gestDays)
      },
      weightKilos: Number(weightKilos),
      bloodPressure: {
        systolic: Number(systolic),
        diastolic: Number(diastolic)
      },
      fundalHeight: Number(fundalHeight),
      muac: Number(muac),
      complaints,
      medicationGiven,
      nextAppointment,
      isUpdate: !!existingRecord,
      submittedBy: userInitials,
      submittedAt: new Date().toISOString()
    };

    onSave(record);
  };


  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-indigo-100 pb-5">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-200 uppercase tracking-widest">
            Form: ANC Visit
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit ANC Visit' : 'New ANC Visit Record'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Select Participant ID <span className="text-red-500">*</span>
            </label>
            <select
              required
              disabled={!!existingRecord || readOnly}
              value={screeningId}
              onChange={(e) => handleIdSelection(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
            >
              <option value="">-- Select Enrolled Subject --</option>
              {enrolledRecords.map(p => (
                <option key={p.screeningId} value={p.screeningId}>{p.screeningId}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Visit Number (Auto)
            </label>
            <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-sm font-mono font-bold">
              {visitNumber || '---'}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Visit Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              required
              disabled={readOnly}
              value={weightKilos}
              onChange={(e) => setWeightKilos(e.target.value === '' ? '' : Number(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
              placeholder="kg"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Gestation Age
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Weeks</label>
                <input
                  type="number"
                  required
                  value={gestWeeks}
                  onChange={(e) => setGestWeeks(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Days</label>
                <input
                  type="number"
                  required
                  value={gestDays}
                  onChange={(e) => setGestDays(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Blood Pressure
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Systolic</label>
                <input
                  type="number"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Diastolic</label>
                <input
                  type="number"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Fundal Height (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={fundalHeight}
              onChange={(e) => setFundalHeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              MUAC (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={muac}
              onChange={(e) => setMuac(e.target.value === '' ? '' : Number(e.target.value))}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Complaints
            </label>
            <textarea
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm h-20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Medication Given
            </label>
            <input
              type="text"
              value={medicationGiven}
              onChange={(e) => setMedicationGiven(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-indigo-600 mb-1.5 uppercase tracking-wider">
              Next Appointment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={nextAppointment}
              onChange={(e) => setNextAppointment(e.target.value)}
              className="block w-full px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-900"
            />
          </div>
          <div className="flex items-end justify-end gap-3">
             <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={readOnly}
              className="px-6 py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Visit' : 'Save ANC Visit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
