/**
 * API service layer for backend communication
 * @module services/api
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' && !process.env.EXPO_PUBLIC_API_URL;

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Make HTTP request to API with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @param {number} retries - Number of retries (default: 3)
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(endpoint, options = {}, retries = 3) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      // Try real API first with reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Retry on network errors (but not on 4xx errors)
      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('network'))) {
        console.log(`Retrying request to ${endpoint}, ${retries} retries left`);
        await this.delay(1000); // Wait 1 second before retry
        return this.makeRequest(endpoint, options, retries - 1);
      }

      console.log('API unavailable, using mock data for:', endpoint);

      // Return mock data based on endpoint
      if (USE_MOCK_DATA) {
        return this.getMockResponse(endpoint, options);
      }

      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get mock response for development
   */
  getMockResponse(endpoint, options) {
    if (endpoint.includes('/search/all')) {
      return this.getMockSearchAllResponse();
    }
    if (endpoint.includes('/gmail/scan')) {
      return this.getMockGmailScanResponse();
    }
    return { success: true, message: 'Mock response' };
  }

  getMockSearchAllResponse() {
    return {
      success: true,
      results: {
        classActions: [
          {
            id: 'facebook-privacy-2024',
            company: 'Meta (Facebook)',
            title: 'Facebook Privacy Settlement',
            estimatedPayout: '$30-$200',
            description: 'Settlement for Facebook users between 2007-2022',
            deadline: '2024-12-31',
            matchScore: 85
          },
          {
            id: 'zoom-privacy-2024',
            company: 'Zoom',
            title: 'Zoom Privacy Settlement',
            estimatedPayout: '$15-$25',
            description: 'Settlement for Zoom users regarding privacy',
            deadline: '2024-11-30',
            matchScore: 75
          }
        ],
        unclaimedProperty: [
          {
            state: 'CA',
            amount: '$127.43',
            type: 'Bank Account',
            reportedBy: 'Wells Fargo'
          }
        ],
        emailOpportunities: [],
        totalFound: 3,
        estimatedValue: 327.43
      },
      message: 'Found 3 opportunities worth approximately $327.43'
    };
  }

  getMockGmailScanResponse() {
    return {
      success: true,
      emailsScanned: 150,
      opportunitiesFound: 2,
      opportunities: [
        {
          company: 'Amazon',
          amount: '$23.00',
          description: 'Price adjustment refund available',
          type: 'refund'
        },
        {
          company: 'Target',
          amount: '$15.00',
          description: 'Class action settlement - Target data breach',
          type: 'settlement'
        }
      ],
      message: 'Found 2 opportunities in your emails'
    };
  }

  // Gmail integration
  async getGmailAuthUrl() {
    return this.makeRequest('/api/gmail/connect', {
      method: 'POST',
    });
  }

  async scanGmail(userId) {
    return this.makeRequest('/api/gmail/scan', {
      method: 'POST',
      body: JSON.stringify({ userId }),
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