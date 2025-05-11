import api from './api';

const supplierService = {
  /**
   * Get all suppliers with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with suppliers data
   */
  getSuppliers: async (params = {}) => {
    const response = await api.get('/suppliers', { params });
    return response.data;
  },

  /**
   * Get a supplier by ID
   * @param {number} id - Supplier ID
   * @returns {Promise} - Promise with supplier data
   */
  getSupplier: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  /**
   * Create a new supplier
   * @param {Object} supplierData - Supplier data
   * @returns {Promise} - Promise with created supplier data
   */
  createSupplier: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  /**
   * Update a supplier
   * @param {number} id - Supplier ID
   * @param {Object} supplierData - Supplier data to update
   * @returns {Promise} - Promise with updated supplier data
   */
  updateSupplier: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  /**
   * Delete a supplier
   * @param {number} id - Supplier ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSupplier: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  }
};

export default supplierService;
