import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import purchaseService from '../../services/purchaseService';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    item_description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0
  });
  
  // Invoice dialog state
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceFormData, setInvoiceFormData] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    amount: 0,
    status: 'unpaid'
  });
  
  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentFormData, setPaymentFormData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: 'bank_transfer',
    reference_number: '',
    notes: ''
  });

  // Fetch purchase order data on component mount
  useEffect(() => {
    fetchPurchaseOrderData();
  }, [id]);

  // Fetch purchase order data from API
  const fetchPurchaseOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch purchase order
      const orderData = await purchaseService.getPurchaseOrder(id);
      setPurchaseOrder(orderData);
      
      // Fetch purchase order items
      const itemsData = await purchaseService.getPurchaseOrderItems(id);
      setItems(itemsData);
      
      // Fetch supplier invoices
      const invoicesData = await purchaseService.getSupplierInvoices(id);
      setInvoices(invoicesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching purchase order data:', err);
      setError('Failed to fetch purchase order data. Please try again.');
      setLoading(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/purchases/orders');
  };

  // Handle edit button click
  const handleEdit = () => {
    navigate(`/purchases/orders/${id}/edit`);
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await purchaseService.deletePurchaseOrder(id);
        navigate('/purchases/orders');
      } catch (err) {
        console.error('Error deleting purchase order:', err);
        setError('Failed to delete purchase order. Please try again.');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'approved':
        color = 'primary';
        break;
      case 'completed':
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

  // Render payment status chip
  const renderPaymentStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'unpaid':
        color = 'error';
        break;
      case 'partial':
        color = 'warning';
        break;
      case 'paid':
        color = 'success';
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

  // Item Dialog Functions
  const handleOpenItemDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setItemFormData({
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate
      });
    } else {
      setCurrentItem(null);
      setItemFormData({
        item_description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0
      });
    }
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemFormData({
      ...itemFormData,
      [name]: value
    });
  };

  const handleSaveItem = async () => {
    try {
      // Calculate subtotal
      const subtotal = itemFormData.quantity * itemFormData.unit_price;
      const itemData = {
        ...itemFormData,
        subtotal
      };
      
      if (currentItem) {
        // Update existing item
        await purchaseService.updatePurchaseOrderItem(id, currentItem.id, itemData);
      } else {
        // Add new item
        await purchaseService.addPurchaseOrderItem(id, itemData);
      }
      
      // Refresh data
      fetchPurchaseOrderData();
      handleCloseItemDialog();
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await purchaseService.deletePurchaseOrderItem(id, itemId);
        // Refresh data
        fetchPurchaseOrderData();
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  // Invoice Dialog Functions
  const handleOpenInvoiceDialog = (invoice = null) => {
    if (invoice) {
      setCurrentInvoice(invoice);
      setInvoiceFormData({
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date || '',
        amount: invoice.amount,
        status: invoice.status
      });
    } else {
      setCurrentInvoice(null);
      setInvoiceFormData({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount: purchaseOrder?.total_amount || 0,
        status: 'unpaid'
      });
    }
    setInvoiceDialogOpen(true);
  };

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false);
  };

  const handleInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    setInvoiceFormData({
      ...invoiceFormData,
      [name]: value
    });
  };

  const handleSaveInvoice = async () => {
    try {
      if (currentInvoice) {
        // Update existing invoice
        await purchaseService.updateSupplierInvoice(id, currentInvoice.id, invoiceFormData);
      } else {
        // Add new invoice
        await purchaseService.addSupplierInvoice(id, invoiceFormData);
      }
      
      // Refresh data
      fetchPurchaseOrderData();
      handleCloseInvoiceDialog();
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Failed to save invoice. Please try again.');
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await purchaseService.deleteSupplierInvoice(id, invoiceId);
        // Refresh data
        fetchPurchaseOrderData();
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice. Please try again.');
      }
    }
  };

  // Payment Dialog Functions
  const handleOpenPaymentDialog = async (invoiceId) => {
    try {
      setCurrentInvoiceId(invoiceId);
      
      // Fetch payments for this invoice
      const paymentsData = await purchaseService.getSupplierPayments(invoiceId);
      setPayments(paymentsData);
      
      // Reset payment form
      setPaymentFormData({
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: 'bank_transfer',
        reference_number: '',
        notes: ''
      });
      
      setPaymentDialogOpen(true);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to fetch payments. Please try again.');
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: value
    });
  };

  const handleAddPayment = async () => {
    try {
      await purchaseService.addSupplierPayment(currentInvoiceId, paymentFormData);
      
      // Refresh payments
      const paymentsData = await purchaseService.getSupplierPayments(currentInvoiceId);
      setPayments(paymentsData);
      
      // Reset form
      setPaymentFormData({
        payment_date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_method: 'bank_transfer',
        reference_number: '',
        notes: ''
      });
      
      // Refresh purchase order data to update payment status
      fetchPurchaseOrderData();
    } catch (err) {
      console.error('Error adding payment:', err);
      setError('Failed to add payment. Please try again.');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await purchaseService.deleteSupplierPayment(currentInvoiceId, paymentId);
        
        // Refresh payments
        const paymentsData = await purchaseService.getSupplierPayments(currentInvoiceId);
        setPayments(paymentsData);
        
        // Refresh purchase order data to update payment status
        fetchPurchaseOrderData();
      } catch (err) {
        console.error('Error deleting payment:', err);
        setError('Failed to delete payment. Please try again.');
      }
    }
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
      <Box>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Purchase Orders
        </Button>
      </Box>
    );
  }

  if (!purchaseOrder) {
    return (
      <Box>
        <Typography>Purchase order not found</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Purchase Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" component="h2">
            Purchase Order: {purchaseOrder.order_number}
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      {/* Purchase Order Details */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Supplier</Typography>
            <Typography variant="body1">{purchaseOrder.supplier?.name || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Order Number</Typography>
            <Typography variant="body1">{purchaseOrder.order_number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Order Date</Typography>
            <Typography variant="body1">{formatDate(purchaseOrder.order_date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Due Date</Typography>
            <Typography variant="body1">{formatDate(purchaseOrder.due_date) || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body1">{renderStatusChip(purchaseOrder.status)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Payment Status</Typography>
            <Typography variant="body1">{renderPaymentStatusChip(purchaseOrder.payment_status)}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Items */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3">
            Items
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleOpenItemDialog()}
          >
            Add Item
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Tax Rate</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell align="right">{item.tax_rate}%</TableCell>
                    <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenItemDialog(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Grid container spacing={1} sx={{ maxWidth: 300 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Subtotal:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {formatCurrency(purchaseOrder.subtotal)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Tax:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right">
                {formatCurrency(purchaseOrder.tax_amount)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Total:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="right" fontWeight="bold">
                {formatCurrency(purchaseOrder.total_amount)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Invoices */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3">
            Invoices
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleOpenInvoiceDialog()}
          >
            Add Invoice
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoice_number}</TableCell>
                    <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                    <TableCell>{formatDate(invoice.due_date) || 'N/A'}</TableCell>
                    <TableCell align="right">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{renderPaymentStatusChip(invoice.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenPaymentDialog(invoice.id)}
                        title="Manage Payments"
                      >
                        <PaymentIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenInvoiceDialog(invoice)}
                        title="Edit Invoice"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        title="Delete Invoice"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentItem ? 'Edit Item' : 'Add Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="item_description"
                label="Description"
                fullWidth
                value={itemFormData.item_description}
                onChange={handleItemFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                value={itemFormData.quantity}
                onChange={handleItemFormChange}
                inputProps={{ min: 1, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unit_price"
                label="Unit Price"
                type="number"
                fullWidth
                value={itemFormData.unit_price}
                onChange={handleItemFormChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tax_rate"
                label="Tax Rate (%)"
                type="number"
                fullWidth
                value={itemFormData.tax_rate}
                onChange={handleItemFormChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onClose={handleCloseInvoiceDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentInvoice ? 'Edit Invoice' : 'Add Invoice'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="invoice_number"
                label="Invoice Number"
                fullWidth
                value={invoiceFormData.invoice_number}
                onChange={handleInvoiceFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="invoice_date"
                label="Invoice Date"
                type="date"
                fullWidth
                value={invoiceFormData.invoice_date}
                onChange={handleInvoiceFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="due_date"
                label="Due Date"
                type="date"
                fullWidth
                value={invoiceFormData.due_date}
                onChange={handleInvoiceFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={invoiceFormData.amount}
                onChange={handleInvoiceFormChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Status"
                select
                fullWidth
                value={invoiceFormData.status}
                onChange={handleInvoiceFormChange}
              >
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog}>Cancel</Button>
          <Button onClick={handleSaveInvoice} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} maxWidth="md" fullWidth>
        <DialogTitle>Manage Payments</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>Existing Payments</Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell>{payment.reference_number || 'N/A'}</TableCell>
                      <TableCell>{payment.notes || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePayment(payment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Payment</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="payment_date"
                label="Payment Date"
                type="date"
                fullWidth
                value={paymentFormData.payment_date}
                onChange={handlePaymentFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={paymentFormData.amount}
                onChange={handlePaymentFormChange}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="payment_method"
                label="Payment Method"
                select
                fullWidth
                value={paymentFormData.payment_method}
                onChange={handlePaymentFormChange}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="check">Check</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="reference_number"
                label="Reference Number"
                fullWidth
                value={paymentFormData.reference_number}
                onChange={handlePaymentFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={paymentFormData.notes}
                onChange={handlePaymentFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddPayment}
                fullWidth
              >
                Add Payment
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderDetail;
