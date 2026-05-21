/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Check, Lock, ShieldCheck, ChevronDown, Baby } from 'lucide-react';
import { DeliveryRecord, EnrolmentRecord, HealthFacility } from '../types';

interface DeliveryFormProps {
  onSave: (record: DeliveryRecord) => void;
  onCancel: () => void;
  existingRecord?: DeliveryRecord;
  deliveryRecords: DeliveryRecord[];
  enrolledRecords: EnrolmentRecord[];
  userInitials: string;
  readOnly?: boolean;
}

export default function DeliveryForm({
  onSave,
  onCancel,
  existingRecord,
  deliveryRecords,
  enrolledRecords,
  userInitials,
  readOnly = false
}: DeliveryFormProps) {
  // Candidate Selection
  const [screeningId, setScreeningId] = useState('');
  const [dateOfInterview, setDateOfInterview] = useState('');

  // A. Physical Examination
  const [motherWeightKg, setMotherWeightKg] = useState<number | ''>('');
  const [temperatureC, setTemperatureC] = useState<number | ''>('');
  const [tempMethod, setTempMethod] = useState<'Axillary' | 'Oral' | 'Tympanic'>('Oral');
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>('');
  const [pulseRate, setPulseRate] = useState<number | ''>('');
  const [bloodPressureSys, setBloodPressureSys] = useState<number | ''>('');
  const [bloodPressureDia, setBloodPressureDia] = useState<number | ''>('');
  const [oxygenSaturation, setOxygenSaturation] = useState<number | ''>('');
  const [oxygenSource, setOxygenSource] = useState<'On room air' | 'With supplemental oxygen'>('On room air');
  const [bmiUnknown, setBmiUnknown] = useState(false);
  const [motherExamAbnormal, setMotherExamAbnormal] = useState<'Yes' | 'No'>('No');
  const [motherExamAbnormalSpecify, setMotherExamAbnormalSpecify] = useState('');

  // C. Delivery History
  const [dateOfDelivery, setDateOfDelivery] = useState('');
  const [timeOfDelivery, setTimeOfDelivery] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<'Bondo' | 'Lumumba' | 'Siaya' | 'Other hospital/clinic' | 'Home' | 'Other location'>('Bondo');
  const [deliveryLocationSpecify, setDeliveryLocationSpecify] = useState('');
  const [deliveredBy, setDeliveredBy] = useState<'Doctor' | 'Clinical Officer' | 'Nurse' | 'Midwife' | 'Traditional Birth Attendant' | 'Village Health Worker' | 'Other' | 'Don\'t know'>('Nurse');
  const [deliveredBySpecify, setDeliveredBySpecify] = useState('');
  const [modeOfDelivery, setModeOfDelivery] = useState<'Spontaneous vaginal delivery (Normal)' | 'Episiotomy' | 'Vacuum' | 'Forceps' | 'C-section' | 'Other'>('Spontaneous vaginal delivery (Normal)');
  const [modeOfDeliverySpecify, setModeOfDeliverySpecify] = useState('');
  const [cSectionIndication, setCSectionIndication] = useState<'Prolonged labor' | 'Fetal distress' | 'Meconium-stained amniotic fluid' | 'Antepartum hemorrhage' | 'Pre-eclamptic toxemia' | 'Cephalopelvic disproportion' | 'Malpresentation' | 'Elective C-section' | 'Pregnancy-induced hypertension' | 'Other' | 'Don\'t know' | ''>('');
  const [cSectionIndicationOther, setCSectionIndicationOther] = useState('');

  // Dropdown list computation
  const [candidateEnrolledList, setCandidateEnrolledList] = useState<EnrolmentRecord[]>([]);
  const [matchedHeight, setMatchedHeight] = useState<number | null>(null);

  // Compute enrolled list candidates: currently enrolled and not delivered yet (or is current editing record)
  useEffect(() => {
    const activeDeliveredIds = deliveryRecords.map(d => d.screeningId);
    
    const candidates = enrolledRecords.filter(e => {
      if (existingRecord && e.screeningId === existingRecord.screeningId) {
        return true;
      }
      return !activeDeliveredIds.includes(e.screeningId);
    });

    setCandidateEnrolledList(candidates);
  }, [enrolledRecords, deliveryRecords, existingRecord]);

  // Track height of selected enrolled candidate to display/calculate BMI
  useEffect(() => {
    if (screeningId) {
      const match = enrolledRecords.find(e => e.screeningId === screeningId);
      if (match) {
        setMatchedHeight(match.heightCm);
      }
    } else {
      setMatchedHeight(null);
    }
  }, [screeningId, enrolledRecords]);

  // Auto-fill today's date for new records
  useEffect(() => {
    if (existingRecord) {
      setScreeningId(existingRecord.screeningId);
      setDateOfInterview(existingRecord.dateOfInterview);
      setMotherWeightKg(existingRecord.motherWeightKg);
      setTemperatureC(existingRecord.temperatureC);
      setTempMethod(existingRecord.tempMethod);
      setRespiratoryRate(existingRecord.respiratoryRate);
      setPulseRate(existingRecord.pulseRate);
      setBloodPressureSys(existingRecord.bloodPressureSys);
      setBloodPressureDia(existingRecord.bloodPressureDia);
      setOxygenSaturation(existingRecord.oxygenSaturation);
      setOxygenSource(existingRecord.oxygenSource);
      setBmiUnknown(!!existingRecord.bmiUnknown);
      setMotherExamAbnormal(existingRecord.motherExamAbnormal);
      setMotherExamAbnormalSpecify(existingRecord.motherExamAbnormalSpecify || '');
      setDateOfDelivery(existingRecord.dateOfDelivery);
      setTimeOfDelivery(existingRecord.timeOfDelivery);
      setDeliveryLocation(existingRecord.deliveryLocation);
      setDeliveryLocationSpecify(existingRecord.deliveryLocationSpecify || '');
      setDeliveredBy(existingRecord.deliveredBy);
      setDeliveredBySpecify(existingRecord.deliveredBySpecify || '');
      setModeOfDelivery(existingRecord.modeOfDelivery);
      setModeOfDeliverySpecify(existingRecord.modeOfDeliverySpecify || '');
      setCSectionIndication(existingRecord.cSectionIndication || '');
      setCSectionIndicationOther(existingRecord.cSectionIndicationOther || '');
    } else {
      const todayISO = new Date().toISOString().split('T')[0];
      setDateOfInterview(todayISO);
      setDateOfDelivery(todayISO);

      // Simple time picker prefill
      const timeNow = new Date().toTimeString().substring(0, 5);
      setTimeOfDelivery(timeNow);
    }
  }, [existingRecord]);

  // BMI calculation utility
  const getBmiString = (): string => {
    if (bmiUnknown) return 'Unknown';
    if (!motherWeightKg || !matchedHeight) return '---';
    const heightInMeters = matchedHeight / 100;
    const bmiVal = motherWeightKg / (heightInMeters * heightInMeters);
    return bmiVal.toFixed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!screeningId) {
      alert('Screening ID is a required field.');
      return;
    }

    if (motherExamAbnormal === 'Yes' && !motherExamAbnormalSpecify.trim()) {
      alert('Please specify the mother exam abnormality.');
      return;
    }

    if (modeOfDelivery === 'C-section' && !cSectionIndication) {
      alert('Kindly choose an indication for the C-section delivery.');
      return;
    }

    const record: DeliveryRecord = {
      screeningId,
      dateOfInterview,
      motherWeightKg: Number(motherWeightKg) || 0,
      temperatureC: Number(temperatureC) || 0,
      tempMethod,
      respiratoryRate: Number(respiratoryRate) || 0,
      pulseRate: Number(pulseRate) || 0,
      bloodPressureSys: Number(bloodPressureSys) || 0,
      bloodPressureDia: Number(bloodPressureDia) || 0,
      oxygenSaturation: Number(oxygenSaturation) || 0,
      oxygenSource,
      bmiUnknown,
      motherExamAbnormal,
      motherExamAbnormalSpecify: motherExamAbnormal === 'Yes' ? motherExamAbnormalSpecify : '',
      dateOfDelivery,
      timeOfDelivery,
      deliveryLocation,
      deliveryLocationSpecify: (deliveryLocation === 'Other hospital/clinic' || deliveryLocation === 'Other location') ? deliveryLocationSpecify : '',
      deliveredBy,
      deliveredBySpecify: (deliveredBy === 'Other') ? deliveredBySpecify : '',
      modeOfDelivery,
      modeOfDeliverySpecify: (modeOfDelivery === 'Other') ? modeOfDeliverySpecify : '',
      cSectionIndication: modeOfDelivery === 'C-section' ? cSectionIndication : '',
      cSectionIndicationOther: (modeOfDelivery === 'C-section' && cSectionIndication === 'Other') ? cSectionIndicationOther : '',
      submittedBy: existingRecord ? existingRecord.submittedBy : userInitials,
      submittedAt: existingRecord ? existingRecord.submittedAt : new Date().toISOString(),
      updatedBy: existingRecord ? userInitials : undefined,
      updatedAt: existingRecord ? new Date().toISOString() : undefined,
    };

    onSave(record);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-xs p-6 md:p-8 space-y-8 max-w-5xl mx-auto shadow-teal-100/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 uppercase tracking-widest">
            Form 3: Postpartum Delivery Care
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit Delivery Record' : 'Digitize New Delivery Record'}
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Postpartum safety checks, medical history tracking, and physical outcome logs
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
        
        {/* Screening ID Selection */}
        <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full max-w-md">
            <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-teal-600" />
              Select Enrolled Screening ID <span className="text-red-500">*</span>
            </label>
            
            {existingRecord ? (
              <div className="bg-white border border-teal-200 px-4 py-2.5 rounded-lg font-mono font-bold text-slate-950 flex items-center justify-between shadow-xs">
                <span>{screeningId}</span>
                <span className="text-[10px] uppercase text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Locked
                </span>
              </div>
            ) : (
              <div>
                <select
                  required
                  value={screeningId}
                  onChange={(e) => setScreeningId(e.target.value)}
                  disabled={readOnly}
                  className="block w-full px-3 py-2.5 bg-white border border-slate-200 text-slate-900 font-mono text-sm font-bold rounded-lg shadow-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  id="f3-screenid-select"
                >
                  <option value="">-- Dropdown Enrolled patient IDs --</option>
                  {candidateEnrolledList.map((cand) => (
                    <option key={cand.screeningId} value={cand.screeningId}>
                      {cand.screeningId} - {cand.facility} (Active Enrolment)
                    </option>
                  ))}
                </select>
                {candidateEnrolledList.length === 0 && (
                  <p className="mt-1.5 text-[11px] text-amber-600 font-medium">
                    &bull; No enrolled, active participants match. Select Form 2 to enroll patients first.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              value={dateOfInterview}
              onChange={(e) => setDateOfInterview(e.target.value)}
              className="block px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm shadow-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              id="f3-interview-date"
            />
          </div>
        </div>

        {/* Height Context matching */}
        {screeningId && matchedHeight && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex justify-between items-center flex-wrap gap-2">
            <span>Height matched from Enrollment: <strong>{matchedHeight} cm</strong></span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Postpartum Body Mass Index (BMI):</span>
              <span className="px-3 py-1 bg-slate-800 text-white font-mono rounded-lg font-bold text-xs">
                {getBmiString()}
              </span>
            </div>
          </div>
        )}

        {/* Section A: Physical Examination */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            A. Physical Examination (Postpartum Status)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Postpartum Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                disabled={readOnly}
                placeholder="--.- kg"
                value={motherWeightKg}
                onChange={(e) => setMotherWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                id="f3-weight"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Temperature (&deg;C) <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  step="0.1"
                  required
                  disabled={readOnly}
                  placeholder="--.-"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-slate-900 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  id="f3-temp"
                />
                <select
                  value={tempMethod}
                  disabled={readOnly}
                  onChange={(e) => setTempMethod(e.target.value as any)}
                  className="px-2 py-2 bg-slate-50 border border-slate-200 border-l-0 rounded-r-lg text-xs text-slate-600"
                  id="f3-tempmethod"
                >
                  <option value="Oral">Oral</option>
                  <option value="Axillary">Axillary</option>
                  <option value="Tympanic">Tympanic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Respiratory Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                disabled={readOnly}
                placeholder="RR breaths/min"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f3-resprate"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Pulse Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                disabled={readOnly}
                placeholder="PR beats/min"
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f3-pulserate"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Blood Pressure <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  placeholder="Sys"
                  value={bloodPressureSys}
                  onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center"
                  id="f3-bp-sys"
                />
                <span className="text-slate-400 font-bold">&#47;</span>
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  placeholder="Dia"
                  value={bloodPressureDia}
                  onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center"
                  id="f3-bp-dia"
                />
                <span className="text-slate-400 text-[10px] font-mono whitespace-nowrap">mm Hg</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Oxygen Saturation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  placeholder="---"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm pr-10"
                  id="f3-oxygensat"
                />
                <span className="absolute right-3 top-2 text-slate-400 text-sm font-bold">%</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Oxygen administration source <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['On room air', 'With supplemental oxygen'].map(source => (
                  <button
                    key={source}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setOxygenSource(source as any)}
                    className={`py-2 px-2 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      oxygenSource === source
                        ? 'border-teal-600 bg-teal-50 text-teal-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                    id={`oxygen-source-${source}`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={bmiUnknown}
                  onChange={(e) => setBmiUnknown(e.target.checked)}
                  className="rounded border-slate-200 text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700 font-medium">Body Mass Index post-partum is unknown</span>
              </label>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Abnormality on physical exam of mother? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Yes', 'No'].map(choice => (
                  <button
                    key={choice}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setMotherExamAbnormal(choice as any)}
                    className={`py-2 px-2 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      motherExamAbnormal === choice
                        ? choice === 'Yes'
                          ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-55'
                    }`}
                    id={`abnormal-choice-${choice}`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {motherExamAbnormal === 'Yes' && (
                <div className="pt-1.5 animate-slide-in">
                  <input
                    type="text"
                    required
                    disabled={readOnly}
                    value={motherExamAbnormalSpecify}
                    onChange={(e) => setMotherExamAbnormalSpecify(e.target.value)}
                    placeholder="Specify physical exam abnormality details"
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                    id="f3-abnormal-detail"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section C: Delivery History */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            C. Delivery History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Date of Delivery <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                disabled={readOnly}
                value={dateOfDelivery}
                onChange={(e) => setDateOfDelivery(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-teal-500"
                id="f3-delivery-date"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Time of Delivery (24-Hour) <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                disabled={readOnly}
                value={timeOfDelivery}
                onChange={(e) => setTimeOfDelivery(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-mono"
                id="f3-delivery-time"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Where was the infant delivered? <span className="text-red-500">*</span>
              </label>
              <select
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value as any)}
                disabled={readOnly}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f3-del-location"
              >
                <option value="Bondo">Bondo</option>
                <option value="Lumumba">Lumumba</option>
                <option value="Siaya">Siaya</option>
                <option value="Other hospital/clinic">Other hospital/clinic (specify)</option>
                <option value="Home">Home</option>
                <option value="Other location">Other location (specify)</option>
              </select>
            </div>

            {(deliveryLocation === 'Other hospital/clinic' || deliveryLocation === 'Other location') && (
              <div className="col-span-1 md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Specify Location Details <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={readOnly}
                  value={deliveryLocationSpecify}
                  onChange={(e) => setDeliveryLocationSpecify(e.target.value)}
                  placeholder="Insert designated hospital/clinic or custom location"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f3-del-location-detail"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Who delivered the child? <span className="text-red-500">*</span>
              </label>
              <select
                value={deliveredBy}
                onChange={(e) => setDeliveredBy(e.target.value as any)}
                disabled={readOnly}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f3-who-delivered"
              >
                <option value="Doctor">Doctor</option>
                <option value="Clinical Officer">Clinical Officer</option>
                <option value="Nurse">Nurse</option>
                <option value="Midwife">Midwife</option>
                <option value="Traditional Birth Attendant">Traditional Birth Attendant</option>
                <option value="Village Health Worker">Village Health Worker</option>
                <option value="Other">Other (specify)</option>
                <option value="Don't know">Don't know</option>
              </select>
            </div>

            {deliveredBy === 'Other' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Specify Delivery Personnel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={readOnly}
                  value={deliveredBySpecify}
                  onChange={(e) => setDeliveredBySpecify(e.target.value)}
                  placeholder="Enter custom assistant role"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f3-who-delivered-specify"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Mode of Delivery? <span className="text-red-500">*</span>
              </label>
              <select
                value={modeOfDelivery}
                onChange={(e) => setModeOfDelivery(e.target.value as any)}
                disabled={readOnly}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f3-delivery-mode"
              >
                <option value="Spontaneous vaginal delivery (Normal)">Spontaneous vaginal delivery (Normal)</option>
                <option value="Episiotomy">Episiotomy</option>
                <option value="Vacuum">Vacuum</option>
                <option value="Forceps">Forceps</option>
                <option value="C-section">C-section</option>
                <option value="Other">Other (specify)</option>
              </select>
            </div>

            {modeOfDelivery === 'Other' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Specify custom delivery mode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={readOnly}
                  value={modeOfDeliverySpecify}
                  onChange={(e) => setModeOfDeliverySpecify(e.target.value)}
                  placeholder="Clinical delivery process style"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f3-delivery-mode-other"
                />
              </div>
            )}
          </div>

          {/* C-section Conditional Indication Panel */}
          {modeOfDelivery === 'C-section' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-5 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3"
            >
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                What was the clinical indication for C-section? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {[
                  { value: 'Prolonged labor', label: 'Prolonged Labor' },
                  { value: 'Fetal distress', label: 'Fetal Distress' },
                  { value: 'Meconium-stained amniotic fluid', label: 'Meconium Fluid Spill' },
                  { value: 'Antepartum hemorrhage', label: 'Antepartum Hemorrhage' },
                  { value: 'Pre-eclamptic toxemia', label: 'Pre-eclamptic Toxemia' },
                  { value: 'Cephalopelvic disproportion', label: 'Cephalopelvic Disproportion' },
                  { value: 'Malpresentation', label: 'Malpresentation (Breech)' },
                  { value: 'Election C-section', label: 'Elective C-section' },
                  { value: 'Pregnancy-induced hypertension', label: 'Pregnancy-induced Hypertension' },
                  { value: 'Other', label: 'Other (specify)' },
                  { value: 'Don\'t know', label: 'Don\'t know' }
                ].map(ind => (
                  <button
                    key={ind.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setCSectionIndication(ind.value as any)}
                    className={`p-3 border text-left rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      cSectionIndication === ind.value
                        ? 'border-amber-600 bg-amber-100/50 text-amber-900 font-bold font-semibold'
                        : 'border-slate-250 bg-white text-slate-600'
                    }`}
                    id={`csec-ind-${ind.value}`}
                  >
                    <span>{ind.label}</span>
                    {cSectionIndication === ind.value && <Check className="w-3.5 h-3.5 text-amber-700 font-bold" />}
                  </button>
                ))}
              </div>

              {cSectionIndication === 'Other' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-amber-800 uppercase mb-1">
                    Specify custom C-Section Indication <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={readOnly}
                    value={cSectionIndicationOther}
                    onChange={(e) => setCSectionIndicationOther(e.target.value)}
                    placeholder="Provide specific surgeon indications"
                    className="block w-full px-3 py-2 bg-white border border-amber-300 focus:border-amber-500 text-slate-900 rounded-lg text-sm"
                    id="f3-csec-other-detail"
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Buttons Operations */}
        {!readOnly && (
          <div className="flex justify-end gap-3.5 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
              id="form-cancel-btn"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={!screeningId}
              className="px-6 py-3 bg-indigo-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs shadow-lg hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
              id="form-save-btn"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Delivery' : 'Save Delivery Log'}
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
