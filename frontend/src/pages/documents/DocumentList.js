import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import DocumentList from '../../components/documents/DocumentList';
import documentService from '../../services/documentService';
import { useNavigate } from 'react-router-dom';

const DocumentListPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments({}, page * rowsPerPage, rowsPerPage);
      setDocuments(data);
      // In a real implementation, the API would return the total count
      // For now, we'll just use the length of the returned array
      setTotalCount(data.length > 0 ? data.length + page * rowsPerPage : 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      // Refresh the document list
      fetchDocuments();
    } catch (err) {
      console.error(`Error deleting document with ID ${id}:`, err);
      setError('Failed to delete document. Please try again later.');
    }
  };

  const handleDownload = async (id) => {
    try {
      // In a real implementation, this would download the file
      // For now, we'll just navigate to the document detail page
      navigate(`/documents/${id}`);
    } catch (err) {
      console.error(`Error downloading document with ID ${id}:`, err);
      setError('Failed to download document. Please try again later.');
    }
  };

  const handleViewVersions = (id) => {
    navigate(`/documents/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Documents
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DocumentList 
          documents={documents}
          loading={loading}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onViewVersions={handleViewVersions}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </Container>
  );
};

export default DocumentListPage;
