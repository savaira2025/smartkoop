import api from './api';

const salesService = {
  /**
   * Get all sales orders with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with sales orders data
   */
  getSalesOrders: async (params = {}) => {
    const response = await api.get('/sales/orders', { params });
    return response.data;
  },

  /**
   * Get a sales order by ID
   * @param {number} id - Sales order ID
   * @returns {Promise} - Promise with sales order data
   */
  getSalesOrder: async (id) => {
    const response = await api.get(`/sales/orders/${id}`);
    return response.data;
  },

  /**
   * Create a new sales order
   * @param {Object} orderData - Sales order data
   * @returns {Promise} - Promise with created sales order data
   */
  createSalesOrder: async (orderData) => {
    const response = await api.post('/sales/orders', orderData);
    return response.data;
  },

  /**
   * Update a sales order
   * @param {number} id - Sales order ID
   * @param {Object} orderData - Sales order data to update
   * @returns {Promise} - Promise with updated sales order data
   */
  updateSalesOrder: async (id, orderData) => {
    const response = await api.put(`/sales/orders/${id}`, orderData);
    return response.data;
  },

  /**
   * Delete a sales order
   * @param {number} id - Sales order ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSalesOrder: async (id) => {
    const response = await api.delete(`/sales/orders/${id}`);
    return response.data;
  },

  /**
   * Get all sales invoices with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with sales invoices data
   */
  getSalesInvoices: async (params = {}) => {
    const response = await api.get('/sales/invoices', { params });
    return response.data;
  },

  /**
   * Get a sales invoice by ID
   * @param {number} id - Sales invoice ID
   * @returns {Promise} - Promise with sales invoice data
   */
  getSalesInvoice: async (id) => {
    const response = await api.get(`/sales/invoices/${id}`);
    return response.data;
  },

  /**
   * Create a new sales invoice
   * @param {Object} invoiceData - Sales invoice data
   * @returns {Promise} - Promise with created sales invoice data
   */
  createSalesInvoice: async (invoiceData) => {
    const response = await api.post('/sales/invoices', invoiceData);
    return response.data;
  },

  /**
   * Update a sales invoice
   * @param {number} id - Sales invoice ID
   * @param {Object} invoiceData - Sales invoice data to update
   * @returns {Promise} - Promise with updated sales invoice data
   */
  updateSalesInvoice: async (id, invoiceData) => {
    const response = await api.put(`/sales/invoices/${id}`, invoiceData);
    return response.data;
  },

  /**
   * Delete a sales invoice
   * @param {number} id - Sales invoice ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSalesInvoice: async (id) => {
    const response = await api.delete(`/sales/invoices/${id}`);
    return response.data;
  }
};

export default salesService;
