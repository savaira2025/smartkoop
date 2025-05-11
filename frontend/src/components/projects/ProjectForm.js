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
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import projectService from '../../services/projectService';
import customerService from '../../services/customerService';

// Validation schema
const validationSchema = Yup.object({
  project_name: Yup.string().required('Project name is required'),
  project_number: Yup.string().nullable(),
  customer_id: Yup.number().required('Customer is required'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date().nullable(),
  status: Yup.string().required('Status is required'),
  budget_amount: Yup.number().min(0, 'Must be a positive number').nullable(),
  description: Yup.string().nullable(),
});

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      project_name: '',
      project_number: '',
      customer_id: '',
      start_date: new Date(),
      end_date: null,
      status: 'active',
      budget_amount: 0,
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        // Convert dates to ISO strings
        const formattedValues = {
          ...values,
          start_date: values.start_date.toISOString().split('T')[0],
          end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null,
        };
        
        if (isEditMode) {
          // Update existing project
          await projectService.updateProject(id, formattedValues);
          setSuccess('Project updated successfully');
        } else {
          // Create new project
          await projectService.createProject(formattedValues);
          setSuccess('Project created successfully');
          formik.resetForm();
        }
        
        setLoading(false);
        
        // Navigate back to project list after a short delay
        setTimeout(() => {
          navigate('/projects');
        }, 1500);
      } catch (err) {
        console.error('Error saving project:', err);
        setError('Failed to save project. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customerService.getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customers. Please try again.');
      }
    };
    
    fetchCustomers();
  }, []);
  
  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const data = await projectService.getProject(id);
          
          // Find the selected customer
          if (data.customer_id && customers.length > 0) {
            const customer = customers.find(c => c.id === data.customer_id);
            setSelectedCustomer(customer || null);
          }
          
          // Update form values with project data
          formik.setValues({
            project_name: data.project_name || '',
            project_number: data.project_number || '',
            customer_id: data.customer_id || '',
            start_date: data.start_date ? new Date(data.start_date) : new Date(),
            end_date: data.end_date ? new Date(data.end_date) : null,
            status: data.status || 'active',
            budget_amount: data.budget_amount || 0,
            description: data.description || '',
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching project:', err);
          setError('Failed to fetch project data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [id, isEditMode, customers]);
  
  // Handle customer selection
  const handleCustomerChange = (event, value) => {
    setSelectedCustomer(value);
    formik.setFieldValue('customer_id', value ? value.id : '');
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/projects');
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Project' : 'Create New Project'}
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
              <TextField
                fullWidth
                id="project_name"
                name="project_name"
                label="Project Name"
                value={formik.values.project_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.project_name && Boolean(formik.errors.project_name)}
                helperText={formik.touched.project_name && formik.errors.project_name}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="project_number"
                name="project_number"
                label="Project Number"
                value={formik.values.project_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.project_number && Boolean(formik.errors.project_number)}
                helperText={
                  (formik.touched.project_number && formik.errors.project_number) || 
                  "Leave blank to auto-generate"
                }
                disabled={loading || isEditMode}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="customer-select"
                options={customers}
                getOptionLabel={(option) => option.name}
                value={selectedCustomer}
                onChange={handleCustomerChange}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    error={formik.touched.customer_id && Boolean(formik.errors.customer_id)}
                    helperText={formik.touched.customer_id && formik.errors.customer_id}
                    required
                  />
                )}
              />
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.start_date}
                  onChange={(date) => formik.setFieldValue('start_date', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                      helperText={formik.touched.start_date && formik.errors.start_date}
                      required
                    />
                  )}
                  disabled={loading}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formik.values.end_date}
                  onChange={(date) => formik.setFieldValue('end_date', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                      helperText={formik.touched.end_date && formik.errors.end_date}
                    />
                  )}
                  disabled={loading}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
              />
            </Grid>
            
            {/* Financial Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Financial Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="budget_amount"
                name="budget_amount"
                label="Budget Amount"
                type="number"
                value={formik.values.budget_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.budget_amount && Boolean(formik.errors.budget_amount)}
                helperText={formik.touched.budget_amount && formik.errors.budget_amount}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
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
                {loading ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProjectForm;
