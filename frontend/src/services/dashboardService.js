import api from './api';
import memberService from './memberService';
import salesService from './salesService';
import purchaseService from './purchaseService';

const dashboardService = {
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise} - Promise with all dashboard data
   */
  getDashboardData: async () => {
    try {
      // Fetch all data in parallel for better performance
      const [
        memberStats,
        financialStats,
        salesStats,
        purchaseStats,
        recentActivities,
        systemAlerts
      ] = await Promise.all([
        dashboardService.getMemberStats(),
        dashboardService.getFinancialStats(),
        dashboardService.getSalesStats(),
        dashboardService.getPurchaseStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getSystemAlerts()
      ]);

      return {
        memberStats,
        financialStats,
        salesStats,
        purchaseStats,
        recentActivities,
        systemAlerts,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  /**
   * Get member statistics
   * @returns {Promise} - Promise with member statistics
   */
  getMemberStats: async () => {
    try {
      // Get all members to calculate statistics
      const members = await memberService.getMembers({ limit: 1000 });
      
      const total = members.length;
      const active = members.filter(member => member.status === 'active').length;
      const inactive = total - active;
      
      // Calculate new members this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newThisMonth = members.filter(member => {
        const createdDate = new Date(member.created_at);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length;

      return {
        total,
        active,
        inactive,
        newThisMonth
      };
    } catch (error) {
      console.error('Error fetching member stats:', error);
      // Return fallback data
      return {
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0
      };
    }
  },

  /**
   * Get financial statistics by aggregating member savings
   * @returns {Promise} - Promise with financial statistics
   */
  getFinancialStats: async () => {
    try {
      const members = await memberService.getMembers({ limit: 1000 });
      
      let totalSavings = 0;
      let principalSavings = 0;
      let mandatorySavings = 0;
      let voluntarySavings = 0;
      let unpaidMandatory = 0;
      let shuDistributed = 0;

      // Aggregate savings data from all members
      for (const member of members) {
        try {
          // Get member's savings transactions
          const savings = await memberService.getMemberSavingsTransactions(member.id, { limit: 1000 });
          
          // Calculate totals by transaction type
          savings.forEach(transaction => {
            const amount = parseFloat(transaction.amount) || 0;
            
            switch (transaction.transaction_type) {
              case 'principal':
                if (transaction.type === 'credit') {
                  principalSavings += amount;
                } else {
                  principalSavings -= amount;
                }
                break;
              case 'mandatory':
                if (transaction.type === 'credit') {
                  mandatorySavings += amount;
                } else {
                  mandatorySavings -= amount;
                }
                break;
              case 'voluntary':
                if (transaction.type === 'credit') {
                  voluntarySavings += amount;
                } else {
                  voluntarySavings -= amount;
                }
                break;
            }
          });

          // Get SHU distributions
          const shuDistributions = await memberService.getMemberSHUDistributions(member.id, { limit: 1000 });
          shuDistributions.forEach(distribution => {
            shuDistributed += parseFloat(distribution.amount) || 0;
          });
        } catch (memberError) {
          console.warn(`Error fetching data for member ${member.id}:`, memberError);
        }
      }

      totalSavings = principalSavings + mandatorySavings + voluntarySavings;

      // Calculate unpaid mandatory (this would need business logic)
      // For now, we'll estimate based on active members
      unpaidMandatory = members.filter(m => m.status === 'active').length * 50000; // Estimated monthly mandatory

      return {
        totalSavings,
        principalSavings,
        mandatorySavings,
        voluntarySavings,
        unpaidMandatory,
        shuDistributed
      };
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      return {
        totalSavings: 0,
        principalSavings: 0,
        mandatorySavings: 0,
        voluntarySavings: 0,
        unpaidMandatory: 0,
        shuDistributed: 0
      };
    }
  },

  /**
   * Get sales statistics
   * @returns {Promise} - Promise with sales statistics
   */
  getSalesStats: async () => {
    try {
      const [orders, invoices] = await Promise.all([
        salesService.getSalesOrders({ limit: 1000 }),
        salesService.getSalesInvoices({ limit: 1000 })
      ]);

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      
      const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
      const outstandingInvoices = invoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0);

      return {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSales,
        outstandingInvoices
      };
    } catch (error) {
      console.error('Error fetching sales stats:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSales: 0,
        outstandingInvoices: 0
      };
    }
  },

  /**
   * Get purchase statistics
   * @returns {Promise} - Promise with purchase statistics
   */
  getPurchaseStats: async () => {
    try {
      const orders = await purchaseService.getPurchaseOrders({ limit: 1000 });

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      
      const totalPurchases = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
      
      // Get outstanding supplier invoices
      let outstandingInvoices = 0;
      try {
        const response = await api.get('/purchases/invoices', { params: { status: 'pending', limit: 1000 } });
        outstandingInvoices = response.data.reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0);
      } catch (invoiceError) {
        console.warn('Error fetching supplier invoices:', invoiceError);
      }

      return {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalPurchases,
        outstandingInvoices
      };
    } catch (error) {
      console.error('Error fetching purchase stats:', error);
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalPurchases: 0,
        outstandingInvoices: 0
      };
    }
  },

  /**
   * Get recent activities across all modules
   * @returns {Promise} - Promise with recent activities
   */
  getRecentActivities: async () => {
    try {
      const activities = [];

      // Get recent members (last 10)
      const recentMembers = await memberService.getMembers({ limit: 10 });
      recentMembers.slice(0, 3).forEach(member => {
        activities.push({
          type: 'member',
          icon: 'PeopleIcon',
          title: 'New member registered',
          description: `${member.full_name} - ${dashboardService.getTimeAgo(member.created_at)}`,
          timestamp: member.created_at
        });
      });

      // Get recent sales orders (last 10)
      const recentSalesOrders = await salesService.getSalesOrders({ limit: 10 });
      recentSalesOrders.slice(0, 2).forEach(order => {
        activities.push({
          type: 'sales',
          icon: 'ShoppingCartIcon',
          title: 'New sales order created',
          description: `Order #${order.order_number} - ${dashboardService.getTimeAgo(order.created_at)}`,
          timestamp: order.created_at
        });
      });

      // Get recent purchase orders (last 10)
      const recentPurchaseOrders = await purchaseService.getPurchaseOrders({ limit: 10 });
      recentPurchaseOrders.slice(0, 2).forEach(order => {
        activities.push({
          type: 'purchase',
          icon: 'LocalShippingIcon',
          title: 'Purchase order approved',
          description: `Order #${order.order_number} - ${dashboardService.getTimeAgo(order.created_at)}`,
          timestamp: order.created_at
        });
      });

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return activities.slice(0, 4); // Return top 4 activities
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  },

  /**
   * Get system alerts and notifications
   * @returns {Promise} - Promise with system alerts
   */
  getSystemAlerts: async () => {
    try {
      const alerts = [];

      // Get financial stats for unpaid amounts
      const financialStats = await dashboardService.getFinancialStats();
      if (financialStats.unpaidMandatory > 0) {
        alerts.push({
          type: 'error',
          icon: 'WarningIcon',
          title: 'Unpaid mandatory savings',
          description: `${dashboardService.formatCurrency(financialStats.unpaidMandatory)} total unpaid amount`
        });
      }

      // Get sales stats for outstanding invoices
      const salesStats = await dashboardService.getSalesStats();
      if (salesStats.outstandingInvoices > 0) {
        alerts.push({
          type: 'warning',
          icon: 'WarningIcon',
          title: 'Outstanding sales invoices',
          description: `${dashboardService.formatCurrency(salesStats.outstandingInvoices)} pending payment`
        });
      }

      // Get purchase stats for outstanding invoices
      const purchaseStats = await dashboardService.getPurchaseStats();
      if (purchaseStats.outstandingInvoices > 0) {
        alerts.push({
          type: 'warning',
          icon: 'WarningIcon',
          title: 'Outstanding purchase invoices',
          description: `${dashboardService.formatCurrency(purchaseStats.outstandingInvoices)} pending payment`
        });
      }

      // Add success message for SHU distribution
      if (financialStats.shuDistributed > 0) {
        alerts.push({
          type: 'success',
          icon: 'CheckCircleIcon',
          title: 'SHU distribution completed',
          description: `${dashboardService.formatCurrency(financialStats.shuDistributed)} distributed to members`
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error fetching system alerts:', error);
      return [];
    }
  },

  /**
   * Get chart data for savings trends
   * @returns {Promise} - Promise with savings trend data
   */
  getSavingsTrendData: async () => {
    try {
      // This would ideally be calculated from historical data
      // For now, we'll return the current month's data
      const financialStats = await dashboardService.getFinancialStats();
      
      // Generate last 6 months data (this would come from historical records in a real implementation)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const currentMonth = new Date().getMonth();
      const labels = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
      }

      return {
        labels,
        datasets: [
          {
            label: 'Principal',
            data: Array(6).fill(0).map((_, i) => financialStats.principalSavings * (0.7 + i * 0.05)),
            borderColor: '#1976d2',
            backgroundColor: '#1976d2',
          },
          {
            label: 'Mandatory',
            data: Array(6).fill(0).map((_, i) => financialStats.mandatorySavings * (0.7 + i * 0.05)),
            borderColor: '#dc004e',
            backgroundColor: '#dc004e',
          },
          {
            label: 'Voluntary',
            data: Array(6).fill(0).map((_, i) => financialStats.voluntarySavings * (0.7 + i * 0.05)),
            borderColor: '#0288d1',
            backgroundColor: '#0288d1',
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching savings trend data:', error);
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: []
      };
    }
  },

  /**
   * Get chart data for sales vs purchases
   * @returns {Promise} - Promise with sales vs purchases data
   */
  getSalesPurchasesData: async () => {
    try {
      const [salesStats, purchaseStats] = await Promise.all([
        dashboardService.getSalesStats(),
        dashboardService.getPurchaseStats()
      ]);

      // Generate last 6 months data (this would come from historical records)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const currentMonth = new Date().getMonth();
      const labels = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
      }

      return {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: Array(6).fill(0).map((_, i) => salesStats.totalSales * (0.6 + i * 0.08) / 6),
            backgroundColor: '#2e7d32',
          },
          {
            label: 'Purchases',
            data: Array(6).fill(0).map((_, i) => purchaseStats.totalPurchases * (0.6 + i * 0.08) / 6),
            backgroundColor: '#d32f2f',
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching sales purchases data:', error);
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: []
      };
    }
  },

  /**
   * Get member distribution data for pie chart
   * @returns {Promise} - Promise with member distribution data
   */
  getMemberDistributionData: async () => {
    try {
      const memberStats = await dashboardService.getMemberStats();
      
      return {
        labels: ['Active', 'Inactive'],
        datasets: [
          {
            data: [memberStats.active, memberStats.inactive],
            backgroundColor: ['#2e7d32', '#d32f2f'],
            borderWidth: 1,
          },
        ],
      };
    } catch (error) {
      console.error('Error fetching member distribution data:', error);
      return {
        labels: ['Active', 'Inactive'],
        datasets: [{ data: [0, 0], backgroundColor: ['#2e7d32', '#d32f2f'] }]
      };
    }
  },

  /**
   * Utility function to format currency
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted currency string
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Utility function to get time ago string
   * @param {string} timestamp - ISO timestamp
   * @returns {string} - Time ago string
   */
  getTimeAgo: (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
};

export default dashboardService;
