import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentDetail from '../../components/documents/DocumentDetail';
import documentService from '../../services/documentService';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const documentData = await documentService.getDocument(id);
      setDocument(documentData);
      
      // Fetch document versions
      const versionsData = await documentService.getDocumentVersions(id);
      setVersions(versionsData);
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching document with ID ${id}:`, err);
      setError('Failed to load document. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await documentService.deleteDocument(documentId);
      // Navigate back to the document list
      navigate('/documents');
    } catch (err) {
      console.error(`Error deleting document with ID ${documentId}:`, err);
      setError('Failed to delete document. Please try again later.');
    }
  };

  const handleDownload = async (documentId, versionId = null) => {
    try {
      // In a real implementation, this would download the file
      // For now, we'll just show an alert
      alert(`Downloading ${versionId ? 'version ' + versionId + ' of ' : ''}document ${documentId}`);
    } catch (err) {
      console.error(`Error downloading document:`, err);
      setError('Failed to download document. Please try again later.');
    }
  };

  const handleUploadVersion = (documentId) => {
    // In a real implementation, this would open a modal or navigate to a version upload page
    // For now, we'll just navigate to the document edit page
    navigate(`/documents/${documentId}/edit`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DocumentDetail 
          document={document}
          versions={versions}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onUploadVersion={handleUploadVersion}
        />
      </Box>
    </Container>
  );
};

export default DocumentDetailPage;
