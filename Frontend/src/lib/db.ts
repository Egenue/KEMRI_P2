/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseState, ScreeningRecord, EnrolmentRecord, DeliveryRecord, CloseoutRecord } from '../types';

const STORAGE_KEY = 'clinical_workflow_db';

// High-quality initial mock records representing Bondo, Siaya, Kuoyo, Lumumba
const INITIAL_SCREENING: ScreeningRecord[] = [
  {
    screeningId: 'SCR-1001',
    dateOfInterview: '2026-05-10',
    facility: 'Bondo',
    dateOfBirth: '1995-04-12',
    ageYears: 31,
    ageMonths: 1,
    heightCm: 162,
    weightKg: 64.5,
    temperatureC: 36.8,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 76,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    lmpDate: '2025-10-15',
    fundalHeightCm: 22,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: true,
    excMultiplePregnancy: 'No',
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: true,
    womanConsented: 'Yes',
    submittedBy: 'PA',
    submittedAt: '2026-05-10T09:15:00Z',
  },
  {
    screeningId: 'SCR-1002',
    dateOfInterview: '2026-05-11',
    facility: 'Siaya',
    dateOfBirth: '1998-08-22',
    ageYears: 27,
    ageMonths: 9,
    heightCm: 158,
    weightKg: 58.0,
    temperatureC: 37.1,
    tempMethod: 'Axillary',
    respiratoryRate: 20,
    pulseRate: 82,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    lmpDate: '2025-11-01',
    fundalHeightCm: 20,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: true,
    excMultiplePregnancy: 'No',
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: true,
    womanConsented: 'Yes',
    submittedBy: 'PA',
    submittedAt: '2026-05-11T10:30:00Z',
  },
  {
    screeningId: 'SCR-1003',
    dateOfInterview: '2026-05-12',
    facility: 'Kuoyo',
    dateOfBirth: '1992-12-05',
    ageYears: 33,
    ageMonths: 5,
    heightCm: 165,
    weightKg: 72.3,
    temperatureC: 36.5,
    tempMethod: 'Tympanic',
    respiratoryRate: 16,
    pulseRate: 72,
    bloodPressureSys: 110,
    bloodPressureDia: 70,
    lmpDate: '2025-09-20',
    fundalHeightCm: 25,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: true,
    excMultiplePregnancy: 'No',
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: true,
    womanConsented: 'Yes',
    submittedBy: 'FT',
    submittedAt: '2026-05-12T14:45:00Z',
  },
  {
    screeningId: 'SCR-1004',
    dateOfInterview: '2026-05-13',
    facility: 'Lumumba',
    dateOfBirth: '2001-03-14',
    ageYears: 25,
    ageMonths: 2,
    heightCm: 160,
    weightKg: 55.2,
    temperatureC: 36.7,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 78,
    bloodPressureSys: 115,
    bloodPressureDia: 75,
    lmpDate: '2025-11-10',
    fundalHeightCm: 18,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: false, // Refused to deliver in hospital
    excMultiplePregnancy: 'No',
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: false,
    womanConsented: 'No',
    submittedBy: 'FT',
    submittedAt: '2026-05-13T08:20:00Z',
  },
  {
    screeningId: 'SCR-1005',
    dateOfInterview: '2026-05-14',
    facility: 'Bondo',
    dateOfBirth: '1989-11-30',
    ageYears: 36,
    ageMonths: 5,
    heightCm: 170,
    weightKg: 85.0,
    temperatureC: 36.9,
    tempMethod: 'Oral',
    respiratoryRate: 22,
    pulseRate: 88,
    bloodPressureSys: 135,
    bloodPressureDia: 85,
    lmpDate: '2025-08-05',
    fundalHeightCm: 29,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: true,
    excMultiplePregnancy: 'Yes', // Multiple pregnancy -> Ineligible
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: false,
    womanConsented: 'No',
    submittedBy: 'PA',
    submittedAt: '2026-05-14T11:50:00Z',
  },
  {
    screeningId: 'SCR-1006',
    dateOfInterview: '2026-05-15',
    facility: 'Siaya',
    dateOfBirth: '1996-05-15',
    ageYears: 30,
    ageMonths: 0,
    heightCm: 163,
    weightKg: 62.0,
    temperatureC: 36.6,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 74,
    bloodPressureSys: 112,
    bloodPressureDia: 72,
    lmpDate: '2025-10-22',
    fundalHeightCm: 21,
    incVillage15km: true,
    incPregnancyConfirmed: true,
    incGestation31wks: true,
    incHivConsent: true,
    incWillingDelivery: true,
    excMultiplePregnancy: 'No',
    excDeformityFistula: 'No',
    excInformedConsentUnable: 'No',
    isEligible: true,
    womanConsented: 'Yes',
    submittedBy: 'PA',
    submittedAt: '2026-05-15T09:40:00Z',
  }
];

const INITIAL_ENROLMENT: EnrolmentRecord[] = [
  {
    screeningId: 'SCR-1001',
    facility: 'Bondo',
    dateOfBirth: '1995-04-12',
    ageYears: 31,
    ageMonths: 1,
    maritalStatus: 'Married',
    husbandName: 'John Omondi',
    villageOfResidence: 'Bondo Central',
    educationLevel: 'Secondary',
    occupation: 'Business woman',
    heightCm: 162,
    weightKg: 64.5,
    temperatureC: 36.8,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 76,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    estimatedGestationUltrasoundWeeks: 20,
    submittedBy: 'PA',
    submittedAt: '2026-05-10T11:20:00Z',
  },
  {
    screeningId: 'SCR-1002',
    facility: 'Siaya',
    dateOfBirth: '1998-08-22',
    ageYears: 27,
    ageMonths: 9,
    maritalStatus: 'Single',
    villageOfResidence: 'Siaya Town',
    educationLevel: 'University/College',
    occupation: 'Salaried worker',
    heightCm: 158,
    weightKg: 58.0,
    temperatureC: 37.1,
    tempMethod: 'Axillary',
    respiratoryRate: 20,
    pulseRate: 82,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    estimatedGestationUltrasoundWeeks: 18,
    submittedBy: 'PA',
    submittedAt: '2026-05-11T12:05:00Z',
  },
  {
    screeningId: 'SCR-1003',
    facility: 'Kuoyo',
    dateOfBirth: '1992-12-05',
    ageYears: 33,
    ageMonths: 5,
    maritalStatus: 'Married',
    husbandName: 'David Koech',
    villageOfResidence: 'Kuoyo Village',
    educationLevel: 'Primary',
    occupation: 'Farmer',
    heightCm: 165,
    weightKg: 72.3,
    temperatureC: 36.5,
    tempMethod: 'Tympanic',
    respiratoryRate: 16,
    pulseRate: 72,
    bloodPressureSys: 110,
    bloodPressureDia: 70,
    estimatedGestationUltrasoundWeeks: 22,
    submittedBy: 'FT',
    submittedAt: '2026-05-12T15:30:00Z',
  },
  {
    screeningId: 'SCR-1006',
    facility: 'Siaya',
    dateOfBirth: '1996-05-15',
    ageYears: 30,
    ageMonths: 0,
    maritalStatus: 'Widowed',
    villageOfResidence: 'Siaya Suburbs',
    educationLevel: 'Secondary',
    occupation: 'Home maker',
    heightCm: 163,
    weightKg: 62.0,
    temperatureC: 36.6,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 74,
    bloodPressureSys: 112,
    bloodPressureDia: 72,
    estimatedGestationUltrasoundWeeks: 19,
    submittedBy: 'PA',
    submittedAt: '2026-05-15T11:10:00Z',
  }
];

const INITIAL_DELIVERY: DeliveryRecord[] = [
  {
    screeningId: 'SCR-1002',
    dateOfInterview: '2026-05-18',
    motherWeightKg: 55.8,
    temperatureC: 36.8,
    tempMethod: 'Oral',
    respiratoryRate: 18,
    pulseRate: 78,
    bloodPressureSys: 115,
    bloodPressureDia: 75,
    oxygenSaturation: 98,
    oxygenSource: 'On room air',
    motherExamAbnormal: 'No',
    dateOfDelivery: '2026-05-18',
    timeOfDelivery: '04:35',
    deliveryLocation: 'Siaya',
    deliveredBy: 'Nurse',
    modeOfDelivery: 'Spontaneous vaginal delivery (Normal)',
    submittedBy: 'PA',
    submittedAt: '2026-05-18T07:12:00Z',
  }
];

const INITIAL_CLOSEOUT: CloseoutRecord[] = [
  {
    screeningId: 'SCR-1006',
    dateOfInterview: '2026-05-20',
    dateOfStudyTermination: '2026-05-20',
    participantStatus: 'Participation terminated prior to completion of study visits',
    discontinuationReason: 'Lost to follow-up',
    submittedBy: 'PA',
    submittedAt: '2026-05-20T14:30:00Z',
  }
];

export function getDatabase(): DatabaseState {
  if (typeof window === 'undefined') {
    return {
      screening: [],
      enrolment: [],
      delivery: [],
      closeout: []
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const db: DatabaseState = {
      screening: [],
      enrolment: [],
      delivery: [],
      closeout: []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing stored database, resetting to defaults.', e);
    return {
      screening: [],
      enrolment: [],
      delivery: [],
      closeout: []
    };
  }
}

export function saveDatabase(db: DatabaseState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

export function resetDatabase(): DatabaseState {
  const db: DatabaseState = {
    screening: INITIAL_SCREENING,
    enrolment: INITIAL_ENROLMENT,
    delivery: INITIAL_DELIVERY,
    closeout: INITIAL_CLOSEOUT
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}
