import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomerListComponent from '../../components/customers/CustomerList';

const CustomerListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Customer Management
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage business customers. Track customer information, sales orders, and invoices.
      </Typography>
      
      <CustomerListComponent />
    </Box>
  );
};

export default CustomerListPage;
