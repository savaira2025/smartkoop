import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import assetService from '../../services/assetService';

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    asset_number: '',
    category: '',
    acquisition_date: new Date(),
    acquisition_cost: '',
    current_value: '',
    depreciation_rate: '0.00',
    location: '',
    status: 'active',
    assigned_to: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await assetService.getAsset(id);
          
          // Format the date properly
          const formattedData = {
            ...data,
            acquisition_date: new Date(data.acquisition_date)
          };
          
          setFormData(formattedData);
        } catch (error) {
          console.error('Failed to fetch asset:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAsset();
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.asset_number.trim()) {
      newErrors.asset_number = 'Asset number is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.acquisition_date) {
      newErrors.acquisition_date = 'Acquisition date is required';
    }

    if (!formData.acquisition_cost) {
      newErrors.acquisition_cost = 'Acquisition cost is required';
    } else if (isNaN(parseFloat(formData.acquisition_cost)) || parseFloat(formData.acquisition_cost) < 0) {
      newErrors.acquisition_cost = 'Acquisition cost must be a positive number';
    }

    if (!formData.current_value) {
      newErrors.current_value = 'Current value is required';
    } else if (isNaN(parseFloat(formData.current_value)) || parseFloat(formData.current_value) < 0) {
      newErrors.current_value = 'Current value must be a positive number';
    }

    if (formData.depreciation_rate && (isNaN(parseFloat(formData.depreciation_rate)) || parseFloat(formData.depreciation_rate) < 0)) {
      newErrors.depreciation_rate = 'Depreciation rate must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      acquisition_date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Format the date to YYYY-MM-DD string
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      };

      // Format the data for API submission
      const submitData = {
        ...formData,
        acquisition_date: formatDate(formData.acquisition_date),
        acquisition_cost: parseFloat(formData.acquisition_cost),
        current_value: parseFloat(formData.current_value),
        depreciation_rate: parseFloat(formData.depreciation_rate || 0)
      };

      if (isEditMode) {
        await assetService.updateAsset(id, submitData);
      } else {
        await assetService.createAsset(submitData);
      }

      navigate('/assets');
    } catch (error) {
      console.error('Failed to save asset:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} asset. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Asset' : 'Add New Asset'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  required
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Number"
                  name="asset_number"
                  value={formData.asset_number}
                  onChange={handleChange}
                  error={Boolean(errors.asset_number)}
                  helperText={errors.asset_number || 'Unique identifier for the asset'}
                  required
                  margin="normal"
                  disabled={isEditMode} // Can't change asset number in edit mode
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={Boolean(errors.category)}
                  helperText={errors.category}
                  required
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Acquisition Date"
                    value={formData.acquisition_date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                        error={Boolean(errors.acquisition_date)}
                        helperText={errors.acquisition_date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Acquisition Cost"
                  name="acquisition_cost"
                  value={formData.acquisition_cost}
                  onChange={handleChange}
                  error={Boolean(errors.acquisition_cost)}
                  helperText={errors.acquisition_cost}
                  required
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Value"
                  name="current_value"
                  value={formData.current_value}
                  onChange={handleChange}
                  error={Boolean(errors.current_value)}
                  helperText={errors.current_value}
                  required
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Depreciation Rate"
                  name="depreciation_rate"
                  value={formData.depreciation_rate}
                  onChange={handleChange}
                  error={Boolean(errors.depreciation_rate)}
                  helperText={errors.depreciation_rate || 'Annual depreciation rate (%)'}
                  margin="normal"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="disposed">Disposed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Where the asset is located"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Person or department responsible for the asset"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/assets"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : isEditMode ? 'Update Asset' : 'Create Asset'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssetForm;
