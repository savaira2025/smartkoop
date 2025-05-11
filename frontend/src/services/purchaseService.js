import api from './api';

const purchaseService = {
  /**
   * Get all purchase orders with optional filtering
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip
   * @param {number} params.limit - Number of records to return
   * @param {string} params.status - Filter by status
   * @param {string} params.search - Search term
   * @returns {Promise} - Promise with purchase orders data
   */
  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/purchases/orders', { params });
    return response.data;
  },

  /**
   * Get a purchase order by ID
   * @param {number} id - Purchase order ID
   * @returns {Promise} - Promise with purchase order data
   */
  getPurchaseOrder: async (id) => {
    const response = await api.get(`/purchases/orders/${id}`);
    return response.data;
  },

  /**
   * Create a new purchase order
   * @param {Object} purchaseOrderData - Purchase order data
   * @returns {Promise} - Promise with created purchase order data
   */
  createPurchaseOrder: async (purchaseOrderData) => {
    const response = await api.post('/purchases/orders', purchaseOrderData);
    return response.data;
  },

  /**
   * Update a purchase order
   * @param {number} id - Purchase order ID
   * @param {Object} purchaseOrderData - Purchase order data to update
   * @returns {Promise} - Promise with updated purchase order data
   */
  updatePurchaseOrder: async (id, purchaseOrderData) => {
    const response = await api.put(`/purchases/orders/${id}`, purchaseOrderData);
    return response.data;
  },

  /**
   * Delete a purchase order
   * @param {number} id - Purchase order ID
   * @returns {Promise} - Promise with deletion result
   */
  deletePurchaseOrder: async (id) => {
    const response = await api.delete(`/purchases/orders/${id}`);
    return response.data;
  },

  /**
   * Get purchase order items for a purchase order
   * @param {number} orderId - Purchase order ID
   * @returns {Promise} - Promise with purchase order items data
   */
  getPurchaseOrderItems: async (orderId) => {
    const response = await api.get(`/purchases/orders/${orderId}/items`);
    return response.data;
  },

  /**
   * Add an item to a purchase order
   * @param {number} orderId - Purchase order ID
   * @param {Object} itemData - Item data
   * @returns {Promise} - Promise with created item data
   */
  addPurchaseOrderItem: async (orderId, itemData) => {
    const response = await api.post(`/purchases/orders/${orderId}/items`, itemData);
    return response.data;
  },

  /**
   * Update a purchase order item
   * @param {number} orderId - Purchase order ID
   * @param {number} itemId - Item ID
   * @param {Object} itemData - Item data to update
   * @returns {Promise} - Promise with updated item data
   */
  updatePurchaseOrderItem: async (orderId, itemId, itemData) => {
    const response = await api.put(`/purchases/orders/${orderId}/items/${itemId}`, itemData);
    return response.data;
  },

  /**
   * Delete a purchase order item
   * @param {number} orderId - Purchase order ID
   * @param {number} itemId - Item ID
   * @returns {Promise} - Promise with deletion result
   */
  deletePurchaseOrderItem: async (orderId, itemId) => {
    const response = await api.delete(`/purchases/orders/${orderId}/items/${itemId}`);
    return response.data;
  },

  /**
   * Get supplier invoices for a purchase order
   * @param {number} orderId - Purchase order ID
   * @returns {Promise} - Promise with supplier invoices data
   */
  getSupplierInvoices: async (orderId) => {
    const response = await api.get(`/purchases/orders/${orderId}/invoices`);
    return response.data;
  },

  /**
   * Add a supplier invoice to a purchase order
   * @param {number} orderId - Purchase order ID
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise} - Promise with created invoice data
   */
  addSupplierInvoice: async (orderId, invoiceData) => {
    const response = await api.post(`/purchases/orders/${orderId}/invoices`, invoiceData);
    return response.data;
  },

  /**
   * Update a supplier invoice
   * @param {number} orderId - Purchase order ID
   * @param {number} invoiceId - Invoice ID
   * @param {Object} invoiceData - Invoice data to update
   * @returns {Promise} - Promise with updated invoice data
   */
  updateSupplierInvoice: async (orderId, invoiceId, invoiceData) => {
    const response = await api.put(`/purchases/orders/${orderId}/invoices/${invoiceId}`, invoiceData);
    return response.data;
  },

  /**
   * Delete a supplier invoice
   * @param {number} orderId - Purchase order ID
   * @param {number} invoiceId - Invoice ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSupplierInvoice: async (orderId, invoiceId) => {
    const response = await api.delete(`/purchases/orders/${orderId}/invoices/${invoiceId}`);
    return response.data;
  },

  /**
   * Get supplier payments for an invoice
   * @param {number} invoiceId - Invoice ID
   * @returns {Promise} - Promise with supplier payments data
   */
  getSupplierPayments: async (invoiceId) => {
    const response = await api.get(`/purchases/invoices/${invoiceId}/payments`);
    return response.data;
  },

  /**
   * Add a supplier payment to an invoice
   * @param {number} invoiceId - Invoice ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise} - Promise with created payment data
   */
  addSupplierPayment: async (invoiceId, paymentData) => {
    const response = await api.post(`/purchases/invoices/${invoiceId}/payments`, paymentData);
    return response.data;
  },

  /**
   * Update a supplier payment
   * @param {number} invoiceId - Invoice ID
   * @param {number} paymentId - Payment ID
   * @param {Object} paymentData - Payment data to update
   * @returns {Promise} - Promise with updated payment data
   */
  updateSupplierPayment: async (invoiceId, paymentId, paymentData) => {
    const response = await api.put(`/purchases/invoices/${invoiceId}/payments/${paymentId}`, paymentData);
    return response.data;
  },

  /**
   * Delete a supplier payment
   * @param {number} invoiceId - Invoice ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteSupplierPayment: async (invoiceId, paymentId) => {
    const response = await api.delete(`/purchases/invoices/${invoiceId}/payments/${paymentId}`);
    return response.data;
  }
};

export default purchaseService;
