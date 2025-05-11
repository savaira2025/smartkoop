import api from './api';

const customerService = {
  /**
   * Get all customers with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with customers data
   */
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  /**
   * Get a customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise} - Promise with customer data
   */
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} - Promise with created customer data
   */
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  /**
   * Update a customer
   * @param {number} id - Customer ID
   * @param {Object} customerData - Customer data to update
   * @returns {Promise} - Promise with updated customer data
   */
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  /**
   * Delete a customer
   * @param {number} id - Customer ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  }
};

export default customerService;
