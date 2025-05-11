import api from './api';

/**
 * Accounting Service
 * 
 * This service handles all API calls related to accounting.
 */
const accountingService = {
  /**
   * Chart of Accounts methods
   */
  getChartOfAccounts: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/accounting/chart-of-accounts?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chart of accounts:', error);
      throw error;
    }
  },

  getAccount: async (id) => {
    try {
      const response = await api.get(`/accounting/chart-of-accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with ID ${id}:`, error);
      throw error;
    }
  },

  createAccount: async (accountData) => {
    try {
      const response = await api.post('/accounting/chart-of-accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  updateAccount: async (id, accountData) => {
    try {
      const response = await api.put(`/accounting/chart-of-accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating account with ID ${id}:`, error);
      throw error;
    }
  },

  deleteAccount: async (id) => {
    try {
      const response = await api.delete(`/accounting/chart-of-accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting account with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Journal Entry methods
   */
  getJournalEntries: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/accounting/journal-entries?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  getJournalEntry: async (id) => {
    try {
      const response = await api.get(`/accounting/journal-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching journal entry with ID ${id}:`, error);
      throw error;
    }
  },

  createJournalEntry: async (entryData) => {
    try {
      const response = await api.post('/accounting/journal-entries', entryData);
      return response.data;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  },

  updateJournalEntry: async (id, entryData) => {
    try {
      const response = await api.put(`/accounting/journal-entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating journal entry with ID ${id}:`, error);
      throw error;
    }
  },

  deleteJournalEntry: async (id) => {
    try {
      const response = await api.delete(`/accounting/journal-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting journal entry with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Ledger Entry methods
   */
  getLedgerEntries: async (journalEntryId) => {
    try {
      const response = await api.get(`/accounting/journal-entries/${journalEntryId}/ledger-entries`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entries for journal entry with ID ${journalEntryId}:`, error);
      throw error;
    }
  },

  getLedgerEntry: async (id) => {
    try {
      const response = await api.get(`/accounting/ledger-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ledger entry with ID ${id}:`, error);
      throw error;
    }
  },

  createLedgerEntry: async (journalEntryId, entryData) => {
    try {
      const response = await api.post(`/accounting/journal-entries/${journalEntryId}/ledger-entries`, {
        ...entryData,
        journal_entry_id: journalEntryId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating ledger entry for journal entry with ID ${journalEntryId}:`, error);
      throw error;
    }
  },

  updateLedgerEntry: async (id, entryData) => {
    try {
      const response = await api.put(`/accounting/ledger-entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ledger entry with ID ${id}:`, error);
      throw error;
    }
  },

  deleteLedgerEntry: async (id) => {
    try {
      const response = await api.delete(`/accounting/ledger-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ledger entry with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fiscal Period methods
   */
  getFiscalPeriods: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/accounting/fiscal-periods?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fiscal periods:', error);
      throw error;
    }
  },

  getFiscalPeriod: async (id) => {
    try {
      const response = await api.get(`/accounting/fiscal-periods/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fiscal period with ID ${id}:`, error);
      throw error;
    }
  },

  createFiscalPeriod: async (periodData) => {
    try {
      const response = await api.post('/accounting/fiscal-periods', periodData);
      return response.data;
    } catch (error) {
      console.error('Error creating fiscal period:', error);
      throw error;
    }
  },

  updateFiscalPeriod: async (id, periodData) => {
    try {
      const response = await api.put(`/accounting/fiscal-periods/${id}`, periodData);
      return response.data;
    } catch (error) {
      console.error(`Error updating fiscal period with ID ${id}:`, error);
      throw error;
    }
  },

  deleteFiscalPeriod: async (id) => {
    try {
      const response = await api.delete(`/accounting/fiscal-periods/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting fiscal period with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Payroll methods
   */
  getPayrolls: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/accounting/payrolls?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  },

  getPayroll: async (id) => {
    try {
      const response = await api.get(`/accounting/payrolls/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll with ID ${id}:`, error);
      throw error;
    }
  },

  createPayroll: async (payrollData) => {
    try {
      const response = await api.post('/accounting/payrolls', payrollData);
      return response.data;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  },

  updatePayroll: async (id, payrollData) => {
    try {
      const response = await api.put(`/accounting/payrolls/${id}`, payrollData);
      return response.data;
    } catch (error) {
      console.error(`Error updating payroll with ID ${id}:`, error);
      throw error;
    }
  },

  deletePayroll: async (id) => {
    try {
      const response = await api.delete(`/accounting/payrolls/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payroll with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Payroll Item methods
   */
  getPayrollItems: async (payrollId) => {
    try {
      const response = await api.get(`/accounting/payrolls/${payrollId}/items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll items for payroll with ID ${payrollId}:`, error);
      throw error;
    }
  },

  getPayrollItem: async (id) => {
    try {
      const response = await api.get(`/accounting/payroll-items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payroll item with ID ${id}:`, error);
      throw error;
    }
  },

  createPayrollItem: async (payrollId, itemData) => {
    try {
      const response = await api.post(`/accounting/payrolls/${payrollId}/items`, {
        ...itemData,
        payroll_id: payrollId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating payroll item for payroll with ID ${payrollId}:`, error);
      throw error;
    }
  },

  updatePayrollItem: async (id, itemData) => {
    try {
      const response = await api.put(`/accounting/payroll-items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Error updating payroll item with ID ${id}:`, error);
      throw error;
    }
  },

  deletePayrollItem: async (id) => {
    try {
      const response = await api.delete(`/accounting/payroll-items/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payroll item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Employee methods
   */
  getEmployees: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/accounting/employees?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getEmployee: async (id) => {
    try {
      const response = await api.get(`/accounting/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/accounting/employees', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/accounting/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/accounting/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }
};

export default accountingService;
