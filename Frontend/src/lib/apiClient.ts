/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ;

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}


const transformScreeningToBackend = (record: any) => {
  return {
    screeningId: record.screeningId,
    interviewDate: new Date(record.dateOfInterview),
    healthFacility: record.facility,
    DoB: new Date(record.dateOfBirth),
    Age: {
      months: record.ageMonths,
      years: record.ageYears,
    },
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
    lastMenstrualPeriod: {
      date: record.lmpDate === 'Unknown' ? new Date() : new Date(record.lmpDate),
      unknown: record.lmpDate === 'Unknown',
    },
    fundalHeight: record.fundalHeightCm,
    inclusionCriteria: {
      residentWithin15km: record.incVillage15km,
      pregnancyConfirmed: record.incPregnancyConfirmed,
      gestationLessThan31Weeks: record.incGestation31wks,
      consentsToHIVTesting: record.incHivConsent,
      willingToDeliverAtStudyHospital: record.incWillingDelivery,
    },
    exclusionCriteria: {
      multiplePregancy: record.excMultiplePregnancy,
      fisturaRepairOrSpinalDeformity: record.excDeformityFistula,
      unableToGiveInformedConsent: record.excInformedConsentUnable,
    },
    eligibility: {
      meetsAllCriteria: record.isEligible,
      consentedToParticipate: record.womanConsented === 'Yes',
      reasonForRefusal: record.refusalReason || '',
    },
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
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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

  async userLogin(email: string, password: string) {
    return apiRequest('/userLogin', {
      method: 'POST',
      body: JSON.stringify({
        email,
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
    return apiRequest('/createScreeningForm', {
      method: 'POST',
      body: JSON.stringify(backendData),
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
