import api from './api';

/**
 * Asset Service
 * 
 * This service handles all API calls related to assets.
 */
const assetService = {
  /**
   * Get all assets with pagination
   * @param {number} skip - Number of items to skip
   * @param {number} limit - Number of items to return
   * @returns {Promise} - Promise with the assets data
   */
  getAssets: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/assets?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  /**
   * Get a single asset by ID
   * @param {number} id - Asset ID
   * @returns {Promise} - Promise with the asset data
   */
  getAsset: async (id) => {
    try {
      const response = await api.get(`/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching asset with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new asset
   * @param {Object} assetData - Asset data
   * @returns {Promise} - Promise with the created asset data
   */
  createAsset: async (assetData) => {
    try {
      const response = await api.post('/assets', assetData);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  /**
   * Update an existing asset
   * @param {number} id - Asset ID
   * @param {Object} assetData - Updated asset data
   * @returns {Promise} - Promise with the updated asset data
   */
  updateAsset: async (id, assetData) => {
    try {
      const response = await api.put(`/assets/${id}`, assetData);
      return response.data;
    } catch (error) {
      console.error(`Error updating asset with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an asset
   * @param {number} id - Asset ID
   * @returns {Promise} - Promise with the deletion result
   */
  deleteAsset: async (id) => {
    try {
      const response = await api.delete(`/assets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting asset with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all depreciation entries for an asset
   * @param {number} assetId - Asset ID
   * @returns {Promise} - Promise with the depreciation entries
   */
  getAssetDepreciations: async (assetId) => {
    try {
      const response = await api.get(`/assets/${assetId}/depreciations`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching depreciations for asset with ID ${assetId}:`, error);
      throw error;
    }
  },

  /**
   * Get a single depreciation entry by ID
   * @param {number} depreciationId - Depreciation ID
   * @returns {Promise} - Promise with the depreciation entry data
   */
  getAssetDepreciation: async (depreciationId) => {
    try {
      const response = await api.get(`/assets/depreciations/${depreciationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching depreciation with ID ${depreciationId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new depreciation entry for an asset
   * @param {number} assetId - Asset ID
   * @param {Object} depreciationData - Depreciation data
   * @returns {Promise} - Promise with the created depreciation entry
   */
  createAssetDepreciation: async (assetId, depreciationData) => {
    try {
      const response = await api.post(`/assets/${assetId}/depreciations`, {
        ...depreciationData,
        asset_id: assetId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating depreciation for asset with ID ${assetId}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing depreciation entry
   * @param {number} depreciationId - Depreciation ID
   * @param {Object} depreciationData - Updated depreciation data
   * @returns {Promise} - Promise with the updated depreciation entry
   */
  updateAssetDepreciation: async (depreciationId, depreciationData) => {
    try {
      const response = await api.put(`/assets/depreciations/${depreciationId}`, depreciationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating depreciation with ID ${depreciationId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a depreciation entry
   * @param {number} depreciationId - Depreciation ID
   * @returns {Promise} - Promise with the deletion result
   */
  deleteAssetDepreciation: async (depreciationId) => {
    try {
      const response = await api.delete(`/assets/depreciations/${depreciationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting depreciation with ID ${depreciationId}:`, error);
      throw error;
    }
  },

  /**
   * Get all maintenance records for an asset
   * @param {number} assetId - Asset ID
   * @returns {Promise} - Promise with the maintenance records
   */
  getAssetMaintenances: async (assetId) => {
    try {
      const response = await api.get(`/assets/${assetId}/maintenances`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenances for asset with ID ${assetId}:`, error);
      throw error;
    }
  },

  /**
   * Get a single maintenance record by ID
   * @param {number} maintenanceId - Maintenance ID
   * @returns {Promise} - Promise with the maintenance record data
   */
  getAssetMaintenance: async (maintenanceId) => {
    try {
      const response = await api.get(`/assets/maintenances/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance with ID ${maintenanceId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new maintenance record for an asset
   * @param {number} assetId - Asset ID
   * @param {Object} maintenanceData - Maintenance data
   * @returns {Promise} - Promise with the created maintenance record
   */
  createAssetMaintenance: async (assetId, maintenanceData) => {
    try {
      const response = await api.post(`/assets/${assetId}/maintenances`, {
        ...maintenanceData,
        asset_id: assetId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating maintenance for asset with ID ${assetId}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing maintenance record
   * @param {number} maintenanceId - Maintenance ID
   * @param {Object} maintenanceData - Updated maintenance data
   * @returns {Promise} - Promise with the updated maintenance record
   */
  updateAssetMaintenance: async (maintenanceId, maintenanceData) => {
    try {
      const response = await api.put(`/assets/maintenances/${maintenanceId}`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating maintenance with ID ${maintenanceId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a maintenance record
   * @param {number} maintenanceId - Maintenance ID
   * @returns {Promise} - Promise with the deletion result
   */
  deleteAssetMaintenance: async (maintenanceId) => {
    try {
      const response = await api.delete(`/assets/maintenances/${maintenanceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting maintenance with ID ${maintenanceId}:`, error);
      throw error;
    }
  }
};

export default assetService;
