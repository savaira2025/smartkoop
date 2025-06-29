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
  Divider 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import memberService from '../../services/memberService';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  status: Yup.string().required('Status is required'),
  registration_method: Yup.string().required('Registration method is required'),
  principal_savings: Yup.number().min(0, 'Must be a positive number').nullable(),
  mandatory_savings: Yup.number().min(0, 'Must be a positive number').nullable(),
  voluntary_savings: Yup.number().min(0, 'Must be a positive number').nullable(),
});

const MemberForm = () => {
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
      email: '',
      phone: '',
      address: '',
      join_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      status: 'calon_anggota',
      registration_method: 'web',
      principal_savings: 0,
      mandatory_savings: 0,
      voluntary_savings: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        if (isEditMode) {
          // Update existing member
          await memberService.updateMember(id, values);
          setSuccess('Member updated successfully');
        } else {
          // Create new member
          await memberService.createMember(values);
          setSuccess('Member created successfully');
          formik.resetForm();
        }
        
        setLoading(false);
        
        // Navigate back to member list after a short delay
        setTimeout(() => {
          navigate('/members');
        }, 1500);
      } catch (err) {
        console.error('Error saving member:', err);
        setError('Failed to save member. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch member data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMember = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const data = await memberService.getMember(id);
          
          // Update form values with member data
          formik.setValues({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            join_date: data.join_date ? new Date(data.join_date).toISOString().split('T')[0] : '',
            status: data.status || 'calon_anggota',
            registration_method: data.registration_method || 'web',
            principal_savings: data.principal_savings || 0,
            mandatory_savings: data.mandatory_savings || 0,
            voluntary_savings: data.voluntary_savings || 0,
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching member:', err);
          setError('Failed to fetch member data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchMember();
    }
  }, [id, isEditMode]);
  
  // Handle cancel button click
  const handleCancel = () => {
    navigate('/members');
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Member' : 'Create New Member'}
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
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={loading}
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
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="join_date"
                name="join_date"
                label="Join Date"
                type="date"
                value={formik.values.join_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.join_date && Boolean(formik.errors.join_date)}
                helperText={formik.touched.join_date && formik.errors.join_date}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
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
                  <MenuItem value="calon_anggota">Calon Anggota</MenuItem>
                  <MenuItem value="anggota">Anggota</MenuItem>
                  <MenuItem value="pengurus">Pengurus</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel id="registration-method-label">Registration Method</InputLabel>
                <Select
                  labelId="registration-method-label"
                  id="registration_method"
                  name="registration_method"
                  value={formik.values.registration_method}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.registration_method && Boolean(formik.errors.registration_method)}
                  label="Registration Method"
                >
                  <MenuItem value="web">Web</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="office">Office</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Savings Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Savings Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="principal_savings"
                name="principal_savings"
                label="Principal Savings"
                type="number"
                value={formik.values.principal_savings}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.principal_savings && Boolean(formik.errors.principal_savings)}
                helperText={formik.touched.principal_savings && formik.errors.principal_savings}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>Rp</span>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="mandatory_savings"
                name="mandatory_savings"
                label="Mandatory Savings"
                type="number"
                value={formik.values.mandatory_savings}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mandatory_savings && Boolean(formik.errors.mandatory_savings)}
                helperText={formik.touched.mandatory_savings && formik.errors.mandatory_savings}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>Rp</span>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="voluntary_savings"
                name="voluntary_savings"
                label="Voluntary Savings"
                type="number"
                value={formik.values.voluntary_savings}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.voluntary_savings && Boolean(formik.errors.voluntary_savings)}
                helperText={formik.touched.voluntary_savings && formik.errors.voluntary_savings}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>Rp</span>,
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
                {loading ? 'Saving...' : isEditMode ? 'Update Member' : 'Create Member'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default MemberForm;
