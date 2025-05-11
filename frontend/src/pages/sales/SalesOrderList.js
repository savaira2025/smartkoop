import React from 'react';
import { Box, Typography } from '@mui/material';
import SalesOrderListComponent from '../../components/sales/SalesOrderList';

const SalesOrderListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Sales Management
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage sales orders. Track customer orders, invoices, and payments.
      </Typography>
      
      <SalesOrderListComponent />
    </Box>
  );
};

export default SalesOrderListPage;
