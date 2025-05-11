import React from 'react';
import { Box, Typography } from '@mui/material';
import SupplierListComponent from '../../components/suppliers/SupplierList';

const SupplierListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Supplier Management
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage business suppliers. Track supplier information, purchase orders, and invoices.
      </Typography>
      
      <SupplierListComponent />
    </Box>
  );
};

export default SupplierListPage;
