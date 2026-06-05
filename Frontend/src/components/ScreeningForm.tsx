/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, FileSpreadsheet, Lock, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { ScreeningRecord, HealthFacility } from '../types';
import { calculateAge, isValidDob, formatToDdmMmyyyy } from '../lib/dateUtils';
import { 
  validateBloodPressure, 
  validateTemperature, 
  validateRespiratoryRate, 
  validatePulseRate, 
  validateHeight 
} from '../lib/vitalsValidation';
import { VitalAlerts } from './VitalAlerts';

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
  const [BMI, setBMI] = useState<number | ''>('');
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
      setDateOfInterview(existingRecord.interviewDate);
      setFacility(existingRecord.healthFacility);
      setDateOfBirth(existingRecord.DoB);
      setAgeYears(existingRecord.Age.years);
      setAgeMonths(existingRecord.Age.months);
      setHeightCm(existingRecord.height);
      setWeightKg(existingRecord.weight);
      setTemperatureC(existingRecord.vitalSigns.temperature.value);
      setTempMethod(existingRecord.vitalSigns.temperature.location);
      setRespiratoryRate(existingRecord.vitalSigns.respiratoryRate);
      setPulseRate(existingRecord.vitalSigns.pulseRate);
      setBloodPressureSys(existingRecord.vitalSigns.bloodPressure.systolic);
      setBloodPressureDia(existingRecord.vitalSigns.bloodPressure.diastolic);
      setBMI(existingRecord.BMI);
      if (existingRecord.lastMenstrualPeriod.unknown) {
        setLmpUnknown(true);
        setLmpDate('');
      } else {
        setLmpUnknown(false);
        setLmpDate(existingRecord.lastMenstrualPeriod.date || '');
      }
      setFundalHeightCm(existingRecord.fundalHeight);
      setIncVillage15km(existingRecord.inclusionCriteria.residentWithin15km === 'Yes');
      setIncPregnancyConfirmed(existingRecord.inclusionCriteria.pregnancyConfirmed === 'Yes');
      setIncGestation31wks(existingRecord.inclusionCriteria.gestationLessThan31Weeks === 'Yes');
      setIncHivConsent(existingRecord.inclusionCriteria.consentsToHIVTesting === 'Yes');
      setIncWillingDelivery(existingRecord.inclusionCriteria.willingToDeliverAtStudyHospital === 'Yes');
      setExcMultiplePregnancy(existingRecord.exclusionCriteria.multiplePregancy);
      setExcDeformityFistula(existingRecord.exclusionCriteria.fisturaRepairOrSpinalDeformity);
      setExcInformedConsentUnable(existingRecord.exclusionCriteria.unableToGiveInformedConsent);
      setWomanConsented(existingRecord.eligibility.consentedToParticipate);
      setRefusalReason(existingRecord.eligibility.reasonForRefusal || '');
      // refusalReasonOther is not in types anymore as it's not in backend, 
      // but let's see if we should keep it for UI.
      setIsEligible(existingRecord.eligibility.meetsAllCriteria === 'Yes');
    } else {
      // Auto pre-fills
      setDateOfInterview(new Date().toISOString().split('T')[0]);
      
      // Auto-generate Screening ID
      const activeIds = records.map(r => r.screeningId);
      let nextNum = 123;
      let checkId = `08-000${nextNum}-0`;
      while (activeIds.includes(checkId)) {
        nextNum++;
        checkId = `08-000${nextNum}-0`;
      }
      setScreeningId(checkId);
    }
  }, [existingRecord, records]);

  // Calculate BMI
  useEffect(() => {
    const computedBmi = getBMI(heightCm, weightKg);
    setBMI(computedBmi !== null ? Number(computedBmi.toFixed(1)) : '');
  }, [heightCm, weightKg]);

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

  // Vitals Validation Results
  const bpStatus = validateBloodPressure(bloodPressureSys, bloodPressureDia);
  const tempStatus = validateTemperature(temperatureC);
  const rrStatus = validateRespiratoryRate(respiratoryRate);
  const prStatus = validatePulseRate(pulseRate);
  const heightStatus = validateHeight(heightCm);

  const getBMI = (heightCm: string | number, weightKg: string | number) => {
    const heightM = Number(heightCm) / 100;
    const weight = Number(weightKg);
    if (heightM > 0 && weight > 0) {
      return weight / (heightM * heightM);
    }else{
      return null ;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (idError) {
      alert('Kindly resolve duplicate Screening ID before submitting.');
      return;
    }

    if (heightStatus?.blockEntry) {
      alert(`Height logical error: ${heightStatus.interpretation}`);
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

    if (womanConsented === 'No' && !refusalReason) {
      alert('Please select a reason for refusal.');
      return;
    }

    const record: ScreeningRecord = {
      screeningId: screeningId.toUpperCase().trim(),
      interviewDate: dateOfInterview,
      healthFacility: facility,
      DoB: dateOfBirth,
      Age: {
        years: ageYears,
        months: ageMonths,
      },
      height: Number(heightCm) || 0,
      weight: Number(weightKg) || 0,
      BMI: Number(BMI) || 0,
      vitalSigns: {
        temperature: {
          value: Number(temperatureC) || 0,
          location: tempMethod,
        },
        respiratoryRate: Number(respiratoryRate) || 0,
        pulseRate: Number(pulseRate) || 0,
        bloodPressure: {
          systolic: Number(bloodPressureSys) || 0,
          diastolic: Number(bloodPressureDia) || 0,
        },
      },
      lastMenstrualPeriod: {
        date: lmpUnknown ? null : (lmpDate || null),
        unknown: lmpUnknown,
      },
      fundalHeight: Number(fundalHeightCm) || 0,
      inclusionCriteria: {
        residentWithin15km: incVillage15km ? 'Yes' : 'No',
        pregnancyConfirmed: incPregnancyConfirmed ? 'Yes' : 'No',
        gestationLessThan31Weeks: incGestation31wks ? 'Yes' : 'No',
        consentsToHIVTesting: incHivConsent ? 'Yes' : 'No',
        willingToDeliverAtStudyHospital: incWillingDelivery ? 'Yes' : 'No',
      },
      exclusionCriteria: {
        multiplePregancy: excMultiplePregnancy!,
        fisturaRepairOrSpinalDeformity: excDeformityFistula!,
        unableToGiveInformedConsent: excInformedConsentUnable!,
      },
      eligibility: {
        meetsAllCriteria: isEligible ? 'Yes' : 'No',
        consentedToParticipate: womanConsented as 'Yes' | 'No',
        reasonForRefusal: womanConsented === 'No' ? (refusalReason as any) : null,
      },
      submittedBy: existingRecord ? existingRecord.submittedBy : userInitials,
      submittedAt: existingRecord ? existingRecord.submittedAt : new Date().toISOString(),
      updatedBy: existingRecord ? userInitials : undefined,
      updatedAt: existingRecord ? new Date().toISOString() : undefined,
    };

    onSave(record);
  };


  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-xs p-5 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto shadow-indigo-100/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-rose-100 pb-4 gap-4">
        <div>
          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 uppercase tracking-widest">
            Form 1: Trial Screening
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit Screen Record' : 'New Screening Digitization'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Administrative Header */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Screening ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!existingRecord || readOnly}
              value={screeningId}
              onChange={(e) => setScreeningId(e.target.value.toUpperCase())}
              className={`block w-full px-2.5 py-1.5 bg-white border rounded-lg text-slate-900 font-mono text-xs font-bold ${
                idError ? 'border-red-500' : 'border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Facility <span className="text-red-500">*</span>
            </label>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value as HealthFacility)}
              disabled={readOnly}
              className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
            >
              <option value="Bondo">Bondo</option>
              <option value="Siaya">Siaya</option>
              <option value="Kuoyo">Kuoyo</option>
              <option value="Lumumba">Lumumba</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              max = {Date.now()}
              disabled={readOnly}
              value={dateOfInterview}
              onChange={(e) => setDateOfInterview(e.target.value)}
              className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              disabled={readOnly}
              min="1972-01-01"
              max="2006-01-01"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              Age (Calculated)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1 bg-slate-200/50 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                {ageYears} <span className="text-[9px] text-slate-400">Y</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-200/50 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                {ageMonths} <span className="text-[9px] text-slate-400">M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Assessment */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
            A. Initial Assessment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Height (cm)</label>
              <input 
              type="number"
              required 
              disabled={readOnly} 
              value={heightCm} 
              onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
              className={`block w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs ${heightStatus?.blockEntry ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'}`} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Weight (kg)</label>
              <input type="number" step={0.1} required disabled={readOnly} value={weightKg} onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))} className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">BMI</label>
              <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700">{BMI || '--.-'}</div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Temp (&deg;C)</label>
              <div className="flex">
                <input type="number" step={0.1} required disabled={readOnly} value={temperatureC} onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))} className="block w-full px-2 py-1.5 bg-white border border-slate-200 rounded-l-lg text-xs" />
                <select disabled={readOnly} value={tempMethod} onChange={(e) => setTempMethod(e.target.value as any)} className="px-1.5 bg-slate-50 border border-slate-200 border-l-0 rounded-r-lg text-[9px]">
                  <option value="Oral">O</option>
                  <option value="Axillary">A</option>
                  <option value="Tympanic">T</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">RR / PR</label>
              <div className="flex gap-1">
                <input type="number" required disabled={readOnly} value={respiratoryRate} onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="RR" />
                <input type="number" required disabled={readOnly} value={pulseRate} onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="PR" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">BP (Sys/Dia)</label>
              <div className="flex gap-1">
                <input type="number" required disabled={readOnly} value={bloodPressureSys} onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Sys" />
                <input type="number" required disabled={readOnly} value={bloodPressureDia} onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))} className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" placeholder="Dia" />
              </div>
            </div>
          </div>

          {/* Vitals Alerts Section */}
          <VitalAlerts results={[bpStatus, tempStatus, rrStatus, prStatus, heightStatus]} />
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
