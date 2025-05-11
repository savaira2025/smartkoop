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
  CardContent,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../../services/projectService';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
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

const ProjectInvoiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch invoice data on component mount
  useEffect(() => {
    fetchInvoiceData();
  }, [id]);
  
  // Fetch invoice data from API
  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch invoice details
      const invoiceData = await projectService.getProjectInvoice(id);
      setInvoice(invoiceData);
      
      // Items and payments should be included in the invoice response
      if (invoiceData.items) {
        setItems(invoiceData.items);
      }
      
      if (invoiceData.payments) {
        setPayments(invoiceData.payments);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoice data:', err);
      setError('Failed to fetch invoice data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/project-invoices');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/project-invoices/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchInvoiceData();
  };
  
  // Handle add payment button click
  const handleAddPayment = () => {
    // This would navigate to a payment form
    // For now, just show an alert
    alert('Add payment functionality will be implemented soon.');
  };
  
  // Handle print button click
  const handlePrint = () => {
    // This would open a print view
    // For now, just show an alert
    alert('Print functionality will be implemented soon.');
  };
  
  // Handle email button click
  const handleEmail = () => {
    // This would open an email dialog
    // For now, just show an alert
    alert('Email functionality will be implemented soon.');
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
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'sent':
        color = 'info';
        break;
      case 'paid':
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
          Back to Invoices
        </Button>
      </Box>
    );
  }
  
  if (!invoice) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Invoice not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Invoices
        </Button>
      </Box>
    );
  }
  
  // Calculate total paid
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  // Calculate balance due
  const balanceDue = Number(invoice.total_amount) - totalPaid;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Invoices
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
            Edit Invoice
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Invoice #{invoice.invoice_number}
          </Typography>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleEmail}
              sx={{ mr: 1 }}
            >
              Email
            </Button>
            
            <Button
              variant="contained"
              color="success"
              startIcon={<PaymentIcon />}
              onClick={handleAddPayment}
              disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
            >
              Record Payment
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Invoice Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Project
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {invoice.project ? invoice.project.project_name : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {invoice.project && invoice.project.customer ? invoice.project.customer.name : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Invoice Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatDate(invoice.invoice_date)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Due Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatDate(invoice.due_date)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {renderStatusChip(invoice.status)}
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatCurrency(invoice.subtotal)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Tax
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatCurrency(invoice.tax_amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(invoice.total_amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Paid
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color="success.main">
                  {formatCurrency(totalPaid)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Balance Due
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color={balanceDue > 0 ? 'error.main' : 'success.main'} fontWeight="bold">
                  {formatCurrency(balanceDue)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="invoice tabs">
            <Tab label="Items" id="invoice-tab-0" aria-controls="invoice-tabpanel-0" />
            <Tab label="Payments" id="invoice-tab-1" aria-controls="invoice-tabpanel-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Tax Rate</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell align="right">{item.tax_rate}%</TableCell>
                      <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))
                )}
                
                {/* Summary rows */}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1">Subtotal:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1">{formatCurrency(invoice.subtotal)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1">Tax:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1">{formatCurrency(invoice.tax_amount)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1" fontWeight="bold">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(invoice.total_amount)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddPayment}
              disabled={invoice.status === 'paid' || invoice.status === 'cancelled'}
            >
              Record Payment
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Reference #</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell>{payment.reference_number || 'N/A'}</TableCell>
                      <TableCell>{payment.notes || 'N/A'}</TableCell>
                      <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
                
                {/* Summary rows */}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1">Total Paid:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" color="success.main">{formatCurrency(totalPaid)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="body1" fontWeight="bold">Balance Due:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={balanceDue > 0 ? 'error.main' : 'success.main'}
                    >
                      {formatCurrency(balanceDue)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProjectInvoiceDetail;
