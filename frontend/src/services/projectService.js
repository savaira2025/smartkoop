import api from './api';

/**
 * Project Service
 * 
 * This service handles all API calls related to projects and project invoices.
 */
const projectService = {
  /**
   * Project methods
   */
  getProjects: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/projects?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...projectData,
        customer_id: Number(projectData.customer_id),
        budget_amount: Number(projectData.budget_amount)
      };
      
      const response = await api.post('/projects', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...projectData,
        customer_id: projectData.customer_id ? Number(projectData.customer_id) : undefined,
        budget_amount: projectData.budget_amount !== undefined ? Number(projectData.budget_amount) : undefined
      };
      
      const response = await api.put(`/projects/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Project Task methods
   */
  getProjectTasks: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for project with ID ${projectId}:`, error);
      throw error;
    }
  },

  getProjectTask: async (taskId) => {
    try {
      const response = await api.get(`/projects/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  },

  createProjectTask: async (projectId, taskData) => {
    try {
      // Ensure project_id is a number and matches the path parameter
      const projectIdNum = Number(projectId);
      
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...taskData,
        project_id: projectIdNum,
        estimated_hours: Number(taskData.estimated_hours),
        actual_hours: Number(taskData.actual_hours),
        hourly_rate: Number(taskData.hourly_rate)
      };
      
      const response = await api.post(`/projects/${projectIdNum}/tasks`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error creating task for project with ID ${projectId}:`, error);
      throw error;
    }
  },

  updateProjectTask: async (taskId, taskData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...taskData,
        project_id: taskData.project_id ? Number(taskData.project_id) : undefined,
        estimated_hours: taskData.estimated_hours !== undefined ? Number(taskData.estimated_hours) : undefined,
        actual_hours: taskData.actual_hours !== undefined ? Number(taskData.actual_hours) : undefined,
        hourly_rate: taskData.hourly_rate !== undefined ? Number(taskData.hourly_rate) : undefined
      };
      
      const response = await api.put(`/projects/tasks/${taskId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${taskId}:`, error);
      throw error;
    }
  },

  deleteProjectTask: async (taskId) => {
    try {
      const response = await api.delete(`/projects/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Time Entry methods
   */
  getTimeEntries: async (taskId) => {
    try {
      const response = await api.get(`/projects/tasks/${taskId}/time-entries`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time entries for task with ID ${taskId}:`, error);
      throw error;
    }
  },

  getTimeEntry: async (entryId) => {
    try {
      const response = await api.get(`/projects/time-entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time entry with ID ${entryId}:`, error);
      throw error;
    }
  },

  createTimeEntry: async (taskId, entryData) => {
    try {
      // Ensure task_id is a number and matches the path parameter
      const taskIdNum = Number(taskId);
      
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...entryData,
        task_id: taskIdNum,
        member_id: Number(entryData.member_id),
        hours: Number(entryData.hours)
      };
      
      const response = await api.post(`/projects/tasks/${taskIdNum}/time-entries`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error creating time entry for task with ID ${taskId}:`, error);
      throw error;
    }
  },

  updateTimeEntry: async (entryId, entryData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...entryData,
        task_id: entryData.task_id ? Number(entryData.task_id) : undefined,
        member_id: entryData.member_id ? Number(entryData.member_id) : undefined,
        hours: entryData.hours !== undefined ? Number(entryData.hours) : undefined
      };
      
      const response = await api.put(`/projects/time-entries/${entryId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating time entry with ID ${entryId}:`, error);
      throw error;
    }
  },

  deleteTimeEntry: async (entryId) => {
    try {
      const response = await api.delete(`/projects/time-entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting time entry with ID ${entryId}:`, error);
      throw error;
    }
  },

  /**
   * Project Invoice methods
   */
  getProjectInvoices: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/invoices`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for project with ID ${projectId}:`, error);
      throw error;
    }
  },

  getAllInvoices: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/projects/invoices/all?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all project invoices:', error);
      throw error;
    }
  },

  getProjectInvoice: async (invoiceId) => {
    try {
      const response = await api.get(`/projects/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  createProjectInvoice: async (projectId, invoiceData) => {
    try {
      // Ensure project_id is a number and matches the path parameter
      const projectIdNum = Number(projectId);
      
      // Ensure all numeric values are properly formatted as numbers
      // Don't override project_id if it's already in invoiceData to avoid duplication
      const formattedData = {
        ...invoiceData,
        subtotal: Number(invoiceData.subtotal),
        tax_amount: Number(invoiceData.tax_amount),
        total_amount: Number(invoiceData.total_amount)
      };
      
      const response = await api.post(`/projects/${projectIdNum}/invoices`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error creating invoice for project with ID ${projectId}:`, error);
      throw error;
    }
  },

  updateProjectInvoice: async (invoiceId, invoiceData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...invoiceData,
        project_id: invoiceData.project_id ? Number(invoiceData.project_id) : undefined,
        subtotal: invoiceData.subtotal !== undefined ? Number(invoiceData.subtotal) : undefined,
        tax_amount: invoiceData.tax_amount !== undefined ? Number(invoiceData.tax_amount) : undefined,
        total_amount: invoiceData.total_amount !== undefined ? Number(invoiceData.total_amount) : undefined
      };
      
      const response = await api.put(`/projects/invoices/${invoiceId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  deleteProjectInvoice: async (invoiceId) => {
    try {
      const response = await api.delete(`/projects/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  /**
   * Invoice Item methods
   */
  getInvoiceItems: async (invoiceId) => {
    try {
      const response = await api.get(`/projects/invoices/${invoiceId}/items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  getInvoiceItem: async (itemId) => {
    try {
      const response = await api.get(`/projects/invoice-items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice item with ID ${itemId}:`, error);
      throw error;
    }
  },

  createInvoiceItem: async (invoiceId, itemData) => {
    try {
      // Ensure invoice_id is a number and matches the path parameter
      const invoiceIdNum = Number(invoiceId);
      
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...itemData,
        invoice_id: invoiceIdNum,
        quantity: Number(itemData.quantity),
        unit_price: Number(itemData.unit_price),
        subtotal: Number(itemData.subtotal),
        tax_rate: Number(itemData.tax_rate),
        task_id: itemData.task_id ? Number(itemData.task_id) : null
      };
      
      const response = await api.post(`/projects/invoices/${invoiceIdNum}/items`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error creating item for invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  updateInvoiceItem: async (itemId, itemData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...itemData,
        invoice_id: itemData.invoice_id ? Number(itemData.invoice_id) : undefined,
        quantity: itemData.quantity !== undefined ? Number(itemData.quantity) : undefined,
        unit_price: itemData.unit_price !== undefined ? Number(itemData.unit_price) : undefined,
        subtotal: itemData.subtotal !== undefined ? Number(itemData.subtotal) : undefined,
        tax_rate: itemData.tax_rate !== undefined ? Number(itemData.tax_rate) : undefined,
        task_id: itemData.task_id ? Number(itemData.task_id) : null
      };
      
      const response = await api.put(`/projects/invoice-items/${itemId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice item with ID ${itemId}:`, error);
      throw error;
    }
  },

  deleteInvoiceItem: async (itemId) => {
    try {
      const response = await api.delete(`/projects/invoice-items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice item with ID ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Payment methods
   */
  getInvoicePayments: async (invoiceId) => {
    try {
      const response = await api.get(`/projects/invoices/${invoiceId}/payments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  getPayment: async (paymentId) => {
    try {
      const response = await api.get(`/projects/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment with ID ${paymentId}:`, error);
      throw error;
    }
  },

  createPayment: async (invoiceId, paymentData) => {
    try {
      // Ensure invoice_id is a number and matches the path parameter
      const invoiceIdNum = Number(invoiceId);
      
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...paymentData,
        invoice_id: invoiceIdNum,
        amount: Number(paymentData.amount)
      };
      
      const response = await api.post(`/projects/invoices/${invoiceIdNum}/payments`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error creating payment for invoice with ID ${invoiceId}:`, error);
      throw error;
    }
  },

  updatePayment: async (paymentId, paymentData) => {
    try {
      // Ensure all numeric values are properly formatted as numbers
      const formattedData = {
        ...paymentData,
        invoice_id: paymentData.invoice_id ? Number(paymentData.invoice_id) : undefined,
        amount: paymentData.amount !== undefined ? Number(paymentData.amount) : undefined
      };
      
      const response = await api.put(`/projects/payments/${paymentId}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating payment with ID ${paymentId}:`, error);
      throw error;
    }
  },

  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`/projects/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment with ID ${paymentId}:`, error);
      throw error;
    }
  }
};

export default projectService;
