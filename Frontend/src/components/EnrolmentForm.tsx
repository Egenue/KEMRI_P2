/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Check, Lock, ShieldCheck, HeartPulse, Calculator, CalendarDays } from 'lucide-react';
import { EnrolmentRecord, ScreeningRecord, HealthFacility } from '../types';
import { calculateAge, isValidDob, calculateGAIA, GAIAResult, formatToDdmMmyyyy } from '../lib/dateUtils';

interface EnrolmentFormProps {
  onSave: (record: EnrolmentRecord) => void;
  onCancel: () => void;
  existingRecord?: EnrolmentRecord;
  enrolledRecords: EnrolmentRecord[];
  screeningRecords: ScreeningRecord[];
  userInitials: string;
  readOnly?: boolean;
}

export default function EnrolmentForm({
  onSave,
  onCancel,
  existingRecord,
  enrolledRecords,
  screeningRecords,
  userInitials,
  readOnly = false
}: EnrolmentFormProps) {
  // Candidate Selection
  const [screeningId, setScreeningId] = useState('');
  const [facility, setFacility] = useState<HealthFacility>('Bondo');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);

  // Demographics
  const [maritalStatus, setMaritalStatus] = useState<'Single' | 'Married' | 'Widowed' | 'Divorced'>('Single');
  const [husbandName, setHusbandName] = useState('');
  const [villageOfResidence, setVillageOfResidence] = useState('');
  const [educationLevel, setEducationLevel] = useState<"Never Attended School" | "Primary" | "Secondary" | "University/Collage">('Primary');
  const [occupation, setOccupation] = useState<"Farmer" | "Business woman" | "Fisherman/Fish monger" | "Home maker" | "Salaried worker" | "Other">('Farmer');
  const [occupationOther, setOccupationOther] = useState('');

  // Assessments (pre-filled but editable)
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [temperatureC, setTemperatureC] = useState<number | ''>('');
  const [tempMethod, setTempMethod] = useState<'Axillary' | 'Oral' | 'Tympanic'>('Oral');
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>('');
  const [pulseRate, setPulseRate] = useState<number | ''>('');
  const [bloodPressureSys, setBloodPressureSys] = useState<number | ''>('');
  const [bloodPressureDia, setBloodPressureDia] = useState<number | ''>('');
  const [estimatedGestationUltrasoundWeeks, setEstimatedGestationUltrasoundWeeks] = useState<number | ''>('');

  // GAIA GA Parameters
  const [ultrasoundDate, setUltrasoundDate] = useState('');
  const [usWeeks, setUsWeeks] = useState<number | ''>('');
  const [usDays, setUsDays] = useState<number | ''>('');
  const [lmpDate, setLmpDate] = useState('');
  const [lmpCertainty, setLmpCertainty] = useState<'certain' | 'uncertain' | ''>('');
  const [gaiaResult, setGaiaResult] = useState<GAIAResult | null>(null);

  // Dropdown list computation
  const [eligibleList, setEligibleList] = useState<ScreeningRecord[]>([]);

  // Find eligible screening indices: Meets eligibility & consented to participate, and is not enrolled yet (unless in Edit Mode)
  useEffect(() => {
    const activeEnrolledIds = enrolledRecords.map(e => e.screeningId);
    
    const candidates = screeningRecords.filter(s => {
      // Must be eligible and consented
      const matchCriteria = s.eligibility.meetsAllCriteria === 'Yes' && s.eligibility.consentedToParticipate === 'Yes';
      if (!matchCriteria) return false;

      // If in editing mode, the current screening ID is allowed even if present in active enrolled list
      if (existingRecord && s.screeningId === existingRecord.screeningId) {
        return true;
      }

      // Otherwise must NOT be enrolled
      return !activeEnrolledIds.includes(s.screeningId);
    });

    setEligibleList(candidates);
  }, [screeningRecords, enrolledRecords, existingRecord]);

  // Handle Screening ID selection - Prepopulate fields
  const handleSelectScreeningId = (id: string) => {
    setScreeningId(id);
    const origin = screeningRecords.find(s => s.screeningId === id);
    if (origin) {
      setFacility(origin.healthFacility);
      setDateOfBirth(origin.DoB);
      setAgeYears(origin.Age.years);
      setAgeMonths(origin.Age.months);
      setHeightCm(origin.height);
      setWeightKg(origin.weight);
      setTemperatureC(origin.vitalSigns.temperature.value);
      setTempMethod(origin.vitalSigns.temperature.location);
      setRespiratoryRate(origin.vitalSigns.respiratoryRate);
      setPulseRate(origin.vitalSigns.pulseRate);
      setBloodPressureSys(origin.vitalSigns.bloodPressure.systolic);
      setBloodPressureDia(origin.vitalSigns.bloodPressure.diastolic);
      
      // Auto-prefill LMP from screening if available
      if (origin.lastMenstrualPeriod && !origin.lastMenstrualPeriod.unknown && origin.lastMenstrualPeriod.date) {
        setLmpDate(origin.lastMenstrualPeriod.date.split('T')[0]);
      }
    }
  };

  // Pre-fill states on edit-mode
  useEffect(() => {
    if (existingRecord) {
      setScreeningId(existingRecord.screeningId);
      setFacility(existingRecord.healthFacility);
      setDateOfBirth(existingRecord.DoB);
      setAgeYears(existingRecord.Age.years);
      setAgeMonths(existingRecord.Age.months);
      setMaritalStatus(existingRecord.maritalStatus);
      setHusbandName(existingRecord.HusbandName || '');
      setVillageOfResidence(existingRecord.villageOfResidence);
      setEducationLevel(existingRecord.educationLevel);
      setOccupation(existingRecord.subjectOccupation);
      setOccupationOther(existingRecord.otherOccupation || '');
      setHeightCm(existingRecord.height);
      setWeightKg(existingRecord.weight);
      setTemperatureC(existingRecord.vitalSigns.temperature.value);
      setTempMethod(existingRecord.vitalSigns.temperature.location);
      setRespiratoryRate(existingRecord.vitalSigns.respiratoryRate);
      setPulseRate(existingRecord.vitalSigns.pulseRate);
      setBloodPressureSys(existingRecord.vitalSigns.bloodPressure.systolic);
      setBloodPressureDia(existingRecord.vitalSigns.bloodPressure.diastolic);
      setEstimatedGestationUltrasoundWeeks(existingRecord.estGestAge);
      
      if (existingRecord.gaParameters) {
        setUltrasoundDate(existingRecord.gaParameters.ultrasoundDate);
        setUsWeeks(existingRecord.gaParameters.usWeeks);
        setUsDays(existingRecord.gaParameters.usDays);
        setLmpDate(existingRecord.gaParameters.lmpDate || '');
        setLmpCertainty(existingRecord.gaParameters.lmpCertainty || '');
      }
    } else {
      // Set default ultrasound date to today for new records
      setUltrasoundDate(new Date().toISOString().split('T')[0]);
    }
  }, [existingRecord]);

  // Automatic GAIA Calculation Trigger
  useEffect(() => {
    if (ultrasoundDate && usWeeks !== '' && usDays !== '') {
      const result = calculateGAIA({
        ultrasoundDate,
        usWeeks: Number(usWeeks),
        usDays: Number(usDays),
        lmpDate: lmpDate || undefined,
        lmpCertainty: lmpCertainty || undefined,
        enrolmentDate: new Date().toISOString().split('T')[0]
      });
      setGaiaResult(result);
      
      // Update the main Gestational Age field automatically
      setEstimatedGestationUltrasoundWeeks(Math.floor(result.gaAtEnrolmentDays / 7));
    } else {
      setGaiaResult(null);
    }
  }, [ultrasoundDate, usWeeks, usDays, lmpDate, lmpCertainty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!screeningId) {
      alert('Kindly select a Screening ID of an eligible consenting patient.');
      return;
    }

    if (!villageOfResidence.trim()) {
      alert('Village of residence is required.');
      return;
    }

    if (!gaiaResult) {
      alert('Please complete ultrasound GA parameters to calculate gestational age.');
      return;
    }

    const record: EnrolmentRecord = {
      screeningId,
      healthFacility: facility,
      DoB: dateOfBirth,
      Age: {
        years: ageYears,
        months: ageMonths,
      },
      maritalStatus,
      HusbandName: maritalStatus === 'Married' ? husbandName : '',
      villageOfResidence,
      educationLevel,
      subjectOccupation: occupation,
      otherOccupation: occupation === 'Other' ? occupationOther : '',
      height: Number(heightCm) || 0,
      weight: Number(weightKg) || 0,
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
      estGestAge: Number(estimatedGestationUltrasoundWeeks) || 0,
      gaParameters: {
        ultrasoundDate,
        usWeeks: Number(usWeeks),
        usDays: Number(usDays),
        lmpDate: lmpDate || undefined,
        lmpCertainty: lmpCertainty || undefined,
        calculatedTrimester: gaiaResult.trimester,
        finalPregnancyStartDate: gaiaResult.finalPregnancyStartDate.toISOString().split('T')[0],
        gaAtEnrolmentDays: gaiaResult.gaAtEnrolmentDays,
        edd: gaiaResult.edd.toISOString().split('T')[0],
        source: gaiaResult.source,
        loc: gaiaResult.loc
      },
      submittedBy: existingRecord ? existingRecord.submittedBy : userInitials,
      submittedAt: existingRecord ? existingRecord.submittedAt : new Date().toISOString(),
      updatedBy: existingRecord ? userInitials : undefined,
      updatedAt: existingRecord ? new Date().toISOString() : undefined,
    };

    onSave(record);
  };


  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-xs p-6 md:p-8 space-y-8 max-w-5xl mx-auto shadow-violet-100/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-violet-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200 uppercase tracking-widest">
            Form 2: Demographics & Enrolment
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {existingRecord ? 'Edit Enrolment Record' : 'Enroll Eligible Participant'}
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Collect socio-demographic indicators and vital physical parameters at clinical enrolment
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
        
        {/* Step 1: Matching of Eligible Screening ID */}
        <div className="bg-violet-50/50 p-5 rounded-xl border border-violet-100/60 transition-all">
          <div className="max-w-md">
            <label className="block text-xs font-bold text-violet-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-violet-600" />
              Eligible Screening ID Lookup <span className="text-red-500">*</span>
            </label>
            
            {existingRecord ? (
              <div className="bg-white border border-violet-200 px-4 py-2.5 rounded-lg font-mono font-bold text-slate-900 flex items-center justify-between shadow-xs">
                <span>{screeningId}</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Locked
                </span>
              </div>
            ) : (
              <div>
                <select
                  required
                  value={screeningId}
                  onChange={(e) => handleSelectScreeningId(e.target.value)}
                  disabled={readOnly}
                  className="block w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 text-slate-900 font-mono text-sm font-bold rounded-lg shadow-xs"
                  id="f2-screening-id-select"
                >
                  <option value="">-- Search / Select Eligible Screening ID --</option>
                  {eligibleList.map(cand => (
                    <option key={cand.screeningId} value={cand.screeningId}>
                      {cand.screeningId} - {cand.healthFacility} (DOB: {cand.DoB})
                    </option>
                  ))}

                </select>
                {eligibleList.length === 0 && (
                  <p className="mt-1.5 text-[11px] text-amber-600 font-medium">
                    &bull; No eligible, un-enrolled screening records currently match. Return to screening to enter eligible patients.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Screening Pre-filled Values Banner */}
        {screeningId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-slate-50 border border-slate-150 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 font-sans"
          >
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Assigned facility</span>
              <strong className="text-slate-900 text-sm font-semibold">{facility}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Date of Birth</span>
              <strong className="text-slate-900 text-sm font-semibold">{dateOfBirth}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Verified Age</span>
              <strong className="text-slate-900 text-sm font-semibold">{ageYears} Years, {ageMonths} Months</strong>
            </div>
            <div className="col-span-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
              <span className="text-[10px] text-violet-700 font-medium leading-tight">These values match the verified criteria under code <strong>{screeningId}</strong>.</span>
            </div>
          </motion.div>
        )}

        {/* Demographics Area */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2">
            Demographic History Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Single', 'Married', 'Widowed', 'Divorced'].map(status => (
                  <button
                    key={status}
                    type="button"
                    disabled={readOnly}
                    onClick={() => setMaritalStatus(status as any)}
                    className={`py-2 px-2 border text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      maritalStatus === status
                        ? 'border-violet-600 bg-violet-50 text-violet-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                    id={`marital-btn-${status}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Husband's Name {maritalStatus === 'Married' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                required={maritalStatus === 'Married'}
                disabled={maritalStatus !== 'Married' || readOnly}
                value={husbandName}
                onChange={(e) => setHusbandName(e.target.value)}
                placeholder={maritalStatus === 'Married' ? "Enter full name of husband" : "N/A - Single/Widowed/Divorced"}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                id="f2-husband"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Village of Residence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={readOnly}
                value={villageOfResidence}
                onChange={(e) => setVillageOfResidence(e.target.value)}
                placeholder="Village name (within 15km of facility)"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-village"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Education Level <span className="text-red-500">*</span>
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as any)}
                disabled={readOnly}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-education"
              >
                <option value="Never Attended School">Never Attended School</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="University/Collage">University/Collage</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Occupation <span className="text-red-500">*</span>
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value as any)}
                disabled={readOnly}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-occupation"
              >
                <option value="Farmer">Farmer</option>
                <option value="Business woman">Business woman</option>
                <option value="Fisherman/Fish monger">Fisherman/Fish monger</option>
                <option value="Home maker">Home maker</option>
                <option value="Salaried worker">Salaried worker</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {occupation === 'Other' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Specify Occupation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={readOnly}
                  value={occupationOther}
                  onChange={(e) => setOccupationOther(e.target.value)}
                  placeholder="Insert custom occupation"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f2-occupation-other"
                />
              </div>
            )}
          </div>
        </div>

        {/* Gestation Assessment Area */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Gestation Assessment (GAIA Calculator)
          </h3>
          
          <div className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Date of Ultrasound <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    disabled={readOnly}
                    value={ultrasoundDate}
                    onChange={(e) => setUltrasoundDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                    id="f2-us-date"
                  />
                  <CalendarDays className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Ultrasound GA — Weeks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="42"
                  required
                  disabled={readOnly}
                  value={usWeeks}
                  onChange={(e) => setUsWeeks(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 22"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f2-us-weeks"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Ultrasound GA — Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  required
                  disabled={readOnly}
                  value={usDays}
                  onChange={(e) => setUsDays(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0-6"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f2-us-days"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-indigo-100 pt-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Last Menstrual Period (LMP)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    disabled={readOnly}
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                    id="f2-lmp-date"
                  />
                  <CalendarDays className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  LMP Certainty
                </label>
                <select
                  value={lmpCertainty}
                  onChange={(e) => setLmpCertainty(e.target.value as any)}
                  disabled={readOnly || !lmpDate}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                  id="f2-lmp-certainty"
                >
                  <option value="">-- Select Certainty --</option>
                  <option value="certain">Certain</option>
                  <option value="uncertain">Uncertain</option>
                </select>
              </div>
            </div>

            {gaiaResult && !gaiaResult.error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-tight">
                  <Sparkles className="w-4 h-4" />
                  GAIA Automated Calculation Result
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">GA at Enrolment</span>
                    <strong className="text-slate-900 text-sm">
                      {Math.floor(gaiaResult.gaAtEnrolmentDays / 7)} weeks {gaiaResult.gaAtEnrolmentDays % 7} days
                    </strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Due Date</span>
                    <strong className="text-slate-900 text-sm">
                      {formatToDdmMmyyyy(gaiaResult.edd)}
                    </strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Trimester</span>
                    <strong className="text-slate-900 text-sm">{gaiaResult.trimester}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Calculation Source</span>
                    <strong className="text-indigo-600 text-sm font-extrabold">{gaiaResult.source}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Level of Certainty (LOC)</span>
                    <strong className={`text-sm font-extrabold ${gaiaResult.loc.includes('NOT') ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {gaiaResult.loc}
                    </strong>
                  </div>
                </div>

                {gaiaResult.loc.includes('NOT') && (
                  <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-[11px] text-rose-700 font-medium flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 rotate-45" />
                    <span>Protocol Warning: Participant does not meet Level of Certainty (LOC 1-2b) standards. Screen but do not enrol.</span>
                  </div>
                )}
              </motion.div>
            )}

            {gaiaResult && gaiaResult.error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-800"
              >
                <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold uppercase block mb-1">Illogical Calculation Parameters</span>
                  <p className="text-sm font-medium leading-snug">{gaiaResult.error}</p>
                </div>
              </motion.div>
            )}

            <div className="border-t border-indigo-100 pt-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Estimated gestational age by ultrasound (weeks) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="4"
                  max="42"
                  required
                  readOnly
                  className="block w-32 px-3 py-2.5 bg-slate-50 border border-indigo-200 rounded-lg text-indigo-700 font-bold text-sm shadow-inner"
                  value={estimatedGestationUltrasoundWeeks}
                  id="f2-gestation"
                />
                <span className="text-xs text-slate-400 font-medium italic">
                  &larr; Derived automatically from GAIA metrics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sequential Assessments Prepopulated / Editable */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-violet-600 animate-pulse" />
            Vitals Profile (Enrolment Validation Check)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                max="200"
                required
                disabled={readOnly}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Height (cm)"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-height"
              />
              {typeof heightCm === 'number' && (heightCm < 100 || heightCm > 200) && (
                <p className="text-xs text-red-500 mt-1">Height: 100-200 cm</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="150"
                required
                disabled={readOnly}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Weight (kg)"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-weight"
              />
              {typeof weightKg === 'number' && (weightKg < 30 || weightKg > 150) && (
                <p className="text-xs text-red-500 mt-1">Weight: 30-150 kg</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Temperature (&deg;C) <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  step="0.1"
                  min="35.0"
                  max="41.0"
                  required
                  disabled={readOnly}
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="--.-"
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-slate-900 text-sm"
                  id="f2-temp"
                />
                <select
                  value={tempMethod}
                  disabled={readOnly}
                  onChange={(e) => setTempMethod(e.target.value as any)}
                  className="px-2 py-2 bg-slate-50 border border-slate-200 border-l-0 rounded-r-lg text-xs text-slate-600"
                  id="f2-tempmethod"
                >
                  <option value="Oral">Oral</option>
                  <option value="Axillary">Axillary</option>
                  <option value="Tympanic">Tympanic</option>
                </select>
              </div>
              {typeof temperatureC === 'number' && temperatureC < 36.0 && (
                <p className="text-xs text-red-600 mt-1 font-semibold">Hypothermia</p>
              )}
              {typeof temperatureC === 'number' && temperatureC > 38.5 && (
                <p className="text-xs text-red-600 mt-1 font-semibold">High Fever</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Respiratory Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="12"
                max="30"
                required
                disabled={readOnly}
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Respiration Rate"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-resprate"
              />
              {typeof respiratoryRate === 'number' && (respiratoryRate < 12 || respiratoryRate > 30) && (
                <p className="text-xs text-red-500 mt-1">RR: 12-30 breaths/min</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Pulse Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="160"
                required
                disabled={readOnly}
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Pulse"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"
                id="f2-pulserate"
              />
              {typeof pulseRate === 'number' && (pulseRate < 40 || pulseRate > 160) && (
                <p className="text-xs text-red-500 mt-1">PR: 40-160 beats/min</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Blood Pressure <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="70"
                  max="200"
                  required
                  disabled={readOnly}
                  value={bloodPressureSys}
                  onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Sys"
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center font-mono"
                  id="f2-bp-sys"
                />
                <span className="text-slate-400 font-bold">&#47;</span>
                <input
                  type="number"
                  min="40"
                  max="120"
                  required
                  disabled={readOnly}
                  value={bloodPressureDia}
                  onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Dia"
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center font-mono"
                  id="f2-bp-dia"
                />
                <span className="text-slate-400 text-xs font-mono">mmHg</span>
              </div>
              {(typeof bloodPressureSys === 'number' || typeof bloodPressureDia === 'number') && 
               ((typeof bloodPressureSys === 'number' && (bloodPressureSys < 70 || bloodPressureSys > 200)) ||
                (typeof bloodPressureDia === 'number' && (bloodPressureDia < 40 || bloodPressureDia > 120))) && (
                <p className="text-xs text-red-500 mt-1\">BP: 70-200/40-120 mmHg</p>
              )}
            </div>
          </div>
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
              Cancel Entry
            </button>
            <button
              type="submit"
              disabled={!screeningId}
              className="px-6 py-3 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-100/50 hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
              id="form-save-btn"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Enrolment' : 'Enroll Participant'}
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
