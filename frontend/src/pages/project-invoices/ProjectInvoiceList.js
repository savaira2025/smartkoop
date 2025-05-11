import React from 'react';
import { Box, Typography } from '@mui/material';
import ProjectInvoiceListComponent from '../../components/project-invoices/ProjectInvoiceList';

const ProjectInvoiceListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Invoices
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage invoices for projects. Track payments and invoice status.
      </Typography>
      
      <ProjectInvoiceListComponent />
    </Box>
  );
};

export default ProjectInvoiceListPage;
