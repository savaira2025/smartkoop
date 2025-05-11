import React from 'react';
import { Box, Container } from '@mui/material';
import PurchaseOrderDetailComponent from '../../components/purchases/PurchaseOrderDetail';

const PurchaseOrderDetail = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2 }}>
        <PurchaseOrderDetailComponent />
      </Box>
    </Container>
  );
};

export default PurchaseOrderDetail;
