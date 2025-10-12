// lib/util.js
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