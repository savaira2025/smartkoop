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
  TablePagination,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import customerService from '../../services/customerService';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [customer, setCustomer] = useState(null);
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination for sales orders
  const [orderPage, setOrderPage] = useState(0);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(5);
  
  // Fetch customer data on component mount
  useEffect(() => {
    fetchCustomerData();
  }, [id]);
  
  // Fetch customer data from API
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch customer details
      const customerData = await customerService.getCustomer(id);
      setCustomer(customerData);
      
      // In a real application, you would fetch sales orders here
      // For now, we'll use an empty array
      setSalesOrders([]);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to fetch customer data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle order page change
  const handleOrderPageChange = (event, newPage) => {
    setOrderPage(newPage);
  };
  
  // Handle order rows per page change
  const handleOrderRowsPerPageChange = (event) => {
    setOrderRowsPerPage(parseInt(event.target.value, 10));
    setOrderPage(0);
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/customers');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/customers/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchCustomerData();
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
      case 'active':
        color = 'success';
        break;
      case 'inactive':
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
          Back to Customers
        </Button>
      </Box>
    );
  }
  
  if (!customer) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Customer not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Customers
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
          Back to Customers
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
            Edit Customer
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {customer.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Customer ID: {customer.id}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Contact Person
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.contact_person || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.email || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.phone || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.address || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {renderStatusChip(customer.status)}
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Business Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Payment Terms
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.payment_terms || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Credit Limit
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.credit_limit ? formatCurrency(customer.credit_limit) : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Tax ID
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {customer.tax_id || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h5" color="primary.main">
                    {formatCurrency(0)} {/* This would be calculated from actual sales data */}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="customer tabs">
            <Tab label="Sales Orders" id="customer-tab-0" aria-controls="customer-tabpanel-0" />
            <Tab label="Invoices" id="customer-tab-1" aria-controls="customer-tabpanel-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No sales orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  salesOrders
                    .slice(
                      orderPage * orderRowsPerPage,
                      orderPage * orderRowsPerPage + orderRowsPerPage
                    )
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.order_number}</TableCell>
                        <TableCell>
                          {new Date(order.order_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={
                              order.status === 'completed' 
                                ? 'success' 
                                : order.status === 'pending' 
                                  ? 'warning' 
                                  : 'default'
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/sales/orders/${order.id}`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={salesOrders.length}
            rowsPerPage={orderRowsPerPage}
            page={orderPage}
            onPageChange={handleOrderPageChange}
            onRowsPerPageChange={handleOrderRowsPerPageChange}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Invoice information will be displayed here.
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CustomerDetail;
