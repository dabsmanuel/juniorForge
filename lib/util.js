// API Configuration
export const API_BASE = 'https://juniorforge.onrender.com/api';

// Auth API functions
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token in localStorage on successful login
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
    }
    
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  getCurrentAdmin: async (token) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data;
  },

  getPendingAdmins: async (token) => {
    const response = await fetch(`${API_BASE}/auth/pending-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending admins');
    }
    return data;
  },

  getAllAdmins: async (token) => {
    const response = await fetch(`${API_BASE}/auth/all-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch admins');
    }
    return data;
  },

  getAccountingEligibleAdmins: async (token) => {
    const response = await fetch(`${API_BASE}/auth/accounting-eligible-admins`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch accounting eligible admins');
    }
    return data;
  },

  approveAdmin: async (token, adminId, permissions = {}) => {
    const response = await fetch(`${API_BASE}/auth/approve/${adminId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve admin');
    }
    return data;
  },

  rejectAdmin: async (token, adminId, reason) => {
    const response = await fetch(`${API_BASE}/auth/reject/${adminId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reject admin');
    }
    return data;
  },

  suspendAdmin: async (token, adminId, reason) => {
    const response = await fetch(`${API_BASE}/auth/suspend/${adminId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to suspend admin');
    }
    return data;
  },

  reactivateAdmin: async (token, adminId) => {
    const response = await fetch(`${API_BASE}/auth/reactivate/${adminId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reactivate admin');
    }
    return data;
  },

  updateAdminPermissions: async (token, adminId, permissions) => {
    const response = await fetch(`${API_BASE}/auth/permissions/${adminId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update admin permissions');
    }
    return data;
  },

  // NEW: Accounting access management functions
  grantAccountingAccess: async (token, adminId) => {
    const response = await fetch(`${API_BASE}/auth/grant-accounting-access/${adminId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to grant accounting access');
    }
    return data;
  },

  revokeAccountingAccess: async (token, adminId) => {
    const response = await fetch(`${API_BASE}/auth/revoke-accounting-access/${adminId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to revoke accounting access');
    }
    return data;
  },

  deleteAdmin: async (token, adminId) => {
    const response = await fetch(`${API_BASE}/auth/admin/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete admin');
    }
    return data;
  },

  getAdminStats: async (token) => {
    const response = await fetch(`${API_BASE}/auth/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stats');
    }
    return data;
  },

  // Profile management functions
  updateProfile: async (token, profileData) => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data;
  },

  changePassword: async (token, passwordData) => {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }
    return data;
  },
};

// Submissions API functions
export const submissionsApi = {
  getAllSubmissions: async (token) => {
    const response = await fetch(`${API_BASE}/admin/submissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch submissions');
    }
    return data;
  },

  getAllSubmissions: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/admin/submissions${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch submissions');
    }
    return data;
  },

  getSubmissionsByType: async (token, type, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/admin/submissions/${type}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch submissions');
    }
    return data;
  },

  getSubmission: async (token, id) => {
    const response = await fetch(`${API_BASE}/admin/submission/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch submission');
    }
    return data;
  },

  deleteSubmission: async (token, id) => {
    const response = await fetch(`${API_BASE}/admin/submission/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete submission');
    }
    return data;
  },

  downloadFile: async (token, submissionId, fileType) => {
    console.log('API downloadFile called:', { submissionId, fileType });
    
    const response = await fetch(`${API_BASE}/admin/download/${submissionId}/${fileType}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Download failed' }));
      throw new Error(errorData.message || 'Failed to download file');
    }
    
    return response;
  },

  // NEW VETTING FUNCTIONS
  
  // Get all vetted submissions
  getVettedSubmissions: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/admin/vetted-submissions${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vetted submissions');
    }
    return data;
  },

  // Vet a talent submission
  vetSubmission: async (token, submissionId, vettingData) => {
    const response = await fetch(`${API_BASE}/admin/submission/${submissionId}/vet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vettingData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to vet submission');
    }
    return data;
  },

  // Convert vetted submission to main talent database
  convertToTalent: async (token, submissionId, additionalData = {}) => {
    const response = await fetch(`${API_BASE}/admin/submission/${submissionId}/convert-to-talent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(additionalData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to convert submission to talent');
    }
    return data;
  },
};

// Talent API functions
export const talentApi = {
  getAllTalents: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/talents${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch talents');
    }
    return data;
  },

  getTalentById: async (token, id) => {
    const response = await fetch(`${API_BASE}/talents/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch talent');
    }
    return data;
  },

  createTalent: async (token, formData) => {
    const response = await fetch(`${API_BASE}/talents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData, // FormData object with files
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create talent');
    }
    return data;
  },

  updateTalent: async (token, id, formData) => {
    const response = await fetch(`${API_BASE}/talents/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData object with files
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update talent');
    }
    return data;
  },

  deleteTalent: async (token, id) => {
    const response = await fetch(`${API_BASE}/talents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete talent');
    }
    return data;
  },

  vetTalent: async (token, id, vettingData) => {
    const response = await fetch(`${API_BASE}/talents/${id}/vet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vettingData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to vet talent');
    }
    return data;
  },

  getTalentStats: async (token) => {
    const response = await fetch(`${API_BASE}/talents/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch talent stats');
    }
    return data;
  },
};

// Bootcamp API functions
export const bootcampApi = {
  getAllBootcamps: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/bootcamps${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bootcamps');
    }
    return data;
  },

  getBootcampById: async (token, id) => {
    const response = await fetch(`${API_BASE}/bootcamps/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bootcamp');
    }
    return data;
  },

  createBootcamp: async (token, bootcampData) => {
    const response = await fetch(`${API_BASE}/bootcamps`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bootcampData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create bootcamp');
    }
    return data;
  },

  updateBootcamp: async (token, id, bootcampData) => {
    const response = await fetch(`${API_BASE}/bootcamps/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bootcampData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update bootcamp');
    }
    return data;
  },

  deleteBootcamp: async (token, id) => {
    const response = await fetch(`${API_BASE}/bootcamps/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete bootcamp');
    }
    return data;
  },

  getBootcampTalents: async (token, id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/bootcamps/${id}/talents${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bootcamp talents');
    }
    return data;
  },

  updateBootcampStatistics: async (token, id) => {
    const response = await fetch(`${API_BASE}/bootcamps/${id}/update-stats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update statistics');
    }
    return data;
  },

  getBootcampStats: async (token) => {
    const response = await fetch(`${API_BASE}/bootcamps/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bootcamp stats');
    }
    return data;
  },
};

// Email API functions
export const emailApi = {
  sendEmailToSubmission: async (token, submissionId, emailData) => {
    const response = await fetch(`${API_BASE}/email/send/${submissionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }
    return data;
  },

  sendBulkEmail: async (token, bulkEmailData) => {
    const response = await fetch(`${API_BASE}/email/send-bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bulkEmailData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send bulk email');
    }
    return data;
  },

  getEmailHistory: async (token, submissionId) => {
    const response = await fetch(`${API_BASE}/email/history/${submissionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch email history');
    }
    return data;
  },
};

export const accountingApi = {
  getPlacements: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/placements${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch placements');
    }
    return data;
  },

  createPlacement: async (token, placementData) => {
    const response = await fetch(`${API_BASE}/accounting/placements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placementData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create placement');
    }
    return data;
  },

  updatePlacement: async (token, id, placementData) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placementData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update placement');
    }
    return data;
  },

  deletePlacement: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete placement');
    }
    return data;
  },

  getPlacementById: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch placement');
    }
    return data;
  },

  transitionPlacement: async (token, id, body = {}) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}/transition`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to transition placement');
    }
    return data;
  },

  terminatePlacement: async (token, id, body = {}) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}/terminate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to terminate placement');
    }
    return data;
  },

  generatePlacementRevenues: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/placements/${id}/generate-revenues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate placement revenues');
    }
    return data;
  },

  generateAllPlacementRevenues: async (token) => {
    const response = await fetch(`${API_BASE}/accounting/automation/generate-all-revenues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate all placement revenues');
    }
    return data;
  },

  getRevenues: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/revenues${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenues');
    }
    return data;
  },

  createRevenue: async (token, revenueData) => {
    const response = await fetch(`${API_BASE}/accounting/revenues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(revenueData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create revenue');
    }
    return data;
  },

  updateRevenue: async (token, id, revenueData) => {
    const response = await fetch(`${API_BASE}/accounting/revenues/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(revenueData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update revenue');
    }
    return data;
  },

  deleteRevenue: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/revenues/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete revenue');
    }
    return data;
  },

  getRevenueById: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/revenues/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenue');
    }
    return data;
  },

  approveRevenue: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/revenues/${id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve revenue');
    }
    return data;
  },

  getExpenses: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/expenses${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch expenses');
    }
    return data;
  },

  createExpense: async (token, expenseData) => {
    const response = await fetch(`${API_BASE}/accounting/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create expense');
    }
    return data;
  },

  updateExpense: async (token, id, expenseData) => {
    const response = await fetch(`${API_BASE}/accounting/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update expense');
    }
    return data;
  },

  deleteExpense: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete expense');
    }
    return data;
  },

  getExpenseById: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/expenses/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch expense');
    }
    return data;
  },

  approveExpense: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/expenses/${id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve expense');
    }
    return data;
  },

  // Equity Grant routes
  getEquityGrants: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/equity-grants${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch equity grants');
    }
    return data;
  },

  createEquityGrant: async (token, equityData) => {
    const response = await fetch(`${API_BASE}/accounting/equity-grants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equityData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create equity grant');
    }
    return data;
  },

  updateEquityGrant: async (token, id, equityData) => {
    const response = await fetch(`${API_BASE}/accounting/equity-grants/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equityData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update equity grant');
    }
    return data;
  },

  deleteEquityGrant: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/equity-grants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete equity grant');
    }
    return data;
  },

  getEquityGrantById: async (token, id) => {
    const response = await fetch(`${API_BASE}/accounting/equity-grants/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch equity grant');
    }
    return data;
  },

  completeEquityMilestone: async (token, id, body = {}) => {
    const response = await fetch(`${API_BASE}/accounting/equity-grants/${id}/complete-milestone`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete equity milestone');
    }
    return data;
  },

  // Analytics routes
  getDashboardStats: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/dashboard-stats${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }
    return data;
  },

  getRecentActivity: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/recent-activity${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recent activity');
    }
    return data;
  },

  getPlacementAnalytics: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/analytics/placements${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch placement analytics');
    }
    return data;
  },

  // Reports routes
  getReports: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/reports${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reports');
    }
    return data;
  },

  exportReport: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/accounting/reports/export${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to export report');
    }
    return data;
  },

  // Currency routes - FIXED (kept as per original, assuming controller matches)
  getExchangeRates: async (token) => {
    const url = `${API_BASE}/accounting/exchange-rates`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch exchange rates');
    }
    return data;
  },

  getExchangeRate: async (token, from, to) => {
    const url = `${API_BASE}/accounting/exchange-rate/${from}/${to}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch exchange rate');
    }
    return data;
  },

  convertCurrency: async (token, amount, from, to) => {
    const url = `${API_BASE}/accounting/convert?amount=${amount}&from=${from}&to=${to}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to convert currency');
    }
    return data;
  },
  
};

// Utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Toast notification helper
export const showToast = (message, type = 'info') => {
  console.log(`${type.toUpperCase()}: ${message}`);
  
  if (Notification.permission === 'granted') {
    new Notification(`Junior Forge Admin - ${type.toUpperCase()}`, {
      body: message,
      icon: '/favicon.ico'
    });
  }
};

// Error handling helper
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    localStorage.removeItem('adminToken');
    window.location.reload();
    return 'Session expired. Please login again.';
  }
  
  if (error.message.includes('403') || error.message.includes('Forbidden')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'Resource not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Helper function to create FormData for talent submission
export const createTalentFormData = (talentData, files = {}) => {
  const formData = new FormData();
  
  // Add basic fields
  Object.keys(talentData).forEach(key => {
    const value = talentData[key];
    
    // Skip file fields and null/undefined values
    if (value === null || value === undefined) return;
    
    // Convert objects and arrays to JSON strings
    if (typeof value === 'object' && !Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  // Add files
  if (files.profilePhoto) {
    formData.append('profilePhoto', files.profilePhoto);
  }
  if (files.cvFile) {
    formData.append('cvFile', files.cvFile);
  }
  if (files.coverLetterFile) {
    formData.append('coverLetterFile', files.coverLetterFile);
  }
  
  return formData;
};