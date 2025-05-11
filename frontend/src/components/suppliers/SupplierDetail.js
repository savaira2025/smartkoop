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
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import supplierService from '../../services/supplierService';

const SupplierDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch supplier data on component mount
  useEffect(() => {
    fetchSupplierData();
  }, [id]);
  
  // Fetch supplier data from API
  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch supplier details
      const supplierData = await supplierService.getSupplier(id);
      setSupplier(supplierData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching supplier data:', err);
      setError('Failed to fetch supplier data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/suppliers');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/suppliers/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchSupplierData();
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
          Back to Suppliers
        </Button>
      </Box>
    );
  }
  
  if (!supplier) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Supplier not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Suppliers
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
          Back to Suppliers
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
            Edit Supplier
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {supplier.name}
          </Typography>
          
          {renderStatusChip(supplier.status)}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Contact Person
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.contact_person || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.email || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.phone || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Website
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.website || 'N/A'}
                </Typography>
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
                  {supplier.payment_terms || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Tax ID
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.tax_id || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Industry
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.industry || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Created Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Address
            </Typography>
            
            <Typography variant="body2">
              {supplier.address || 'No address provided'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Notes
            </Typography>
            
            <Typography variant="body2">
              {supplier.notes || 'No notes available'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SupplierDetail;
