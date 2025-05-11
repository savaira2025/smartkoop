import React from 'react';
import { Box, Container } from '@mui/material';
import PurchaseOrderListComponent from '../../components/purchases/PurchaseOrderList';

const PurchaseOrderList = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2 }}>
        <PurchaseOrderListComponent />
      </Box>
    </Container>
  );
};

export default PurchaseOrderList;
