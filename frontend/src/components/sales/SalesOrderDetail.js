import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import salesService from '../../services/salesService';

const SalesOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch sales order data on component mount
  useEffect(() => {
    fetchSalesOrderData();
  }, [id]);
  
  // Fetch sales order data from API
  const fetchSalesOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch sales order details
      const orderData = await salesService.getSalesOrder(id);
      setSalesOrder(orderData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sales order data:', err);
      setError('Failed to fetch sales order data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/sales/orders');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/sales/orders/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchSalesOrderData();
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'confirmed':
        color = 'info';
        break;
      case 'shipped':
        color = 'primary';
        break;
      case 'delivered':
        color = 'success';
        break;
      case 'cancelled':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={color} 
        size="small" 
      />
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Sales Orders
        </Button>
      </Box>
    );
  }
  
  if (!salesOrder) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Sales order not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Sales Orders
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Sales Orders
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Order
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sales Order #{salesOrder.order_number}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date(salesOrder.order_date).toLocaleDateString()}
        </Typography>
        
        <Box sx={{ mt: 1, mb: 2 }}>
          {renderStatusChip(salesOrder.status)}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Customer Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {salesOrder.customer_name}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Contact Person
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {salesOrder.contact_person || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {salesOrder.email || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {salesOrder.phone || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Order Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Subtotal
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(salesOrder.subtotal)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Tax
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(salesOrder.tax_amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Amount
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      {formatCurrency(salesOrder.total_amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesOrder.items && salesOrder.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No items in this order
                  </TableCell>
                </TableRow>
              ) : (
                salesOrder.items && salesOrder.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.unit_price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesOrderDetail;
