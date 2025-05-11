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
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import supplierService from '../../services/supplierService';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_person: Yup.string(),
  email: Yup.string().email('Invalid email format'),
  phone: Yup.string(),
  address: Yup.string(),
  payment_terms: Yup.string(),
  status: Yup.string().required('Status is required'),
  tax_id: Yup.string(),
  website: Yup.string().url('Invalid URL format'),
  industry: Yup.string(),
  notes: Yup.string()
});

const SupplierForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      payment_terms: '',
      status: 'active',
      tax_id: '',
      website: '',
      industry: '',
      notes: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        if (isEditMode) {
          // Update existing supplier
          await supplierService.updateSupplier(id, values);
          setSuccess('Supplier updated successfully');
        } else {
          // Create new supplier
          await supplierService.createSupplier(values);
          setSuccess('Supplier created successfully');
          formik.resetForm();
        }
        
        setLoading(false);
        
        // Navigate back to supplier list after a short delay
        setTimeout(() => {
          navigate('/suppliers');
        }, 1500);
      } catch (err) {
        console.error('Error saving supplier:', err);
        setError('Failed to save supplier. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch supplier data if in edit mode
  useEffect(() => {
    const fetchSupplierData = async () => {
      if (isEditMode) {
        try {
          const supplierData = await supplierService.getSupplier(id);
          
          // Update form values with supplier data
          formik.setValues({
            name: supplierData.name || '',
            contact_person: supplierData.contact_person || '',
            email: supplierData.email || '',
            phone: supplierData.phone || '',
            address: supplierData.address || '',
            payment_terms: supplierData.payment_terms || '',
            status: supplierData.status || 'active',
            tax_id: supplierData.tax_id || '',
            website: supplierData.website || '',
            industry: supplierData.industry || '',
            notes: supplierData.notes || ''
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching supplier data:', err);
          setError('Failed to fetch supplier data. Please try again.');
          setLoading(false);
        }
      }
    };
    
    fetchSupplierData();
  }, [id, isEditMode]);
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/suppliers');
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Supplier' : 'Create New Supplier'}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Supplier Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  disabled={loading}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography variant="caption" color="error">
                    {formik.errors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="contact_person"
                name="contact_person"
                label="Contact Person"
                value={formik.values.contact_person}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                helperText={formik.touched.contact_person && formik.errors.contact_person}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="website"
                name="website"
                label="Website"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Business Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="payment_terms"
                name="payment_terms"
                label="Payment Terms"
                value={formik.values.payment_terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.payment_terms && Boolean(formik.errors.payment_terms)}
                helperText={formik.touched.payment_terms && formik.errors.payment_terms}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="tax_id"
                name="tax_id"
                label="Tax ID"
                value={formik.values.tax_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tax_id && Boolean(formik.errors.tax_id)}
                helperText={formik.touched.tax_id && formik.errors.tax_id}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="industry"
                name="industry"
                label="Industry"
                value={formik.values.industry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.industry && Boolean(formik.errors.industry)}
                helperText={formik.touched.industry && formik.errors.industry}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
                disabled={loading}
                margin="normal"
              />
            </Grid>
            
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
                {loading ? 'Saving...' : isEditMode ? 'Update Supplier' : 'Create Supplier'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SupplierForm;
