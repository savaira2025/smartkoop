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
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import projectService from '../../services/projectService';

// Validation schema
const validationSchema = Yup.object({
  project_id: Yup.number().required('Project is required'),
  invoice_number: Yup.string().nullable(),
  invoice_date: Yup.date().required('Invoice date is required'),
  due_date: Yup.date().nullable(),
  status: Yup.string().required('Status is required'),
  subtotal: Yup.number().min(0, 'Must be a positive number'),
  tax_amount: Yup.number().min(0, 'Must be a positive number'),
  total_amount: Yup.number().min(0, 'Must be a positive number'),
});

const ProjectInvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  
  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      project_id: '',
      invoice_number: '',
      invoice_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)), // Default due date: 30 days from now
      status: 'draft',
      subtotal: 0,
      tax_amount: 0,
      total_amount: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        // Convert dates to ISO strings and ensure project_id is a number
        const formattedValues = {
          ...values,
          project_id: Number(values.project_id), // Ensure project_id is a number
          invoice_date: values.invoice_date instanceof Date ? values.invoice_date.toISOString().split('T')[0] : values.invoice_date,
          due_date: values.due_date ? (values.due_date instanceof Date ? values.due_date.toISOString().split('T')[0] : values.due_date) : null,
          // Ensure numeric values are properly formatted
          subtotal: Number(values.subtotal),
          tax_amount: Number(values.tax_amount),
          total_amount: Number(values.total_amount)
        };
        
        let savedInvoice;
        
        if (isEditMode) {
          // Update existing invoice
          savedInvoice = await projectService.updateProjectInvoice(id, formattedValues);
          setSuccess('Invoice updated successfully');
        } else {
          // Create new invoice
          savedInvoice = await projectService.createProjectInvoice(formattedValues.project_id, formattedValues);
          setSuccess('Invoice created successfully');
        }
        
        // Save invoice items
        if (savedInvoice && invoiceItems.length > 0) {
          const invoiceId = savedInvoice.id;
          
          // Delete existing items if in edit mode
          if (isEditMode) {
            const existingItems = await projectService.getInvoiceItems(invoiceId);
            for (const item of existingItems) {
              await projectService.deleteInvoiceItem(item.id);
            }
          }
          
          // Create new items
          for (const item of invoiceItems) {
            await projectService.createInvoiceItem(invoiceId, {
              ...item,
              invoice_id: invoiceId
            });
          }
        }
        
        setLoading(false);
        
        // Navigate back to invoice list after a short delay
        setTimeout(() => {
          navigate('/project-invoices');
        }, 1500);
      } catch (err) {
        console.error('Error saving invoice:', err);
        setError('Failed to save invoice. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects. Please try again.');
      }
    };
    
    fetchProjects();
  }, []);
  
  // Fetch invoice data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchInvoice = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const data = await projectService.getProjectInvoice(id);
          
          // Find the selected project
          if (data.project_id && projects.length > 0) {
            const project = projects.find(p => p.id === data.project_id);
            setSelectedProject(project || null);
            
            // Fetch project tasks
            if (project) {
              const tasksData = await projectService.getProjectTasks(project.id);
              setProjectTasks(tasksData);
            }
          }
          
          // Update form values with invoice data
          formik.setValues({
            project_id: data.project_id || '',
            invoice_number: data.invoice_number || '',
            invoice_date: data.invoice_date ? new Date(data.invoice_date) : new Date(),
            due_date: data.due_date ? new Date(data.due_date) : new Date(new Date().setDate(new Date().getDate() + 30)),
            status: data.status || 'draft',
            subtotal: data.subtotal || 0,
            tax_amount: data.tax_amount || 0,
            total_amount: data.total_amount || 0,
          });
          
          // Fetch invoice items
          const itemsData = await projectService.getInvoiceItems(id);
          setInvoiceItems(itemsData);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching invoice:', err);
          setError('Failed to fetch invoice data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchInvoice();
    }
  }, [id, isEditMode, projects]);
  
  // Fetch project tasks when project changes
  useEffect(() => {
    const fetchProjectTasks = async () => {
      if (selectedProject) {
        try {
          const tasksData = await projectService.getProjectTasks(selectedProject.id);
          setProjectTasks(tasksData);
        } catch (err) {
          console.error('Error fetching project tasks:', err);
          setError('Failed to fetch project tasks. Please try again.');
        }
      } else {
        setProjectTasks([]);
      }
    };
    
    fetchProjectTasks();
  }, [selectedProject]);
  
  // Update totals when invoice items change
  useEffect(() => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const taxAmount = invoiceItems.reduce((sum, item) => {
      const itemTax = Number(item.subtotal) * (Number(item.tax_rate) / 100);
      return sum + itemTax;
    }, 0);
    const totalAmount = subtotal + taxAmount;
    
    formik.setFieldValue('subtotal', subtotal);
    formik.setFieldValue('tax_amount', taxAmount);
    formik.setFieldValue('total_amount', totalAmount);
  }, [invoiceItems]);
  
  // Handle project selection
  const handleProjectChange = (event, value) => {
    setSelectedProject(value);
    formik.setFieldValue('project_id', value ? value.id : '');
  };
  
  // Handle add item button click
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0,
        tax_rate: 0,
        task_id: null
      }
    ]);
  };
  
  // Handle delete item button click
  const handleDeleteItem = (index) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };
  
  // Handle item field change
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    
    // Recalculate subtotal if quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].subtotal = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
    }
    
    setInvoiceItems(newItems);
  };
  
  // Handle task selection for an item
  const handleTaskSelection = (index, taskId) => {
    const newItems = [...invoiceItems];
    
    if (taskId) {
      const task = projectTasks.find(t => t.id === taskId);
      if (task) {
        // Pre-fill item with task information
        newItems[index].description = `Task: ${task.task_name}`;
        newItems[index].quantity = task.actual_hours;
        newItems[index].unit_price = task.hourly_rate;
        newItems[index].subtotal = Number(task.actual_hours) * Number(task.hourly_rate);
        newItems[index].task_id = taskId;
      }
    } else {
      newItems[index].task_id = null;
    }
    
    setInvoiceItems(newItems);
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/project-invoices');
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
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
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
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="project-select"
                options={projects}
                getOptionLabel={(option) => `${option.project_name} (${option.project_number})`}
                value={selectedProject}
                onChange={handleProjectChange}
                disabled={loading || isEditMode}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project"
                    error={formik.touched.project_id && Boolean(formik.errors.project_id)}
                    helperText={formik.touched.project_id && formik.errors.project_id}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="invoice_number"
                name="invoice_number"
                label="Invoice Number"
                value={formik.values.invoice_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.invoice_number && Boolean(formik.errors.invoice_number)}
                helperText={
                  (formik.touched.invoice_number && formik.errors.invoice_number) || 
                  "Leave blank to auto-generate"
                }
                disabled={loading || isEditMode}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Invoice Date"
                  value={formik.values.invoice_date}
                  onChange={(date) => formik.setFieldValue('invoice_date', date)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.invoice_date && Boolean(formik.errors.invoice_date),
                      helperText: formik.touched.invoice_date && formik.errors.invoice_date,
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={formik.values.due_date}
                  onChange={(date) => formik.setFieldValue('due_date', date)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.due_date && Boolean(formik.errors.due_date),
                      helperText: formik.touched.due_date && formik.errors.due_date
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Invoice Items */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Invoice Items
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                  disabled={loading}
                >
                  Add Item
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Task</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Tax Rate (%)</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No items added yet. Click "Add Item" to add an invoice item.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoiceItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              fullWidth
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              disabled={loading}
                              placeholder="Item description"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth disabled={loading}>
                              <Select
                                value={item.task_id || ''}
                                onChange={(e) => handleTaskSelection(index, e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {projectTasks.map((task) => (
                                  <MenuItem key={task.id} value={task.id}>
                                    {task.task_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: '100px' }}
                              InputProps={{
                                startAdornment: <span>$</span>,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.tax_rate}
                              onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)}
                              disabled={loading}
                              inputProps={{ min: 0, step: 0.1 }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.subtotal)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteItem(index)}
                              disabled={loading}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Summary rows */}
                    {invoiceItems.length > 0 && (
                      <>
                        <TableRow>
                          <TableCell colSpan={5} align="right">
                            <Typography variant="body1">Subtotal:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1">{formatCurrency(formik.values.subtotal)}</Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right">
                            <Typography variant="body1">Tax:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1">{formatCurrency(formik.values.tax_amount)}</Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} align="right">
                            <Typography variant="body1" fontWeight="bold">Total:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight="bold">{formatCurrency(formik.values.total_amount)}</Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </>
                    )}
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
                {loading ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProjectInvoiceForm;
