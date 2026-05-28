/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Check, Lock, ShieldCheck, HeartPulse, Calculator, CalendarDays } from 'lucide-react';
import { EnrolmentRecord, ScreeningRecord, HealthFacility } from '../types';

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
  const [estimatedGestationWeeks, setEstimatedGestationWeeks] = useState<number | ''>('');

  // Dropdown list computation
  const [eligibleList, setEligibleList] = useState<ScreeningRecord[]>([]);

  // Find eligible screening indices
  useEffect(() => {
    const activeEnrolledIds = enrolledRecords.map(e => e.screeningId);

    const candidates = screeningRecords.filter(s => {
      const matchCriteria = s.eligibility.meetsAllCriteria === 'Yes' && s.eligibility.consentedToParticipate === 'Yes'; 
      if (!matchCriteria) return false;
      if (existingRecord && s.screeningId === existingRecord.screeningId) return true;
      return !activeEnrolledIds.includes(s.screeningId);
    });

    setEligibleList(candidates);
  }, [screeningRecords, enrolledRecords, existingRecord]);

  // Handle Screening ID selection
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
      setEstimatedGestationWeeks(existingRecord.estGestAge);
    }
  }, [existingRecord]);

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
      estGestAge: Number(estimatedGestationWeeks) || 0,
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
                placeholder={maritalStatus === 'Married' ? "Enter full name of husband" : "N/A"}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm disabled:bg-slate-50 disabled:text-slate-400"
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
                placeholder="Village name"
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"   
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
                />
              </div>
            )}
          </div>
        </div>

        {/* Vital Signs area */}
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
                required
                disabled={readOnly}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"   
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
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"   
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
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-l-lg text-slate-900 text-sm"
                />
                <select
                  value={tempMethod}
                  disabled={readOnly}
                  onChange={(e) => setTempMethod(e.target.value as any)}
                  className="px-2 py-2 bg-slate-50 border border-slate-200 border-l-0 rounded-r-lg text-xs text-slate-600"
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
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"   
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Pulse Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                disabled={readOnly}
                value={pulseRate}
                onChange={(e) => setPulseRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm"   
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Blood Pressure (Sys/Dia) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  value={bloodPressureSys}
                  onChange={(e) => setBloodPressureSys(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Sys"
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center font-mono"
                />
                <span className="text-slate-400 font-bold">&#47;</span>
                <input
                  type="number"
                  required
                  disabled={readOnly}
                  value={bloodPressureDia}
                  onChange={(e) => setBloodPressureDia(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Dia"
                  className="block w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm text-center font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gestation Manual Entry */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Gestation Information
          </h3>
          <div className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100/50">
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              Estimated gestational age (weeks) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="4"
                max="42"
                required
                disabled={readOnly}
                value={estimatedGestationWeeks}
                onChange={(e) => setEstimatedGestationWeeks(e.target.value === '' ? '' : Number(e.target.value))}
                className="block w-32 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-indigo-700 font-bold text-sm"
              />
              <p className="text-[10px] text-slate-400 font-medium italic leading-tight max-w-xs">
                Enter the verified gestational age in weeks. Use the standalone GAIA Calculator for complex determinations.
              </p>
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
            >
              Cancel Entry
            </button>
            <button
              type="submit"
              disabled={!screeningId}
              className="px-6 py-3 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-100/50 hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {existingRecord ? 'Update Enrolment' : 'Enroll Participant'}
            </button>
          </div>
        )}

        {readOnly && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-xs text-amber-800">
            <Lock className="w-4 h-4 shrink-0" />
            <span>You are previewing this Clinical Record in Read-Only view.</span>
          </div>
        )}
      </form>
    </div>
  );
}
