import React from 'react';
import { motion } from 'motion/react';
import { X, Clipboard, ShieldCheck, Calendar, Activity, CheckCircle, HelpCircle, HardDrive } from 'lucide-react';
import { formatToDdmMmyyyy } from '../lib/dateUtils';

interface RecordDetailModalProps {
  table: 'screening' | 'enrolment' | 'delivery' | 'closeout' | 'anc';
  record: any;
  onClose: () => void;
}

export default function RecordDetailModal({ table, record, onClose }: RecordDetailModalProps) {
  if (!record) return null;

  const renderScreening = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Screening ID</span>
          <strong className="text-sm font-mono font-bold text-slate-800">{record.screeningId}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Health Facility</span>
          <strong className="text-sm text-slate-800 font-semibold">{record.healthFacility}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Interview Date</span>
          <strong className="text-sm text-slate-800">{formatToDdmMmyyyy(record.interviewDate)}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Date of Birth</span>
          <strong className="text-sm text-slate-800">{formatToDdmMmyyyy(record.DoB)}</strong>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1">
          <Activity className="w-4 h-4 text-indigo-600" />
          A. Initial Physical Assessment
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-slate-200 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 block">Height</span>
            <span className="text-xs font-bold text-slate-800">{record.height} cm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Weight</span>
            <span className="text-xs font-bold text-slate-800">{record.weight} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">BMI (Calculated)</span>
            <span className="text-xs font-bold text-slate-800">{record.BMI} Kg/m²</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Temperature</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.temperature.value} &deg;C ({record.vitalSigns.temperature.location})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Respiration Rate</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.respiratoryRate} bpm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Pulse Rate</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.pulseRate} bpm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Blood pressure</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.bloodPressure.systolic} / {record.vitalSigns.bloodPressure.diastolic} mmHg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">LMP Date</span>
            <span className="text-xs font-bold text-slate-800">{record.lastMenstrualPeriod.unknown ? 'Unknown' : formatToDdmMmyyyy(record.lastMenstrualPeriod.date)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Fundal Height</span>
            <span className="text-xs font-bold text-slate-800">{record.fundalHeight} cm</span>
          </div>
        </div>
      </div>

      {/* Checklist inclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Inclusion Check</h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex justify-between">
              <span>Village within 15km:</span>
              <strong className={record.inclusionCriteria.residentWithin15km === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{record.inclusionCriteria.residentWithin15km}</strong>
            </li>
            <li className="flex justify-between">
              <span>Pregnancy confirmed:</span>
              <strong className={record.inclusionCriteria.pregnancyConfirmed === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{record.inclusionCriteria.pregnancyConfirmed}</strong>
            </li>
            <li className="flex justify-between">
              <span>Gestation &lt; 31 weeks:</span>
              <strong className={record.inclusionCriteria.gestationLessThan31Weeks === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{record.inclusionCriteria.gestationLessThan31Weeks}</strong>
            </li>
            <li className="flex justify-between">
              <span>Consents HIV test:</span>
              <strong className={record.inclusionCriteria.consentsToHIVTesting === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{record.inclusionCriteria.consentsToHIVTesting}</strong>
            </li>
            <li className="flex justify-between">
              <span>Willing standard delivery:</span>
              <strong className={record.inclusionCriteria.willingToDeliverAtStudyHospital === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{record.inclusionCriteria.willingToDeliverAtStudyHospital}</strong>
            </li>
          </ul>
        </div>

        <div className="space-y-2 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Exclusion Check</h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex justify-between">
              <span>Multiple Pregnancy:</span>
              <strong className={record.exclusionCriteria.multiplePregancy === 'Yes' ? 'text-rose-700' : 'text-emerald-700'}>{record.exclusionCriteria.multiplePregancy}</strong>
            </li>
            <li className="flex justify-between">
              <span>Fistula/Spinal Repair:</span>
              <strong className={record.exclusionCriteria.fisturaRepairOrSpinalDeformity === 'Yes' ? 'text-rose-700' : 'text-emerald-700'}>{record.exclusionCriteria.fisturaRepairOrSpinalDeformity}</strong>
            </li>
            <li className="flex justify-between">
              <span>Consent capacity loss:</span>
              <strong className={record.exclusionCriteria.unableToGiveInformedConsent === 'Yes' ? 'text-rose-700' : 'text-emerald-700'}>{record.exclusionCriteria.unableToGiveInformedConsent}</strong>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 block font-bold uppercase">Clinical Study Eligibility</span>
          <strong className={`text-sm ${record.eligibility.meetsAllCriteria === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}`}>
            {record.eligibility.meetsAllCriteria === 'Yes' ? 'Passed Study Requirements' : 'SCREEN FAILURE / INELIGIBLE'}
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block font-bold uppercase">Mother Consented</span>
          <strong className="text-sm text-indigo-900">{record.eligibility.consentedToParticipate}</strong>
        </div>
      </div>
    </div>
  );

  const renderEnrolment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Assigned Screening ID</span>
          <strong className="text-sm font-mono text-slate-800">{record.screeningId}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Facility</span>
          <strong className="text-sm text-slate-800 font-semibold">{record.healthFacility}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Birth DOB</span>
          <strong className="text-sm text-slate-800">{formatToDdmMmyyyy(record.DoB)}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Age</span>
          <strong className="text-sm text-slate-800">{record.Age.years} yrs, {record.Age.months} mths</strong>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Socio-demographic Indicators</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-slate-200 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 block">Marital Status</span>
            <span className="text-xs font-bold text-slate-850">
              {record.maritalStatus} {record.HusbandName ? `(Husband: ${record.HusbandName})` : ''}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Village of Residence</span>
            <span className="text-xs font-bold text-slate-850">{record.villageOfResidence}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Subject's Education level</span>
            <span className="text-xs font-bold text-slate-850">{record.educationLevel}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Subject's Occupation</span>
            <span className="text-xs font-bold text-slate-850">
              {record.subjectOccupation} {record.otherOccupation ? `(${record.otherOccupation})` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enrolment Vitals and Gestation</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
          <div>
            <span className="text-[10px] text-slate-400 block">Phys. Height</span>
            <span className="text-xs font-bold text-slate-800">{record.height} cm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Phys. Weight</span>
            <span className="text-xs font-bold text-slate-800">{record.weight} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">BMI (Recalculated)</span>
            <span className="text-xs font-bold text-slate-800">{record.BMI} Kg/m²</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Temp</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.temperature.value} &deg;C ({record.vitalSigns.temperature.location})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Blood pressure</span>
            <span className="text-xs font-bold text-slate-800">{record.vitalSigns.bloodPressure.systolic} / {record.vitalSigns.bloodPressure.diastolic} mmHg</span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] text-indigo-400 font-bold block uppercase">Est. Gestational Age by Ultrasound</span>
            <span className="text-sm font-extrabold text-indigo-900">{record.estGestAge} Weeks</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Assigned Screening ID</span>
          <strong className="text-sm font-mono text-slate-800">{record.deliveryScreeningId}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Date of Delivery</span>
          <strong className="text-sm text-slate-800">{formatToDdmMmyyyy(record.deliveryHistory.deliveryDate)}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Time of Delivery</span>
          <strong className="text-sm text-slate-800 font-mono">{record.deliveryHistory.deliveryTime}</strong>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">A. Postpartum Evaluation</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-slate-200 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 block">Postpartum Weight</span>
            <span className="text-xs font-bold text-slate-800">{record.physicalExam.motherWeight} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">BMI (Calculated)</span>
            <span className="text-xs font-bold text-slate-800">
              {record.bodyMassIndex.unknown ? 'Unknown' : (record.bodyMassIndex.value ? `${record.bodyMassIndex.value} Kg/m²` : 'N/A')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Temp (&deg;C)</span>
            <span className="text-xs font-bold text-slate-800">{record.physicalExam.vitalSigns.temperature.tempValue} &deg;C</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
            <span className="text-xs font-bold text-slate-800">{record.physicalExam.vitalSigns.bloodPressure.systolic}/{record.physicalExam.vitalSigns.bloodPressure.diastolic} mmHg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Oxygen Sat</span>
            <span className="text-xs font-bold text-slate-800">{record.physicalExam.vitalSigns.oxygenSaturation.oxygenValue}% ({record.physicalExam.vitalSigns.oxygenSaturation.oxygenOptions})</span>
          </div>
          <div className="col-span-2">
            <span className="text-[10px] text-slate-400 block">Abnormal physical exam?</span>
            <span className="text-xs font-bold text-slate-800">
              {record.motherAbnormality.motherAbnomValue} 
              {record.motherAbnormality.motherAbnomValue === 'Yes' ? ` - Specify: ${record.motherAbnormality.specifics}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">C. Delivery Event Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
          <div>
            <span className="text-[10px] text-slate-400 block">Delivery Location</span>
            <span className="text-xs font-bold text-slate-850">
              {record.deliveryHistory.deliveryPlace.deliveryChoices}
              {record.deliveryHistory.deliveryPlace.otherLocation ? ` (${record.deliveryHistory.deliveryPlace.otherLocation})` : ''}
              {record.deliveryHistory.deliveryPlace.otherFacility ? ` (${record.deliveryHistory.deliveryPlace.otherFacility})` : ''}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Delivered By</span>
            <span className="text-xs font-bold text-slate-850">
              {record.deliveryHistory.deliveryPersonnel.deliveryPersValue}
              {record.deliveryHistory.deliveryPersonnel.otherPersonnel ? ` (${record.deliveryHistory.deliveryPersonnel.otherPersonnel})` : ''}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Mode of Delivery</span>
            <span className="text-xs font-bold text-slate-850">
              {record.deliveryHistory.deliveryMode.choices}
              {record.deliveryHistory.deliveryMode.otherMode ? ` (${record.deliveryHistory.deliveryMode.otherMode})` : ''}
            </span>
          </div>
        </div>
      </div>

      {record.deliveryHistory.deliveryMode.choices === 'C-section' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-[10px] text-amber-800 font-bold block uppercase">C-Section Clinical Indication</span>
          <strong className="text-sm text-slate-900">{record.deliveryHistory.deliveryMode.csectionIndication?.csectOptions} {record.deliveryHistory.deliveryMode.csectionIndication?.otherOption ? `(${record.deliveryHistory.deliveryMode.csectionIndication.otherOption})` : ''}</strong>
        </div>
      )}
    </div>
  );

  const renderCloseout = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Assigned Screening ID</span>
          <strong className="text-sm font-mono text-slate-800">{record.sreeningId}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 font-bold block">Study Termination date</span>
          <strong className="text-sm text-slate-800">{formatToDdmMmyyyy(record.dateOfTermination)}</strong>
        </div>
      </div>

      <div className="p-4 border border-slate-200 rounded-xl space-y-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">Participant Study Status</span>
          <strong className="text-sm text-indigo-900 block">{record.participantStatus.choicesStudy}</strong>
        </div>

        {record.participantStatus.choicesStudy !== 'Completed study visits' && (
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div>
              <span className="text-[10px] text-rose-500 block font-bold uppercase">Clinical Discontinuation Reason</span>
              <strong className="text-sm text-slate-900">{record.participantStatus.incompleteReason?.incompletionOptions}</strong>
            </div>

            {record.participantStatus.incompleteReason?.deathOption && (
              <div className="p-3 bg-red-950/20 text-rose-300 rounded-lg text-xs font-semibold">
                &bull; Deceased declaration date: {formatToDdmMmyyyy(record.participantStatus.incompleteReason.deathOption)}
              </div>
            )}

            {(record.participantStatus.incompleteReason?.adverseEvent || 
              record.participantStatus.incompleteReason?.protocalDeviation || 
              record.participantStatus.incompleteReason?.withdrawalReason || 
              record.participantStatus.incompleteReason?.otherReason) && (
              <div className="p-3 bg-slate-100/80 rounded-lg text-xs">
                <strong>Specification detail notes:</strong> 
                <p className="text-slate-600 mt-1">
                  {record.participantStatus.incompleteReason.adverseEvent || 
                   record.participantStatus.incompleteReason.protocalDeviation || 
                   record.participantStatus.incompleteReason.withdrawalReason || 
                   record.participantStatus.incompleteReason.otherReason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-105 shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-600 font-bold" />
            <div>
              <h3 className="text-md font-extrabold text-slate-900">Clinical Case Report (CRF) Sheet</h3>
              <p className="text-[10px] text-slate-500 font-mono">Table: {table.toUpperCase()} &bull; Code: {record.screeningId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-150 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
            id="modal-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {table === 'screening' && renderScreening()}
          {table === 'enrolment' && renderEnrolment()}
          {table === 'delivery' && renderDelivery()}
          {table === 'closeout' && renderCloseout()}
        </div>

        {/* Audit Footer stamps */}
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Logged by Initials: <strong className="text-slate-700">{record.submittedBy || 'PA'}</strong></span>
          <span>Interview Timestamp: <strong className="text-slate-700">{record.submittedAt ? record.submittedAt.substring(0, 16).replace('T', ' ') : 'N/A'}</strong></span>
          {record.updatedBy && (
            <span className="w-full text-right mt-1 border-t border-slate-200/50 pt-1">
              Last Edited by: <strong className="text-slate-700">{record.updatedBy}</strong> on <strong className="text-slate-700">{record.updatedAt?.substring(0, 16).replace('T', ' ')}</strong>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
