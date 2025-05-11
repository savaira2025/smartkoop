import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectInvoiceFormComponent from '../../components/project-invoices/ProjectInvoiceForm';

const ProjectInvoiceFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </Typography>
      <Typography variant="body1" paragraph>
        {isEditMode 
          ? 'Update invoice details, items, and status.' 
          : 'Create a new invoice for a project with items and tax information.'}
      </Typography>
      
      <ProjectInvoiceFormComponent />
    </Box>
  );
};

export default ProjectInvoiceFormPage;
