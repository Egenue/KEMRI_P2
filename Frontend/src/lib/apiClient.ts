const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
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
    return apiRequest('/createScreeningForm', {
      method: 'POST',
      body: JSON.stringify(formData),
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
    return apiRequest(`/updateScreeningForm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }).catch(() => {
      // Fallback: delete and recreate if update fails (some backends might not support PUT on specific IDs)
      return this.deleteScreeningForm(id).then(() =>
        this.createScreeningForm(formData)
      );
    });
  },
};

export const enrollmentAPI = {
  async createEnrollmentForm(formData: any) {
    return apiRequest('/createEnrollment', {
      method: 'POST',
      body: JSON.stringify(formData),
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
    return apiRequest(`/updateEnrollment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }).catch(() => {
      return this.deleteEnrollmentForm(id).then(() =>
        this.createEnrollmentForm(formData)
      );
    });
  },
};

export const deliveryAPI = {
  async createDeliveryForm(formData: any) {
    return apiRequest('/createDelivery', {
      method: 'POST',
      body: JSON.stringify(formData),
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
    return apiRequest(`/updateDelivery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }).catch(() => {
      return this.deleteDeliveryForm(id).then(() =>
        this.createDeliveryForm(formData)
      );
    });
  },
};

export const closeoutAPI = {
  async createCloseoutForm(formData: any) {
    return apiRequest('/createCloseout', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async getAllCloseoutForms() {
    return apiRequest('/getCloseout', { method: 'GET' });
  },

  async getCloseoutFormById(id: string) {
    return apiRequest(`/getOneCloseout/${id}`, { method: 'GET' });
  },

  async deleteCloseoutForm(id: string) {
    return apiRequest(`/deleteCloseout/${id}`, { method: 'DELETE' });
  },

  async updateCloseoutForm(id: string, formData: any) {
    return apiRequest(`/updateCloseout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  },
};

export const gestationAgeAPI = {
  async createGestAge(formData: any) {
    return apiRequest('/createGestAge', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async getAllGestAge() {
    return apiRequest('/getGestAge', { method: 'GET' });
  },

  async getGestAgeByScreeningId(screeningId: string) {
    return apiRequest(`/getOneGestAge/${screeningId}`, { method: 'GET' });
  },

  async deleteGestAge(screeningId: string) {
    return apiRequest(`/deleteGestAge/${screeningId}`, { method: 'DELETE' });
  },
};

export const apiClient = {
  login: loginAPI,
  screening: screeningAPI,
  enrollment: enrollmentAPI,
  delivery: deliveryAPI,
  closeout: closeoutAPI,
  gestation: gestationAgeAPI,
};

export default apiClient;
