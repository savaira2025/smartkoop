import React from 'react';
import { Box, Container } from '@mui/material';
import PurchaseOrderFormComponent from '../../components/purchases/PurchaseOrderForm';

const PurchaseOrderForm = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2 }}>
        <PurchaseOrderFormComponent />
      </Box>
    </Container>
  );
};

export default PurchaseOrderForm;
