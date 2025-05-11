import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  TextField, 
  MenuItem, 
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
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import purchaseService from '../../services/purchaseService';
import supplierService from '../../services/supplierService';

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    order_number: '',
    status: 'draft',
    due_date: '',
    payment_status: 'unpaid'
  });
  
  // Items state
  const [items, setItems] = useState([]);
  
  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    item_description: '',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0,
    subtotal: 0
  });
  
  // Suppliers state
  const [suppliers, setSuppliers] = useState([]);
  
  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
    
    // If in edit mode, fetch purchase order data
    if (isEditMode) {
      fetchPurchaseOrderData();
    } else {
      // Generate a new order number for new purchase orders
      generateOrderNumber();
    }
  }, [isEditMode, id]);
  
  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers. Please try again.');
      setLoading(false);
    }
  };
  
  // Fetch purchase order data from API
  const fetchPurchaseOrderData = async () => {
    try {
      setLoading(true);
      
      // Fetch purchase order
      const orderData = await purchaseService.getPurchaseOrder(id);
      setFormData({
        supplier_id: orderData.supplier_id,
        order_date: orderData.order_date,
        order_number: orderData.order_number,
        status: orderData.status,
        due_date: orderData.due_date || '',
        payment_status: orderData.payment_status
      });
      
      // Fetch purchase order items
      const itemsData = await purchaseService.getPurchaseOrderItems(id);
      setItems(itemsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching purchase order data:', err);
      setError('Failed to fetch purchase order data. Please try again.');
      setLoading(false);
    }
  };
  
  // Generate a new order number
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const orderNumber = `PO-${year}${month}${day}-${random}`;
    setFormData(prev => ({ ...prev, order_number: orderNumber }));
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.supplier_id) {
        throw new Error('Supplier is required');
      }
      
      if (items.length === 0) {
        throw new Error('At least one item is required');
      }
      
      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;
      
      items.forEach(item => {
        subtotal += parseFloat(item.subtotal);
        taxAmount += (parseFloat(item.subtotal) * parseFloat(item.tax_rate)) / 100;
      });
      
      const totalAmount = subtotal + taxAmount;
      
      // Prepare data for submission
      const purchaseOrderData = {
        ...formData,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        items: items
      };
      
      // Validate that all required fields are present
      const requiredFields = ['supplier_id', 'order_date', 'order_number', 'status'];
      const missingFields = requiredFields.filter(field => !purchaseOrderData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      let responseId;
      
      if (isEditMode) {
        // Update existing purchase order
        const response = await purchaseService.updatePurchaseOrder(id, purchaseOrderData);
        responseId = id;
      } else {
        // Create new purchase order
        const response = await purchaseService.createPurchaseOrder(purchaseOrderData);
        responseId = response.id; // Set id for redirect
      }
      
      setLoading(false);
      
      // Redirect to purchase order detail page
      navigate(`/purchases/orders/${responseId}`);
    } catch (err) {
      console.error('Error saving purchase order:', err);
      setError('Failed to save purchase order. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/purchases/orders/${id}`);
    } else {
      navigate('/purchases/orders');
    }
  };
  
  // Item Dialog Functions
  const handleOpenItemDialog = (index = null) => {
    if (index !== null) {
      setCurrentItemIndex(index);
      setItemFormData({
        item_description: items[index].item_description,
        quantity: items[index].quantity,
        unit_price: items[index].unit_price,
        tax_rate: items[index].tax_rate,
        subtotal: items[index].subtotal
      });
    } else {
      setCurrentItemIndex(null);
      setItemFormData({
        item_description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        subtotal: 0
      });
    }
    setItemDialogOpen(true);
  };
  
  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
  };
  
  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    
    setItemFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Recalculate subtotal if quantity or unit_price changes
      if (name === 'quantity' || name === 'unit_price') {
        updated.subtotal = updated.quantity * updated.unit_price;
      }
      
      return updated;
    });
  };
  
  const handleSaveItem = () => {
    const newItem = { ...itemFormData };
    
    if (currentItemIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = newItem;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems(prev => [...prev, newItem]);
    }
    
    handleCloseItemDialog();
  };
  
  const handleDeleteItem = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };
  
  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;
    
    items.forEach(item => {
      subtotal += parseFloat(item.subtotal);
      taxAmount += (parseFloat(item.subtotal) * parseFloat(item.tax_rate)) / 100;
    });
    
    const totalAmount = subtotal + taxAmount;
    
    return {
      subtotal,
      taxAmount,
      totalAmount
    };
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const totals = calculateTotals();
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" component="h2">
            {isEditMode ? 'Edit Purchase Order' : 'New Purchase Order'}
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Purchase Order Details */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Purchase Order Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="supplier_id"
                  label="Supplier"
                  select
                  fullWidth
                  value={formData.supplier_id}
                  onChange={handleInputChange}
                  required
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="order_number"
                  label="Order Number"
                  fullWidth
                  value={formData.order_number}
                  onChange={handleInputChange}
                  required
                  disabled={isEditMode} // Disable editing order number in edit mode
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="order_date"
                  label="Order Date"
                  type="date"
                  fullWidth
                  value={formData.order_date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="due_date"
                  label="Due Date"
                  type="date"
                  fullWidth
                  value={formData.due_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="status"
                  label="Status"
                  select
                  fullWidth
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="payment_status"
                  label="Payment Status"
                  select
                  fullWidth
                  value={formData.payment_status}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </TextField>
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
                        No items added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.item_description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell align="right">{item.tax_rate}%</TableCell>
                        <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenItemDialog(index)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(index)}
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
                    {formatCurrency(totals.subtotal)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Tax:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatCurrency(totals.taxAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right" fontWeight="bold">
                    {formatCurrency(totals.totalAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </form>
      )}
      
      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentItemIndex !== null ? 'Edit Item' : 'Add Item'}
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
                required
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
                required
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
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="tax_rate"
                label="Tax Rate (%)"
                type="number"
                fullWidth
                value={itemFormData.tax_rate}
                onChange={handleItemFormChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="subtotal"
                label="Subtotal"
                type="number"
                fullWidth
                value={itemFormData.subtotal}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveItem} 
            variant="contained"
            disabled={!itemFormData.item_description || itemFormData.quantity <= 0 || itemFormData.unit_price < 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderForm;
