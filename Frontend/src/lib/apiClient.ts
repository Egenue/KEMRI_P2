const API_BASE_URL = import.meta.env.VITE_API_URL ;

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

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
      const errorMessage = errorData.error 
        ? `${errorData.message}: ${errorData.error}` 
        : (errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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
  async createScreeningForm(formData: any, userInitials?: string) {
    return apiRequest('/createScreeningForm', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllScreeningForms() {
    return apiRequest('/getScreeninForms', { method: 'GET' });
  },

  async getScreeningFormById(id: string) {
    return apiRequest(`/getOneScreeningForm/${id}`, { method: 'GET' });
  },

  async deleteScreeningForm(id: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteScreeningForm/${id}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },

  async updateScreeningForm(id: string, formData: any, userInitials?: string, reason?: string) {
    return apiRequest(`/updateScreeningForm/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, userInitials, reason }),
    }).catch(() => {
      // Fallback: delete and recreate if update fails
      return this.deleteScreeningForm(id, userInitials, 'Update Fallback').then(() =>
        this.createScreeningForm(formData, userInitials)
      );
    });
  },
};

export const enrollmentAPI = {
  async createEnrollmentForm(formData: any, userInitials?: string) {
    return apiRequest('/createEnrollment', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllEnrollmentForms() {
    return apiRequest('/getEnrollment', { method: 'GET' });
  },

  async getEnrollmentFormById(id: string) {
    return apiRequest(`/getOneEnrollment/${id}`, { method: 'GET' });
  },

  async deleteEnrollmentForm(id: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteOne/${id}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },

  async updateEnrollmentForm(id: string, formData: any, userInitials?: string, reason?: string) {
    return apiRequest(`/updateEnrollment/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, userInitials, reason }),
    }).catch(() => {
      return this.deleteEnrollmentForm(id, userInitials, 'Update Fallback').then(() =>
        this.createEnrollmentForm(formData, userInitials)
      );
    });
  },
};

export const deliveryAPI = {
  async createDeliveryForm(formData: any, userInitials?: string) {
    return apiRequest('/createDelivery', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllDeliveryForms() {
    return apiRequest('/getDelivery', { method: 'GET' });
  },

  async getDeliveryFormById(id: string) {
    return apiRequest(`/getoneDelivery/${id}`, { method: 'GET' });
  },

  async deleteDeliveryForm(id: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteDelivery/${id}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },

  async updateDeliveryForm(id: string, formData: any, userInitials?: string, reason?: string) {
    return apiRequest(`/updateDelivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, userInitials, reason }),
    }).catch(() => {
      return this.deleteDeliveryForm(id, userInitials, 'Update Fallback').then(() =>
        this.createDeliveryForm(formData, userInitials)
      );
    });
  },
};

export const closeoutAPI = {
  async createCloseoutForm(formData: any, userInitials?: string) {
    return apiRequest('/createCloseout', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllCloseoutForms() {
    return apiRequest('/getCloseout', { method: 'GET' });
  },

  async getCloseoutFormById(id: string) {
    return apiRequest(`/getOneCloseout/${id}`, { method: 'GET' });
  },

  async deleteCloseoutForm(id: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteCloseout/${id}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },

  async updateCloseoutForm(id: string, formData: any, userInitials?: string, reason?: string) {
    return apiRequest(`/updateCloseout/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, userInitials, reason }),
    });
  },
};

export const gestationAgeAPI = {
  async createGestAge(formData: any, userInitials?: string) {
    return apiRequest('/createGestAge', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllGestAge() {
    return apiRequest('/getGestAge', { method: 'GET' });
  },

  async getGestAgeByScreeningId(screeningId: string) {
    return apiRequest(`/getOneGestAge/${screeningId}`, { method: 'GET' });
  },

  async deleteGestAge(screeningId: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteGestAge/${screeningId}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },

  async updateGestAge(screeningId: string, formData: any, userInitials?: string, reason?: string) {
    return apiRequest(`/updateGestAge/${screeningId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, userInitials, reason }),
    });
  },
};

export const ancVisitAPI = {
  async createAncVisit(formData: any, userInitials?: string) {
    return apiRequest('/createAncVisit', {
      method: 'POST',
      body: JSON.stringify({ ...formData, userInitials, reason: 'Initial Entry' }),
    });
  },

  async getAllAncVisits() {
    return apiRequest('/getAncVisit', { method: 'GET' });
  },

  async getAncVisitByNumber(visitNumber: string) {
    return apiRequest(`/getOneAnc/${visitNumber}`, { method: 'GET' });
  },

  async deleteAncVisit(visitNumber: string, userInitials?: string, reason?: string) {
    return apiRequest(`/deleteAnc/${visitNumber}`, { 
      method: 'DELETE',
      body: JSON.stringify({ userInitials, reason })
    });
  },
};

export const auditAPI = {
  async getAllAuditLogs() {
    return apiRequest('/getAuditLog', { method: 'GET' });
  },
};

export const apiClient = {
  login: loginAPI,
  screening: screeningAPI,
  enrollment: enrollmentAPI,
  delivery: deliveryAPI,
  closeout: closeoutAPI,
  gestation: gestationAgeAPI,
  anc: ancVisitAPI,
  audit: auditAPI,
};

export default apiClient;
