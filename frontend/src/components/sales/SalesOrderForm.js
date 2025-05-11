import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Alert, 
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import salesService from '../../services/salesService';
import customerService from '../../services/customerService';

// Validation schema
const validationSchema = Yup.object({
  customer_id: Yup.number().required('Customer is required'),
  order_date: Yup.date().required('Order date is required'),
  status: Yup.string().required('Status is required'),
  items: Yup.array().of(
    Yup.object().shape({
      product_id: Yup.mixed().required('Product is required'),
      product_name: Yup.string(),
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      unit_price: Yup.number().min(0, 'Unit price must be a positive number').required('Unit price is required')
    })
  ).min(1, 'At least one item is required')
});

const SalesOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      customer_id: '',
      order_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      status: 'draft',
      items: [
        {
          product_id: '',
          product_name: '',
          quantity: 1,
          unit_price: 0
        }
      ]
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        // Calculate totals
        const subtotal = values.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const taxRate = 0.1; // 10% tax rate
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;
        
        // Transform items to match backend schema
        const transformedItems = values.items.map(item => ({
          item_description: item.product_name || `Product ID: ${item.product_id}`,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
          tax_rate: taxRate
        }));
        
        const orderData = {
          customer_id: values.customer_id,
          order_date: values.order_date,
          order_number: values.order_number || '',
          status: values.status,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          payment_status: values.payment_status || 'unpaid',
          due_date: values.due_date,
          items: transformedItems
        };
        
        if (isEditMode) {
          // Update existing sales order
          await salesService.updateSalesOrder(id, orderData);
          setSuccess('Sales order updated successfully');
        } else {
          // Create new sales order
          await salesService.createSalesOrder(orderData);
          setSuccess('Sales order created successfully');
          formik.resetForm();
        }
        
        setLoading(false);
        
        // Navigate back to sales order list after a short delay
        setTimeout(() => {
          navigate('/sales/orders');
        }, 1500);
      } catch (err) {
        console.error('Error saving sales order:', err);
        setError('Failed to save sales order. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch customers and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersData = await customerService.getCustomers();
        setCustomers(customersData);
        
        // In a real application, you would fetch products here
        // For now, we'll use dummy data
        setProducts([
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
          { id: 3, name: 'Product 3', price: 300 },
        ]);
        
        // If in edit mode, fetch sales order data
        if (isEditMode) {
          const orderData = await salesService.getSalesOrder(id);
          
          // Transform backend items format to frontend format
          const transformedItems = orderData.items.map(item => ({
            product_id: item.id || '',
            product_name: item.item_description || '',
            quantity: item.quantity || 1,
            unit_price: item.unit_price || 0
          }));
          
          // Update form values with sales order data
          formik.setValues({
            customer_id: orderData.customer_id,
            order_date: orderData.order_date,
            status: orderData.status,
            order_number: orderData.order_number,
            payment_status: orderData.payment_status,
            due_date: orderData.due_date,
            items: transformedItems.length > 0 ? transformedItems : formik.initialValues.items
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  // Handle adding a new item
  const handleAddItem = () => {
    formik.setValues({
      ...formik.values,
      items: [
        ...formik.values.items,
        {
          product_id: '',
          product_name: '',
          quantity: 1,
          unit_price: 0
        }
      ]
    });
  };
  
  // Handle removing an item
  const handleRemoveItem = (index) => {
    const newItems = [...formik.values.items];
    newItems.splice(index, 1);
    
    formik.setValues({
      ...formik.values,
      items: newItems
    });
  };
  
  // Handle product selection
  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const newItems = [...formik.values.items];
      newItems[index] = {
        ...newItems[index],
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price
      };
      
      formik.setValues({
        ...formik.values,
        items: newItems
      });
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/sales/orders');
  };
  
  // Calculate order totals
  const subtotal = formik.values.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxRate = 0.1; // 10% tax rate
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Sales Order' : 'Create New Sales Order'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Order Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Order Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading} error={formik.touched.customer_id && Boolean(formik.errors.customer_id)}>
                <InputLabel id="customer-label">Customer</InputLabel>
                <Select
                  labelId="customer-label"
                  id="customer_id"
                  name="customer_id"
                  value={formik.values.customer_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Customer"
                >
                  <MenuItem value="">
                    <em>Select a customer</em>
                  </MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.customer_id && formik.errors.customer_id && (
                  <Typography variant="caption" color="error">
                    {formik.errors.customer_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="order_date"
                name="order_date"
                label="Order Date"
                type="date"
                value={formik.values.order_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.order_date && Boolean(formik.errors.order_date)}
                helperText={formik.touched.order_date && formik.errors.order_date}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth disabled={loading} error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography variant="caption" color="error">
                    {formik.errors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            {/* Order Items */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formik.values.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormControl fullWidth disabled={loading} error={
                            formik.touched.items && 
                            formik.touched.items[index] && 
                            formik.touched.items[index].product_id && 
                            formik.errors.items && 
                            formik.errors.items[index] && 
                            formik.errors.items[index].product_id
                          }>
                            <InputLabel id={`product-label-${index}`}>Product</InputLabel>
                            <Select
                              labelId={`product-label-${index}`}
                              id={`items[${index}].product_id`}
                              name={`items[${index}].product_id`}
                              value={item.product_id}
                              onChange={(e) => handleProductChange(index, e.target.value)}
                              onBlur={formik.handleBlur}
                              label="Product"
                            >
                              <MenuItem value="">
                                <em>Select a product</em>
                              </MenuItem>
                              {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                  {product.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            id={`items[${index}].quantity`}
                            name={`items[${index}].quantity`}
                            value={item.quantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.items && 
                              formik.touched.items[index] && 
                              formik.touched.items[index].quantity && 
                              formik.errors.items && 
                              formik.errors.items[index] && 
                              formik.errors.items[index].quantity
                            }
                            disabled={loading}
                            inputProps={{ min: 1 }}
                            sx={{ width: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            id={`items[${index}].unit_price`}
                            name={`items[${index}].unit_price`}
                            value={item.unit_price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.items && 
                              formik.touched.items[index] && 
                              formik.touched.items[index].unit_price && 
                              formik.errors.items && 
                              formik.errors.items[index] && 
                              formik.errors.items[index].unit_price
                            }
                            disabled={loading}
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{ width: '100px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.quantity * item.unit_price)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                            disabled={loading || formik.values.items.length <= 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleAddItem}
                          disabled={loading}
                        >
                          Add Item
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Subtotal:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">{formatCurrency(subtotal)}</Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Tax (10%):</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">{formatCurrency(taxAmount)}</Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">{formatCurrency(totalAmount)}</Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Order' : 'Create Order'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SalesOrderForm;
