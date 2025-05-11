import api from './api';

/**
 * Document Service
 * 
 * This service handles all API calls related to documents.
 */
const documentService = {
  /**
   * Get all documents with optional filtering
   * @param {Object} filters - Optional filters
   * @param {string} filters.related_entity_type - Filter by related entity type
   * @param {number} filters.related_entity_id - Filter by related entity ID
   * @param {string} filters.document_type - Filter by document type
   * @param {string} filters.status - Filter by status
   * @param {number} skip - Number of items to skip
   * @param {number} limit - Number of items to return
   * @returns {Promise<Array>} - List of documents
   */
  getDocuments: async (filters = {}, skip = 0, limit = 100) => {
    try {
      let queryParams = `skip=${skip}&limit=${limit}`;
      
      if (filters.related_entity_type) {
        queryParams += `&related_entity_type=${filters.related_entity_type}`;
      }
      
      if (filters.related_entity_id) {
        queryParams += `&related_entity_id=${filters.related_entity_id}`;
      }
      
      if (filters.document_type) {
        queryParams += `&document_type=${filters.document_type}`;
      }
      
      if (filters.status) {
        queryParams += `&status=${filters.status}`;
      }
      
      const response = await api.get(`/documents?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  /**
   * Get a document by ID
   * @param {number} id - Document ID
   * @returns {Promise<Object>} - Document
   */
  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new document
   * @param {Object} documentData - Document data
   * @returns {Promise<Object>} - Created document
   */
  createDocument: async (documentData) => {
    try {
      const response = await api.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  /**
   * Upload a new document
   * @param {File} file - File to upload
   * @param {Object} documentData - Document metadata
   * @returns {Promise<Object>} - Created document
   */
  uploadDocument: async (file, documentData) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add document metadata to form data
      Object.keys(documentData).forEach(key => {
        if (documentData[key] !== null && documentData[key] !== undefined) {
          formData.append(key, documentData[key]);
        }
      });
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  /**
   * Update a document
   * @param {number} id - Document ID
   * @param {Object} documentData - Document data to update
   * @returns {Promise<Object>} - Updated document
   */
  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a document
   * @param {number} id - Document ID
   * @returns {Promise<boolean>} - Success status
   */
  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all versions of a document
   * @param {number} documentId - Document ID
   * @returns {Promise<Array>} - List of document versions
   */
  getDocumentVersions: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/versions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching versions for document with ID ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Get a document version by ID
   * @param {number} versionId - Version ID
   * @returns {Promise<Object>} - Document version
   */
  getDocumentVersion: async (versionId) => {
    try {
      const response = await api.get(`/documents/versions/${versionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document version with ID ${versionId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new document version
   * @param {number} documentId - Document ID
   * @param {Object} versionData - Version data
   * @returns {Promise<Object>} - Created document version
   */
  createDocumentVersion: async (documentId, versionData) => {
    try {
      const response = await api.post(`/documents/${documentId}/versions`, {
        ...versionData,
        document_id: documentId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating version for document with ID ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Upload a new version of a document
   * @param {number} documentId - Document ID
   * @param {File} file - File to upload
   * @param {Object} versionData - Version metadata
   * @returns {Promise<Object>} - Created document version
   */
  uploadDocumentVersion: async (documentId, file, versionData = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add version metadata to form data
      Object.keys(versionData).forEach(key => {
        if (versionData[key] !== null && versionData[key] !== undefined) {
          formData.append(key, versionData[key]);
        }
      });
      
      const response = await api.post(`/documents/${documentId}/upload-version`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading version for document with ID ${documentId}:`, error);
      throw error;
    }
  },

  /**
   * Update a document version
   * @param {number} versionId - Version ID
   * @param {Object} versionData - Version data to update
   * @returns {Promise<Object>} - Updated document version
   */
  updateDocumentVersion: async (versionId, versionData) => {
    try {
      const response = await api.put(`/documents/versions/${versionId}`, versionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating document version with ID ${versionId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a document version
   * @param {number} versionId - Version ID
   * @returns {Promise<boolean>} - Success status
   */
  deleteDocumentVersion: async (versionId) => {
    try {
      const response = await api.delete(`/documents/versions/${versionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document version with ID ${versionId}:`, error);
      throw error;
    }
  }
};

export default documentService;
