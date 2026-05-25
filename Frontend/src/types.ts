export type UserRole = 'manager' | 'technician' | 'admin';

export interface User {
  username: string;
  fullName: string;
  initials: string;
  role: UserRole;
  email: string;
}

export type HealthFacility = 'Bondo' | 'Siaya' | 'Kuoyo' | 'Lumumba';

export interface AuditFields {
  submittedBy: string;
  submittedAt: string;
  updatedBy?: string;
  updatedAt?: string;
  createdAt?: string;
  updatedAt_db?: string; // Avoiding conflict with updatedAt from AuditFields
}

export interface VitalSigns {
  temperature: {
    value: number;
    location: 'Axillary' | 'Oral' | 'Tympanic';
  };
  respiratoryRate: number;
  pulseRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
}

export interface ScreeningRecord extends AuditFields {
  screeningId: string;
  interviewDate: string;
  healthFacility: HealthFacility;
  DoB: string;
  Age: {
    months: number;
    years: number;
  };
  height: number;
  weight: number;
  vitalSigns: VitalSigns;
  lastMenstrualPeriod: {
    date: string;
    unknown: boolean;
  };
  fundalHeight: number;
  inclusionCriteria: {
    residentWithin15km: 'Yes' | 'No';
    pregnancyConfirmed: 'Yes' | 'No';
    gestationLessThan31Weeks: 'Yes' | 'No';
    consentsToHIVTesting: 'Yes' | 'No';
    willingToDeliverAtStudyHospital: 'Yes' | 'No';
  };
  exclusionCriteria: {
    multiplePregancy: 'Yes' | 'No' | "Don't Know";
    fisturaRepairOrSpinalDeformity: 'Yes' | 'No' | "Don't Know";
    unableToGiveInformedConsent: 'Yes' | 'No';
  };
  eligibility: {
    meetsAllCriteria: 'Yes' | 'No';
    consentedToParticipate: 'Yes' | 'No';
    reasonForRefusal?: 'Needs to consult' | 'Other' | null;
  };
}

export interface EnrolmentRecord extends AuditFields {
  screeningId: string;
  healthFacility: HealthFacility;
  DoB: string;
  Age: {
    months: number;
    years: number;
  };
  maritalStatus: 'Married' | 'Single' | 'Divorced' | 'Widowed';
  HusbandName?: string;
  villageOfResidence: string;
  educationLevel: "Never Attended School" | "Primary" | "Secondary" | "University/Collage";
  subjectOccupation: "Farmer" | "Business woman" | "Fisherman/Fish monger" | "Home maker" | "Salaried worker" | "Other";
  otherOccupation?: string;
  height: number;
  weight: number;
  vitalSigns: VitalSigns;
  estGestAge: number;
  gaParameters?: {
    ultrasoundDate: string;
    usWeeks: number;
    usDays: number;
    lmpDate?: string;
    lmpCertainty?: 'certain' | 'uncertain' | '';
    calculatedTrimester: string;
    finalPregnancyStartDate: string;
    gaAtEnrolmentDays: number;
    edd: string;
    source: string;
    loc: string;
  };
}

export interface DeliveryRecord extends AuditFields {
  interviewDate: string;
  deliveryScreeningId: string;
  physicalExam: {
    motherWeight: number;
    vitalSigns: {
      temperature: {
        tempValue: number;
        location: 'Axillary' | 'Oral' | 'Tympanic';
      };
      respiratoryRate: number;
      pulseRate: number;
      bloodPressure: {
        systolic: number;
        diastolic: number;
      };
      oxygenSaturation: {
        oxygenValue: number;
        oxygenOptions: 'On room air' | 'With supplemental oxygen';
      };
    };
  };
  bodyMassIndex: {
    value: number | null;
    unknown: boolean;
  };
  motherAbnormality: {
    motherAbnomValue: 'Yes' | 'No';
    specifics?: string;
  };
  deliveryHistory: {
    deliveryDate: string;
    deliveryTime: string;
    deliveryPlace: {
      deliveryChoices: "Bondo" | "Lumumba" | "Siaya" | "Home" | "Other Location" | "Other hospital/clinic";
      otherLocation?: string;
      otherFacility?: string;
    };
    deliveryPersonnel: {
      deliveryPersValue: "Doctor" | "Clinical Officer" | "Nurse" | "Midwife" | "Traditional Birth Attendant" | "Village Health Worker" | "Other" | "Don't know";
      otherPersonnel?: string;
    };
    deliveryMode: {
      choices: "Spontaneous vaginal delivery (Normal" | "Episiotomy" | "Vacuum" | "Forceps" | "C-section" | "Other";
      otherMode?: string;
      csectionIndication?: {
        csectOptions: "Prolonged labour" | "Fetal distress" | "Meconium-stained amniotic fluid" | "Antepartum hemorrhage" | "Pre-eclempic toxemia" | "cephalopelvic disproportion" | "Malpresentation" | "Elective C-section" | "Pregnancy-induced hypertension" | "Other" | "Don't know";
        otherOption?: string;
      };
    };
  };
  // Closeout is nested in backend deliveryForm model
  closeOut?: CloseoutRecord;
}

export interface CloseoutRecord {
  closeOutInterviewDate: string;
  sreeningId: string;
  dateOfTermination: string;
  participantStatus: {
    choicesStudy: "Completed study visits" | "Participation terminated prior to completion of study visits" | "Screen failure before enrollment";
    incompleteReason?: {
      incompletionOptions: "Adverse event" | "Death" | "Lost to follow-up" | "Physician decision" | "Protocol deviation" | "Screen failure" | "Study terminated by sponsor" | "Withrawal by participant" | "Other";
      adverseEvent?: string;
      deathOption?: string;
      protocalDeviation?: string;
      withdrawalReason?: string;
      otherReason?: string;
    };
  };
}

export interface DatabaseState {
  screening: ScreeningRecord[];
  enrolment: EnrolmentRecord[];
  delivery: DeliveryRecord[];
  closeout: CloseoutRecord[]; // Keep it separate for frontend convenience if needed, or handle it as part of delivery
}
