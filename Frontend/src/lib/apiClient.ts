const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}


const transformScreeningToBackend = (record: any) => {
  // Helper function to convert boolean to Yes/No string (STRICT - no empty strings)
  const boolToYesNo = (value: boolean | string | null): 'Yes' | 'No' => {
    if (value === null || value === undefined) return 'No';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === 'Yes') return 'Yes';
    if (value === 'No') return 'No';
    // Default to 'No' for any unexpected values
    return 'No';
  };

  // Helper function for exclusion criteria that allow "Don't Know"
  const exclusionValue = (value: any): 'Yes' | 'No' | "Don't Know" => {
    if (value === "Don't Know") return "Don't Know";
    return boolToYesNo(value);
  };

  // Helper function to ensure numeric values are valid
  const ensureNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : defaultValue;
  };

  // Helper function to ensure valid dates
  const ensureDate = (value: any, defaultDate?: Date): Date => {
    if (!value) return defaultDate || new Date();
    const date = new Date(value);
    return date.getTime() > 0 ? date : (defaultDate || new Date());
  };

  // Determine if woman consented
  const consentedToParticipate = record.womanConsented === 'Yes' ? 'Yes' : 'No';

  // Build eligibility object with proper reasonForRefusal handling
  const sanitizedEligibility: any = {
    meetsAllCriteria: boolToYesNo(record.isEligible),
    consentedToParticipate: consentedToParticipate,
  };

  // Only add reasonForRefusal if woman did NOT consent
  // When she consented, OMIT the field entirely so Mongoose uses the default (null)
  if (consentedToParticipate === 'No') {
    // When refused, reasonForRefusal must be 'Needs to consult' or 'Other'
    const validReasons = ['Needs to consult', 'Other'];
    sanitizedEligibility.reasonForRefusal = validReasons.includes(record.refusalReason)
      ? record.refusalReason
      : 'Other'; // Default to 'Other' if invalid
  }
  // Note: When consentedToParticipate is 'Yes', reasonForRefusal is NOT included in the object

  // Ensure all exclusion criteria fields have valid enum values
  // Note: multiplePregancy and fisturaRepairOrSpinalDeformity allow "Don't Know"
  const sanitizedExclusion = {
    multiplePregancy: exclusionValue(record.excMultiplePregnancy),
    fisturaRepairOrSpinalDeformity: exclusionValue(record.excDeformityFistula),
    unableToGiveInformedConsent: boolToYesNo(record.excInformedConsentUnable),
  };

  // Ensure all inclusion criteria fields have valid enum values (STRICTLY 'Yes' or 'No')
  const sanitizedInclusion = {
    residentWithin15km: boolToYesNo(record.incVillage15km),
    pregnancyConfirmed: boolToYesNo(record.incPregnancyConfirmed),
    gestationLessThan31Weeks: boolToYesNo(record.incGestation31wks),
    consentsToHIVTesting: boolToYesNo(record.incHivConsent),
    willingToDeliverAtStudyHospital: boolToYesNo(record.incWillingDelivery),
  };

  return {
    screeningId: String(record.screeningId || '').trim(),
    interviewDate: ensureDate(record.dateOfInterview),
    healthFacility: String(record.facility || 'Bondo'),
    DoB: ensureDate(record.dateOfBirth),
    Age: {
      months: Math.max(0, Math.min(9, ensureNumber(record.ageMonths))),
      years: Math.max(10, Math.min(50, ensureNumber(record.ageYears))),
    },
    height: Math.max(50, Math.min(300, ensureNumber(record.heightCm))),
    weight: Math.max(20, Math.min(150, ensureNumber(record.weightKg))),
    vitalSigns: {
      temperature: {
        value: Math.max(35, Math.min(42, ensureNumber(record.temperatureC))),
        location: String(record.tempMethod || 'Oral'),
      },
      respiratoryRate: Math.max(10, Math.min(60, ensureNumber(record.respiratoryRate))),
      pulseRate: Math.max(30, Math.min(180, ensureNumber(record.pulseRate))),
      bloodPressure: {
        systolic: Math.max(60, Math.min(200, ensureNumber(record.bloodPressureSys))),
        diastolic: Math.max(40, Math.min(120, ensureNumber(record.bloodPressureDia))),
      },
    },
    lastMenstrualPeriod: {
      date: record.lmpDate === 'Unknown' ? ensureDate(null) : ensureDate(record.lmpDate),
      unknown: record.lmpDate === 'Unknown' || !record.lmpDate,
    },
    fundalHeight: Math.max(0, Math.min(40, ensureNumber(record.fundalHeightCm))),
    inclusionCriteria: sanitizedInclusion,
    exclusionCriteria: sanitizedExclusion,
    eligibility: sanitizedEligibility,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const transformEnrollmentToBackend = (record: any) => {
  return {
    screeningId: record.screeningId,
    healthFacility: record.facility,
    DoB: new Date(record.dateOfBirth),
    Age: {
      months: record.ageMonths,
      years: record.ageYears,
    },
    maritalStatus: record.maritalStatus,
    HusbandName: record.husbandName || '',
    villageOfResidence: record.villageOfResidence,
    educationLevel: record.educationLevel,
    subjectOccupation: record.occupation,
    otherOccupation: record.occupationOther || '',
    height: record.heightCm,
    weight: record.weightKg,
    vitalSigns: {
      temperature: {
        value: record.temperatureC,
        location: record.tempMethod,
      },
      respiratoryRate: record.respiratoryRate,
      pulseRate: record.pulseRate,
      bloodPressure: {
        systolic: record.bloodPressureSys,
        diastolic: record.bloodPressureDia,
      },
    },
    estGestAge: record.estimatedGestationUltrasoundWeeks,
  };
};

const transformDeliveryToBackend = (record: any) => {
  return {
    interviewDate: new Date(record.dateOfInterview),
    deliveryScreeningId: record.screeningId,
    physicalExam: {
      motherWeight: record.motherWeightKg,
      vitalSigns: {
        temperature: {
          tempValue: record.temperatureC,
          location: record.tempMethod,
        },
        respiratoryRate: record.respiratoryRate,
        pulseRate: record.pulseRate,
        bloodPressure: {
          systolic: record.bloodPressureSys,
          diastolic: record.bloodPressureDia,
        },
        oxygenSaturation: {
          oxygenValue: record.oxygenSaturation || 0,
          oxygenOptions: record.oxygenOptions || 'On room air',
        },
      },
    },
    bodyMassIndex: {
      value: record.motherBMI || null,
      unknown: !record.motherBMI,
    },
    motherAbnormality: {
      motherAbnomValue: record.motherAbnormality || 'No',
      specifics: record.motherAbnormalityDetails || '',
    },
  };
};


async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    // Log the request data for debugging
    if (options.body && typeof options.body === 'string') {
      try {
        const bodyData = JSON.parse(options.body);
        console.log(`[API Request] ${endpoint}`, bodyData);
      } catch (e) {
        // Silently fail JSON parsing
      }
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[API Error] ${endpoint}:`, errorMessage, errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
}


export const loginAPI = {
  async createLogin(email: string, userName: string, password: string, userRole: string) {
    return apiRequest('/createLogin', {
      method: 'POST',
      body: JSON.stringify({
        email,
        userName,
        password,
        dateCreated: new Date(),
        userRole,
      }),
    });
  },

  async userLogin(email: string, userName: string, fullName: string, password: string) {
    return apiRequest('/userLogin', {
      method: 'POST',
      body: JSON.stringify({
        email,
        userName,
        fullName,
        password,
        dateLoggedIn: new Date(),
      }),
    });
  },

  async getAllLogins() {
    return apiRequest('/allLogin', { method: 'GET' });
  },

  async getLoginById(id: string) {
    return apiRequest(`/loginId/${id}`, { method: 'GET' });
  },

  async deleteLogin(id: string) {
    return apiRequest(`/deleteLogin/${id}`, { method: 'DELETE' });
  },
};


export const screeningAPI = {
  async createScreeningForm(formData: any) {
    const backendData = transformScreeningToBackend(formData);
    
    // Log the transformed data for debugging
    console.log('[Screening Form Data Being Sent]', JSON.stringify(backendData, null, 2));
    
    return apiRequest('/createScreeningForm', {
      method: 'POST',
      body: backendData ? JSON.stringify(backendData) : null,
    });
  },

  async getAllScreeningForms() {
    return apiRequest('/getScreeninForms', { method: 'GET' });
  },

  async getScreeningFormById(id: string) {
    return apiRequest(`/getOneScreeningForm/${id}`, { method: 'GET' });
  },

  async deleteScreeningForm(id: string) {
    return apiRequest(`/deleteScreeningForm/${id}`, { method: 'DELETE' });
  },

  async updateScreeningForm(id: string, formData: any) {
    const backendData = transformScreeningToBackend(formData);
    return apiRequest(`/updateScreeningForm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    }).catch(() => {
      // Fallback: delete and recreate
      return this.deleteScreeningForm(id).then(() =>
        this.createScreeningForm(formData)
      );
    });
  },
};


export const enrollmentAPI = {
  async createEnrollmentForm(formData: any) {
    const backendData = transformEnrollmentToBackend(formData);
    return apiRequest('/createEnrollment', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  async getAllEnrollmentForms() {
    return apiRequest('/getEnrollment', { method: 'GET' });
  },

  async getEnrollmentFormById(id: string) {
    return apiRequest(`/getOneEnrollment/${id}`, { method: 'GET' });
  },

  async deleteEnrollmentForm(id: string) {
    return apiRequest(`/deleteOne/${id}`, { method: 'DELETE' });
  },

  async updateEnrollmentForm(id: string, formData: any) {
    const backendData = transformEnrollmentToBackend(formData);
    return apiRequest(`/updateEnrollment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    }).catch(() => {
      return this.deleteEnrollmentForm(id).then(() =>
        this.createEnrollmentForm(formData)
      );
    });
  },
};


export const deliveryAPI = {
  async createDeliveryForm(formData: any) {
    const backendData = transformDeliveryToBackend(formData);
    return apiRequest('/createDelivery', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  },

  async getAllDeliveryForms() {
    return apiRequest('/getDelivery', { method: 'GET' });
  },

  async getDeliveryFormById(id: string) {
    return apiRequest(`/getoneDelivery/${id}`, { method: 'GET' });
  },

  async deleteDeliveryForm(id: string) {
    return apiRequest(`/deleteDelivery/${id}`, { method: 'DELETE' });
  },

  async updateDeliveryForm(id: string, formData: any) {
    const backendData = transformDeliveryToBackend(formData);
    return apiRequest(`/updateDelivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    }).catch(() => {
      return this.deleteDeliveryForm(id).then(() =>
        this.createDeliveryForm(formData)
      );
    });
  },
};


export const apiClient = {
  login: loginAPI,
  screening: screeningAPI,
  enrollment: enrollmentAPI,
  delivery: deliveryAPI,
};

export default apiClient;
