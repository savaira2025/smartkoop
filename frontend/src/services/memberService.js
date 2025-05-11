import api from './api';

const memberService = {
  /**
   * Get all members with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with members data
   */
  getMembers: async (params = {}) => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  /**
   * Get a member by ID
   * @param {number} id - Member ID
   * @returns {Promise} - Promise with member data
   */
  getMember: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  /**
   * Create a new member
   * @param {Object} memberData - Member data
   * @returns {Promise} - Promise with created member data
   */
  createMember: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  /**
   * Update a member
   * @param {number} id - Member ID
   * @param {Object} memberData - Member data to update
   * @returns {Promise} - Promise with updated member data
   */
  updateMember: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },

  /**
   * Delete a member
   * @param {number} id - Member ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteMember: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  /**
   * Get member savings transactions
   * @param {number} memberId - Member ID
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.transaction_type - Filter by transaction type
   * @returns {Promise} - Promise with transactions data
   */
  getMemberSavingsTransactions: async (memberId, params = {}) => {
    const response = await api.get(`/members/${memberId}/savings`, { params });
    return response.data;
  },

  /**
   * Create a savings transaction for a member
   * @param {number} memberId - Member ID
   * @param {Object} transactionData - Transaction data
   * @returns {Promise} - Promise with created transaction data
   */
  createSavingsTransaction: async (memberId, transactionData) => {
    const response = await api.post(`/members/${memberId}/savings`, transactionData);
    return response.data;
  },

  /**
   * Get member SHU distributions
   * @param {number} memberId - Member ID
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {number} params.fiscal_year - Filter by fiscal year
   * @returns {Promise} - Promise with distributions data
   */
  getMemberSHUDistributions: async (memberId, params = {}) => {
    const response = await api.get(`/members/${memberId}/shu`, { params });
    return response.data;
  },

  /**
   * Create a SHU distribution for a member
   * @param {number} memberId - Member ID
   * @param {Object} distributionData - Distribution data
   * @returns {Promise} - Promise with created distribution data
   */
  createSHUDistribution: async (memberId, distributionData) => {
    const response = await api.post(`/members/${memberId}/shu`, distributionData);
    return response.data;
  }
};

export default memberService;
