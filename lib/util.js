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

  getSubmissionsByType: async (token, type) => {
    const response = await fetch(`${API_BASE}/admin/submissions/${type}`, {
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