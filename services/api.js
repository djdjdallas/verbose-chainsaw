/**
 * API service layer for backend communication
 * @module services/api
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Make HTTP request to API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Gmail integration
  async connectGmail(authCode) {
    return this.makeRequest('/api/gmail/connect', {
      method: 'POST',
      body: JSON.stringify({ code: authCode }),
    });
  }

  async scanGmail(userId, accessToken) {
    return this.makeRequest('/api/gmail/scan', {
      method: 'POST',
      body: JSON.stringify({ userId, accessToken }),
    });
  }

  // Search services
  async searchClassActions(userData) {
    return this.makeRequest('/api/search/class-actions', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async searchUnclaimedProperty(userData) {
    return this.makeRequest('/api/search/unclaimed-property', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async searchAll(userId) {
    return this.makeRequest('/api/search/all', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Form services
  async autoFillForm(formId, userData) {
    return this.makeRequest('/api/forms/auto-fill', {
      method: 'POST',
      body: JSON.stringify({ formId, userData }),
    });
  }

  async generatePDF(formData) {
    return this.makeRequest('/api/forms/generate-pdf', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Analytics
  async trackEvent(eventName, properties) {
    return this.makeRequest('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventName, properties }),
    });
  }
}

export default new ApiService();