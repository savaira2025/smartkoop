import React, { useState } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DocumentUpload from '../../components/documents/DocumentUpload';
import documentService from '../../services/documentService';

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file, documentData) => {
    try {
      setLoading(true);
      const response = await documentService.uploadDocument(file, documentData);
      
      // Navigate to the document detail page
      navigate(`/documents/${response.id}`);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Document
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DocumentUpload 
          onUpload={handleUpload}
          loading={loading}
          error={error}
          documentTypes={['Contract', 'Invoice', 'Receipt', 'Report', 'Policy', 'Manual', 'Certificate', 'Other']}
          entityTypes={['Member', 'Customer', 'Supplier', 'Asset', 'Employee', 'Project', 'Other']}
        />
      </Box>
    </Container>
  );
};

export default DocumentUploadPage;
