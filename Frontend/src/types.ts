/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'manager' | 'technician';

export interface User {
  username: string;
  fullName: string;
  initials: string;
  role: UserRole;
}

export type HealthFacility = 'Bondo' | 'Siaya' | 'Kuoyo' | 'Lumumba';

export interface AuditFields {
  submittedBy: string; // User initials
  submittedAt: string; // ISO date-time string
  updatedBy?: string; // User initials of last editor
  updatedAt?: string; 
}

export interface ScreeningRecord extends AuditFields {
  screeningId: string; // Unique primary key, format "SCR-XXXX"
  dateOfInterview: string; // YYYY-MM-DD
  facility: HealthFacility;
  dateOfBirth: string; // YYYY-MM-DD (between 1972-01-01 and 2006-01-01)
  ageYears: number;
  ageMonths: number;
  
  // A. Initial assessment
  heightCm: number;
  weightKg: number;
  temperatureC: number;
  tempMethod: 'Axillary' | 'Oral' | 'Tympanic';
  respiratoryRate: number;
  pulseRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  lmpDate: string; // YYYY-MM-DD or 'Unknown'
  fundalHeightCm: number;

  // B. Inclusion Criteria
  incVillage15km: boolean;
  incPregnancyConfirmed: boolean;
  incGestation31wks: boolean;
  incHivConsent: boolean;
  incWillingDelivery: boolean;

  // C. Exclusion Criteria
  excMultiplePregnancy: 'Yes' | 'No' | 'Don\'t Know';
  excDeformityFistula: 'Yes' | 'No' | 'Don\'t Know';
  excInformedConsentUnable: 'Yes' | 'No';

  // D. Study Eligibility
  isEligible: boolean; // Auto-calculated based on rules
  womanConsented: 'Yes' | 'No';
  refusalReason?: 'Needs to consult' | 'Other' | '';
  refusalReasonOther?: string;
}

export interface EnrolmentRecord extends AuditFields {
  screeningId: string; // Unique key, foreign key to ScreeningRecord
  facility: HealthFacility;
  dateOfBirth: string; // Pre-filled but editable
  ageYears: number;
  ageMonths: number;

  // D. Demographics
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Other';
  husbandName?: string;
  villageOfResidence: string;
  educationLevel: 'Never attended school' | 'Primary' | 'Secondary' | 'University/College';
  occupation: 'Farmer' | 'Business woman' | 'Fisherman/ Fish monger' | 'Home maker' | 'Salaried worker' | 'Other, Specify';
  occupationOther?: string;

  // Assessments (pre-filled from screening/editable)
  heightCm: number;
  weightKg: number;
  temperatureC: number;
  tempMethod: 'Axillary' | 'Oral' | 'Tympanic';
  respiratoryRate: number;
  pulseRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  estimatedGestationUltrasoundWeeks: number;
}

export interface DeliveryRecord extends AuditFields {
  screeningId: string; // Unique key, foreign key to EnrolmentRecord
  dateOfInterview: string; // YYYY-MM-DD

  // A. Physical Examination
  motherWeightKg: number; // Postpartum
  temperatureC: number;
  tempMethod: 'Axillary' | 'Oral' | 'Tympanic';
  respiratoryRate: number;
  pulseRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  oxygenSaturation: number; // percentage
  oxygenSource: 'On room air' | 'With supplemental oxygen';
  bmiUnknown?: boolean;
  motherExamAbnormal: 'Yes' | 'No';
  motherExamAbnormalSpecify?: string;

  // C. Delivery History
  dateOfDelivery: string; // YYYY-MM-DD
  timeOfDelivery: string; // HH:MM (24h)
  deliveryLocation: 'Bondo' | 'Lumumba' | 'Siaya' | 'Other hospital/clinic' | 'Home' | 'Other location';
  deliveryLocationSpecify?: string;
  deliveredBy: 'Doctor' | 'Clinical Officer' | 'Nurse' | 'Midwife' | 'Traditional Birth Attendant' | 'Village Health Worker' | 'Other' | 'Don\'t know';
  deliveredBySpecify?: string;
  modeOfDelivery: 'Spontaneous vaginal delivery (Normal)' | 'Episiotomy' | 'Vacuum' | 'Forceps' | 'C-section' | 'Other';
  modeOfDeliverySpecify?: string;
  cSectionIndication?: 'Prolonged labor' | 'Fetal distress' | 'Meconium-stained amniotic fluid' | 'Antepartum hemorrhage' | 'Pre-eclamptic toxemia' | 'Cephalopelvic disproportion' | 'Malpresentation' | 'Elective C-section' | 'Pregnancy-induced hypertension' | 'Other' | 'Don\'t know' | '';
  cSectionIndicationOther?: string;
}

export interface CloseoutRecord extends AuditFields {
  screeningId: string; // Unique key, can be any screening record
  dateOfInterview: string;
  dateOfStudyTermination: string;
  participantStatus: 'Completed study visits' | 'Participation terminated prior to completion of study visits' | 'Screen failure before enrolment';
  discontinuationReason?: 'Adverse event' | 'Death' | 'Lost to follow-up' | 'Physician decision' | 'Protocol deviation' | 'Screen failure' | 'Study terminated by sponsor' | 'Withdrawal by participant' | 'Other' | '';
  discontinuationReasonDetail?: string; // Specification text for Adverse Event, Protocol deviation, Withdrawal, Other
  deathDate?: string; // YYYY-MM-DD if deceased
}

export interface DatabaseState {
  screening: ScreeningRecord[];
  enrolment: EnrolmentRecord[];
  delivery: DeliveryRecord[];
  closeout: CloseoutRecord[];
}
