/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, FileSpreadsheet, Lock, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { ScreeningRecord, HealthFacility } from '../types';
import { calculateAge, isValidDob, formatToDdmMmyyyy } from '../lib/dateUtils';

interface ScreeningFormProps {
  onSave: (record: ScreeningRecord) => void;
  onCancel: () => void;
  existingRecord?: ScreeningRecord;
  records: ScreeningRecord[];
  userInitials: string;
  readOnly?: boolean;
}

export default function ScreeningForm({
  onSave,
  onCancel,
  existingRecord,
  records,
  userInitials,
  readOnly = false
}: ScreeningFormProps) {
  // Local states
  const [screeningId, setScreeningId] = useState('');
  const [dateOfInterview, setDateOfInterview] = useState('');
  const [facility, setFacility] = useState<HealthFacility>('Bondo');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [dobError, setDobError] = useState('');

  // A. Assessments
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [temperatureC, setTemperatureC] = useState<number | ''>('');
  const [tempMethod, setTempMethod] = useState<'Axillary' | 'Oral' | 'Tympanic'>('Oral');
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>('');
  const [pulseRate, setPulseRate] = useState<number | ''>('');
  const [bloodPressureSys, setBloodPressureSys] = useState<number | ''>('');
  const [bloodPressureDia, setBloodPressureDia] = useState<number | ''>('');
  const [lmpUnknown, setLmpUnknown] = useState(false);
  const [lmpDate, setLmpDate] = useState('');
  const [fundalHeightCm, setFundalHeightCm] = useState<number | ''>('');

  // B. Inclusion Checklist
  const [incVillage15km, setIncVillage15km] = useState<boolean | null>(null);
  const [incPregnancyConfirmed, setIncPregnancyConfirmed] = useState<boolean | null>(null);
  const [incGestation31wks, setIncGestation31wks] = useState<boolean | null>(null);
  const [incHivConsent, setIncHivConsent] = useState<boolean | null>(null);
  const [incWillingDelivery, setIncWillingDelivery] = useState<boolean | null>(null);

  // C. Exclusion Checklist
  const [excMultiplePregnancy, setExcMultiplePregnancy] = useState<'Yes' | 'No' | "Don't Know" | null>(null);
  const [excDeformityFistula, setExcDeformityFistula] = useState<'Yes' | 'No' | "Don't Know" | null>(null);
  const [excInformedConsentUnable, setExcInformedConsentUnable] = useState<'Yes' | 'No' | null>(null);

  // D. Consent & Refusal
  const [womanConsented, setWomanConsented] = useState<'Yes' | 'No' | ''>('');
  const [refusalReason, setRefusalReason] = useState<'Needs to consult' | 'Other' | ''>('');
  const [refusalReasonOther, setRefusalReasonOther] = useState('');

  // Auto-calculated eligibility status
  const [isEligible, setIsEligible] = useState(false);
  const [idError, setIdError] = useState('');

  // Initialize state
  useEffect(() => {
    if (existingRecord) {
      setScreeningId(existingRecord.screeningId);
      setDateOfInterview(existingRecord.dateOfInterview);
      setFacility(existingRecord.facility);
      setDateOfBirth(existingRecord.dateOfBirth);
      setAgeYears(existingRecord.ageYears);
      setAgeMonths(existingRecord.ageMonths);
      setHeightCm(existingRecord.heightCm);
      setWeightKg(existingRecord.weightKg);
      setTemperatureC(existingRecord.temperatureC);
      setTempMethod(existingRecord.tempMethod);
      setRespiratoryRate(existingRecord.respiratoryRate);
      setPulseRate(existingRecord.pulseRate);
      setBloodPressureSys(existingRecord.bloodPressureSys);
      setBloodPressureDia(existingRecord.bloodPressureDia);
      if (existingRecord.lmpDate === 'Unknown') {
        setLmpUnknown(true);
        setLmpDate('');
      } else {
        setLmpUnknown(false);
        setLmpDate(existingRecord.lmpDate);
      }
      setFundalHeightCm(existingRecord.fundalHeightCm);
      setIncVillage15km(existingRecord.incVillage15km);
      setIncPregnancyConfirmed(existingRecord.incPregnancyConfirmed);
      setIncGestation31wks(existingRecord.incGestation31wks);
      setIncHivConsent(existingRecord.incHivConsent);
      setIncWillingDelivery(existingRecord.incWillingDelivery);
      setExcMultiplePregnancy(existingRecord.excMultiplePregnancy as any);
      setExcDeformityFistula(existingRecord.excDeformityFistula as any);
      setExcInformedConsentUnable(existingRecord.excInformedConsentUnable as any);
      setWomanConsented(existingRecord.womanConsented);
      setRefusalReason(existingRecord.refusalReason || '');
      setRefusalReasonOther(existingRecord.refusalReasonOther || '');
      setIsEligible(existingRecord.isEligible);
    } else {
      // Auto pre-fills
      setDateOfInterview(new Date().toISOString().split('T')[0]);
      
      // Auto-generate Screening ID
      const activeIds = records.map(r => r.screeningId);
      let nextNum = 1007;
      let checkId = `SCR-${nextNum}`;
      while (activeIds.includes(checkId)) {
        nextNum++;
        checkId = `SCR-${nextNum}`;
      }
      setScreeningId(checkId);
    }
  }, [existingRecord, records]);

  // Recalculate Age when DOB or Date of Interview changes
  useEffect(() => {
    if (dateOfBirth && dateOfInterview) {
      if (!isValidDob(dateOfBirth)) {
        setDobError('Age validation fail: DOB must lie between 01/Jan/1972 and 01/Jan/2006.');
        setAgeYears(0);
        setAgeMonths(0);
      } else {
        setDobError('');
        const age = calculateAge(dateOfBirth, dateOfInterview);
        setAgeYears(age.years);
        setAgeMonths(age.months);
      }
    }
  }, [dateOfBirth, dateOfInterview]);

  // Real-time Eligibility Calculation
  useEffect(() => {
    // Inclusion: All must be True
    const inclusionsPassed = 
      incVillage15km === true &&
      incPregnancyConfirmed === true &&
      incGestation31wks === true &&
      incHivConsent === true &&
      incWillingDelivery === true;

    // Exclusion: All must be No or Don't Know
    const exclusionsPassed = 
      (excMultiplePregnancy === 'No' || excMultiplePregnancy === "Don't Know") &&
      (excDeformityFistula === 'No' || excDeformityFistula === "Don't Know") &&
      excInformedConsentUnable === 'No';

    const eligible = inclusionsPassed && exclusionsPassed;
    setIsEligible(eligible);
  }, [
    incVillage15km, incPregnancyConfirmed, incGestation31wks, incHivConsent, incWillingDelivery,
    excMultiplePregnancy, excDeformityFistula, excInformedConsentUnable
  ]);

  // Screening ID validation
  useEffect(() => {
    if (!existingRecord && screeningId) {
      const isDuplicated = records.some(r => r.screeningId.toUpperCase().trim() === screeningId.toUpperCase().trim());
      if (isDuplicated) {
        setIdError('Duplicate Screening ID found. Key must be unique.');
      } else {
        setIdError('');
      }
    }
  }, [screeningId, records, existingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (idError) {
      alert('Kindly resolve duplicate Screening ID before submitting.');
      return;
    }

    if (!isValidDob(dateOfBirth)) {
      alert('Date of Birth must be compliant with the study protocols (1972 - 2006).');
      return;
    }

    if (incVillage15km === null || incPregnancyConfirmed === null || incGestation31wks === null || incHivConsent === null || incWillingDelivery === null) {
      alert('Please fill out all inclusion criteria checklist items.');
      return;
    }

    if (!excMultiplePregnancy || !excDeformityFistula || !excInformedConsentUnable) {
      alert('Please fill out all exclusion criteria checklist items.');
      return;
    }

    if (!womanConsented) {
      alert('Please check whether the mother consented to participate.');
      return;
    }

    const record: ScreeningRecord = {
      screeningId: screeningId.toUpperCase().trim(),
      dateOfInterview,
      facility,
      dateOfBirth,
      ageYears,
      ageMonths,
      heightCm: Number(heightCm) || 0,
      weightKg: Number(weightKg) || 0,
      temperatureC: Number(temperatureC) || 0,
      tempMethod,
      respiratoryRate: Number(respiratoryRate) || 0,
      pulseRate: Number(pulseRate) || 0,
      bloodPressureSys: Number(bloodPressureSys) || 0,
      bloodPressureDia: Number(bloodPressureDia) || 0,
      lmpDate: lmpUnknown ? 'Unknown' : lmpDate,
      fundalHeightCm: Number(fundalHeightCm) || 0,
      incVillage15km: incVillage15km!,
      incPregnancyConfirmed: incPregnancyConfirmed!,
      incGestation31wks: incGestation31wks!,
      incHivConsent: incHivConsent!,
      incWillingDelivery: incWillingDelivery!,
      excMultiplePregnancy: excMultiplePregnancy!,
      excDeformityFistula: excDeformityFistula!,
      excInformedConsentUnable: excInformedConsentUnable!,
      isEligible,
      womanConsented,
      refusalReason: womanConsented === 'No' ? refusalReason : '',
      refusalReasonOther: (womanConsented === 'No' && refusalReason === 'Other') ? refusalReasonOther : '',
      submittedBy: existingRecord ? existingRecord.submittedBy : userInitials,
      submittedAt: existingRecord ? existingRecord.submittedAt : new Date().toISOString(),
      updatedBy: existingRecord ? userInitials : undefined,
      updatedAt: existingRecord ? new Date().toISOString() : undefined,
    };

    onSave(record);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-xs p-6 md:p-8 space-y-8 max-w-5xl mx-auto shadow-indigo-100/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-rose-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 uppercase tracking-widest">
            Form 1: Trial Screening
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit Screen Record' : 'New Paper Screening Digitization'}
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Initial intake assessment protocols for the clinic mother health tracking indices
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
        {/* Core Administrative Header */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Screening ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!existingRecord || readOnly}
              value={screeningId}
              onChange={(e) => setScreeningId(e.target.value.toUpperCase())}
              className={`block w-full px-3 py-2 bg-white border rounded-lg text-slate-900 font-mono text-sm font-bold ${
                idError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
              } disabled:opacity-75`}
              placeholder="e.g. SCR-1001"
              id="f1-screening-id"
            />
            {idError && <p className="text-[10px] text-red-600 font-mono mt-1 font-medium">{idError}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Health Facility <span className="text-red-500">*</span>
            </label>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value as HealthFacility)}
              disabled={readOnly}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
              id="f1-facility"
            >
              <option value="Bondo">Bondo</option>
              <option value="Siaya">Siaya</option>
              <option value="Kuoyo">Kuoyo</option>
              <option value="Lumumba">Lumumba</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              value={dateOfInterview}
              onChange={(e) => setDateOfInterview(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
              id="f1-interview-date"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Age (Calculated)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200/55">
                <span className="text-sm font-bold text-slate-800">{ageYears}</span>
                <span className="text-[10px] text-slate-500 uppercase">Yrs</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200/55">
                <span className="text-sm font-bold text-slate-800">{ageMonths}</span>
                <span className="text-[10px] text-slate-500 uppercase">Mths</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Demographics DOB */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            Patient Birth Demographics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                disabled={readOnly}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                min="1972-01-01"
                max="2006-01-01"
                className={`block w-full px-3 py-2 bg-white border rounded-lg text-slate-900 text-sm ${
                  dobError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
                }`}
                id="f1-dob"
              />
              <p className="text-[10px] text-slate-400 mt-1">Allowable limits: 1/1/1972 to 1/1/2006</p>
              {dobError && <p className="text-[10px] text-red-600 font-medium mt-1">{dobError}</p>}
            </div>
            
            <div className="flex items-end">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>The system auto-calculates mother's age in continuous months and years in accordance with protocol tables.</span>
              </div>
            </div>
          </div>
        </div>

        {/* A. Physical Intake Assessment */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            A. Initial Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                disabled={readOnly}
                placeholder="--- cm"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f1-height"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                disabled={readOnly}
                placeholder="--.- kg"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f1-weight"
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
                  placeholder="--.- C"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-slate-900 text-sm focus:z-10 focus:outline-hidden"
                  id="f1-temp"
                />
                <select
                  value={tempMethod}
                  disabled={readOnly}
                  onChange={(e) => setTempMethod(e.target.value as any)}
                  className="px-2.5 py-2 bg-slate-50 border border-slate-200 border-l-0 rounded-r-lg text-xs text-slate-600"
                  id="f1-tempmethod"
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
                placeholder="-- breaths/min"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f1-resprate"
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
                placeholder="-- beats/min"
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f1-pulserate"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Blood Pressure <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  placeholder="Sys"
                  value={bloodPressureSys}
                  onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center"
                  id="f1-bp-sys"
                />
                <span className="text-slate-400 font-bold">&#47;</span>
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  placeholder="Dia"
                  value={bloodPressureDia}
                  onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center"
                  id="f1-bp-dia"
                />
                <span className="text-slate-400 text-[10px] font-mono whitespace-nowrap">mm Hg</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                LMP Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required={!lmpUnknown}
                disabled={lmpUnknown || readOnly}
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                id="f1-lmp"
              />
              <label className="inline-flex items-center gap-1.5 mt-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={lmpUnknown}
                  onChange={(e) => {
                    setLmpUnknown(e.target.checked);
                    if (e.target.checked) setLmpDate('');
                  }}
                  className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600">LMP Unknown</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Fundal Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                disabled={readOnly}
                placeholder="-- cm"
                value={fundalHeightCm}
                onChange={(e) => setFundalHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f1-fundal"
              />
            </div>
          </div>
        </div>

        {/* B. Inclusion Criteria */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <h3 className="text-md font-bold text-slate-900">
              B. Inclusion Criteria (ALL must be "Yes" to be eligible)
            </h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
              All Yes Protocol
            </span>
          </div>
          <div className="space-y-3.5">
            {[
              { id: 'v15', label: '1. Resident of village within 15 km of study health facility', val: incVillage15km, setter: setIncVillage15km },
              { id: 'preg', label: '2. Pregnancy confirmed by urine test or ultrasound', val: incPregnancyConfirmed, setter: setIncPregnancyConfirmed },
              { id: 'gest31', label: '3. Gestation < 31 weeks by fundal height, ultrasound or within 4 weeks of quickening', val: incGestation31wks, setter: setIncGestation31wks },
              { id: 'hiv', label: '4. Consents to HIV testing and counseling', val: incHivConsent, setter: setIncHivConsent },
              { id: 'deliver', label: '5. Willing to deliver in the labor ward of the study hospital', val: incWillingDelivery, setter: setIncWillingDelivery },
            ].map((inc, i) => (
              <div key={inc.id} className="flex flex-col sm:flex-row justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all gap-3">
                <span className="text-sm font-medium text-slate-800">{inc.label}</span>
                <div className="grid grid-cols-2 gap-2 sm:w-44 whitespace-nowrap">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => inc.setter(true)}
                    className={`py-1.5 px-3 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      inc.val === true
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                    id={`inc-yes-${i}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => inc.setter(false)}
                    className={`py-1.5 px-3 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      inc.val === false
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                    id={`inc-no-${i}`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C. Exclusion Criteria */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <h3 className="text-md font-bold text-slate-900">
              C. Exclusion Criteria (ALL must be "No" or "Don't Know" to be eligible)
            </h3>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full uppercase">
              No Yes permitted
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Exclusions with 3 choices */}
            {[
              { id: 'mult', label: '1. Multiple pregnancy (twins, triplets, etc.)', val: excMultiplePregnancy, setter: setExcMultiplePregnancy, options: ['Yes', 'No', "Don't Know"] },
              { id: 'fistula', label: '2. History of Fistula Repair or Leg/spinal deformity', val: excDeformityFistula, setter: setExcDeformityFistula, options: ['Yes', 'No', "Don't Know"] },
            ].map((exc, i) => (
              <div key={exc.id} className="flex flex-col sm:flex-row justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all gap-3">
                <span className="text-sm font-medium text-slate-800">{exc.label}</span>
                <div className="grid grid-cols-3 gap-2 sm:w-64 whitespace-nowrap">
                  {exc.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      disabled={readOnly}
                      onClick={() => exc.setter(opt as any)}
                      className={`py-1.5 px-2 border text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        exc.val === opt
                          ? opt === 'Yes'
                            ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                            : 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                      id={`exc-opt-${i}-${opt}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom exclusion check */}
            <div className="flex flex-col sm:flex-row justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all gap-3">
              <span className="text-sm font-medium text-slate-800">
                3. Unable to give informed consent (for example due to mental disability)
              </span>
              <div className="grid grid-cols-2 gap-2 sm:w-44 whitespace-nowrap">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => setExcInformedConsentUnable('Yes')}
                  className={`py-1.5 px-3 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    excInformedConsentUnable === 'Yes'
                      ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  id="exc3-yes-btn"
                >
                  Yes
                </button>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => setExcInformedConsentUnable('No')}
                  className={`py-1.5 px-3 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    excInformedConsentUnable === 'No'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  id="exc3-no-btn"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* D. Protocol Eligibility & Patient Consent */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            D. Study Eligibility Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Automated Inclusion/Exclusion Check
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Computed based on protocol check boxes</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {isEligible ? (
                  <div className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block uppercase">Protocol Status</span>
                      <strong className="text-emerald-700 font-extrabold text-sm font-sans">SUBJECT IS ELIGIBLE</strong>
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <X className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block uppercase">Protocol Status</span>
                      <strong className="text-rose-700 font-extrabold text-sm font-sans text-amber">SUBJECT INELIGIBLE (SCREEN FAILURE)</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Did the woman consent to participate? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setWomanConsented('Yes')}
                    className={`py-2 px-3 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      womanConsented === 'Yes'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                    id="consent-yes-btn"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setWomanConsented('No')}
                    className={`py-2 px-3 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      womanConsented === 'No'
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-extrabold'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                    id="consent-no-btn"
                  >
                    No
                  </button>
                </div>
              </div>

              {womanConsented === 'No' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Reason for Refusal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Needs to consult', 'Other'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        disabled={readOnly}
                        onClick={() => setRefusalReason(opt as any)}
                        className={`py-1.5 px-3 border text-xs rounded-lg transition-all cursor-pointer ${
                          refusalReason === opt
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                        id={`refuse-reason-${opt}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {refusalReason === 'Other' && (
                    <input
                      type="text"
                      required
                      disabled={readOnly}
                      value={refusalReasonOther}
                      onChange={(e) => setRefusalReasonOther(e.target.value)}
                      placeholder="Specify reason for refusal"
                      className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                      id="refuse-other"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Operations Button */}
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
              className="px-6 py-3 bg-indigo-600 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-100/50 hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
              id="form-save-btn"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Record' : 'Save Screening Intake'}
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
