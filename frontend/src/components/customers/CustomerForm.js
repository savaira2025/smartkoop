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
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import customerService from '../../services/customerService';
import ContactEntry from './ContactEntry';

// Contact validation schema
const contactSchema = Yup.object({
  name: Yup.string().required('Contact name is required'),
  title: Yup.string().nullable(),
  email: Yup.string().email('Enter a valid email').nullable(),
  phone: Yup.string().nullable(),
  department: Yup.string().nullable(),
  is_primary: Yup.boolean(),
});

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  contact_person: Yup.string().nullable(),
  email: Yup.string().email('Enter a valid email').nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  payment_terms: Yup.string().nullable(),
  credit_limit: Yup.number().min(0, 'Must be a positive number').nullable(),
  tax_id: Yup.string().nullable(),
  status: Yup.string().required('Status is required'),
  contacts: Yup.array().of(contactSchema).min(1, 'At least one contact is required'),
});

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [contacts, setContacts] = useState([
    { name: '', title: '', email: '', phone: '', department: '', is_primary: true }
  ]);
  const [contactErrors, setContactErrors] = useState([{}]);
  
  // Initialize form with default values
  const formik = useFormik({
    initialValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      payment_terms: 'Net 30',
      credit_limit: 0,
      tax_id: '',
      status: 'active',
      contacts: [
        { name: '', title: '', email: '', phone: '', department: '', is_primary: true }
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        if (isEditMode) {
          // Update existing customer
          await customerService.updateCustomer(id, values);
          setSuccess('Customer updated successfully');
        } else {
          // Create new customer
          await customerService.createCustomer(values);
          setSuccess('Customer created successfully');
          
          // Reset form and contacts
          formik.resetForm();
          const defaultContacts = [{ name: '', title: '', email: '', phone: '', department: '', is_primary: true }];
          setContacts(defaultContacts);
          setContactErrors([{}]);
          formik.setFieldValue('contacts', defaultContacts);
        }
        
        setLoading(false);
        
        // Navigate back to customer list after a short delay
        setTimeout(() => {
          navigate('/customers');
        }, 1500);
      } catch (err) {
        console.error('Error saving customer:', err);
        setError('Failed to save customer. Please try again.');
        setLoading(false);
      }
    },
  });
  
  // Fetch customer data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const data = await customerService.getCustomer(id);
          
          // Handle contacts data
          const customerContacts = data.contacts && data.contacts.length > 0 
            ? data.contacts 
            : [{ name: '', title: '', email: '', phone: '', department: '', is_primary: true }];
          
          setContacts(customerContacts);
          setContactErrors(customerContacts.map(() => ({})));
          
          // Update form values with customer data
          formik.setValues({
            name: data.name || '',
            contact_person: data.contact_person || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            payment_terms: data.payment_terms || 'Net 30',
            credit_limit: data.credit_limit || 0,
            tax_id: data.tax_id || '',
            status: data.status || 'active',
            contacts: customerContacts,
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching customer:', err);
          setError('Failed to fetch customer data. Please try again.');
          setLoading(false);
        }
      };
      
      fetchCustomer();
    }
  }, [id, isEditMode]);
  
  // Contact management functions
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
    formik.setFieldValue('contacts', updatedContacts);
  };

  const handleContactPrimaryChange = (index, isPrimary) => {
    const updatedContacts = [...contacts];
    // If setting as primary, unset all others
    if (isPrimary) {
      updatedContacts.forEach((contact, i) => {
        contact.is_primary = i === index;
      });
    } else {
      updatedContacts[index].is_primary = false;
    }
    setContacts(updatedContacts);
    formik.setFieldValue('contacts', updatedContacts);
  };

  const handleAddContact = () => {
    const newContact = { name: '', title: '', email: '', phone: '', department: '', is_primary: false };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    setContactErrors([...contactErrors, {}]);
    formik.setFieldValue('contacts', updatedContacts);
  };

  const handleRemoveContact = (index) => {
    if (contacts.length > 1) {
      const updatedContacts = contacts.filter((_, i) => i !== index);
      const updatedErrors = contactErrors.filter((_, i) => i !== index);
      
      // If removing primary contact, set first contact as primary
      if (contacts[index].is_primary && updatedContacts.length > 0) {
        updatedContacts[0].is_primary = true;
      }
      
      setContacts(updatedContacts);
      setContactErrors(updatedErrors);
      formik.setFieldValue('contacts', updatedContacts);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/customers');
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Edit Customer' : 'Create New Customer'}
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
                label="Company Name"
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
                id="contact_person"
                name="contact_person"
                label="Contact Person"
                value={formik.values.contact_person}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                helperText={formik.touched.contact_person && formik.errors.contact_person}
                disabled={loading}
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Business Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Business Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
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
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="credit_limit"
                name="credit_limit"
                label="Credit Limit"
                type="number"
                value={formik.values.credit_limit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.credit_limit && Boolean(formik.errors.credit_limit)}
                helperText={formik.touched.credit_limit && formik.errors.credit_limit}
                disabled={loading}
                InputProps={{
                  startAdornment: <span>Rp</span>,
                }}
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
              />
            </Grid>
            
            {/* Contact Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Contact Information (PIC)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddContact}
                  disabled={loading}
                  size="small"
                >
                  Add Contact
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              {contacts.map((contact, index) => (
                <ContactEntry
                  key={index}
                  contact={contact}
                  index={index}
                  onChange={handleContactChange}
                  onRemove={handleRemoveContact}
                  onPrimaryChange={handleContactPrimaryChange}
                  errors={contactErrors[index] || {}}
                  disabled={loading}
                  showRemove={contacts.length > 1}
                />
              ))}
              
              {formik.touched.contacts && formik.errors.contacts && typeof formik.errors.contacts === 'string' && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formik.errors.contacts}
                </Alert>
              )}
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
                {loading ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
