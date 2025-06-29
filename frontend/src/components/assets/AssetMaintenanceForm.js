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

const AssetMaintenanceForm = () => {
  const { assetId, maintenanceId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(maintenanceId);

  const [asset, setAsset] = useState(null);
  const [formData, setFormData] = useState({
    asset_id: parseInt(assetId),
    maintenance_date: new Date(),
    maintenance_type: 'Preventive',
    cost: '',
    description: '',
    performed_by: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the asset
        const assetData = await assetService.getAsset(assetId);
        setAsset(assetData);
        
        if (isEditMode) {
          // If editing, fetch the maintenance record
          const maintenanceData = await assetService.getAssetMaintenance(maintenanceId);
          
          // Format the date properly
          const formattedData = {
            ...maintenanceData,
            maintenance_date: new Date(maintenanceData.maintenance_date)
          };
          
          setFormData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetId, maintenanceId, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.maintenance_date) {
      newErrors.maintenance_date = 'Maintenance date is required';
    }

    if (!formData.maintenance_type) {
      newErrors.maintenance_type = 'Maintenance type is required';
    }

    if (formData.cost && (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) < 0)) {
      newErrors.cost = 'Cost must be a positive number';
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
      maintenance_date: date
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
        maintenance_date: formatDate(formData.maintenance_date),
        cost: formData.cost ? parseFloat(formData.cost) : 0
      };

      if (isEditMode) {
        await assetService.updateAssetMaintenance(maintenanceId, submitData);
      } else {
        await assetService.createAssetMaintenance(assetId, submitData);
      }

      navigate(`/assets/${assetId}`);
    } catch (error) {
      console.error('Failed to save maintenance record:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} maintenance record. Please try again.`);
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
          {isEditMode ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
        </Typography>
        {asset && (
          <Typography variant="subtitle1" gutterBottom>
            Asset: {asset.name} ({asset.asset_number})
          </Typography>
        )}
      </Box>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Maintenance Date"
                    value={formData.maintenance_date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                        error={Boolean(errors.maintenance_date)}
                        helperText={errors.maintenance_date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="maintenance-type-label">Maintenance Type</InputLabel>
                  <Select
                    labelId="maintenance-type-label"
                    name="maintenance_type"
                    value={formData.maintenance_type}
                    onChange={handleChange}
                    label="Maintenance Type"
                    error={Boolean(errors.maintenance_type)}
                  >
                    <MenuItem value="Preventive">Preventive</MenuItem>
                    <MenuItem value="Corrective">Corrective</MenuItem>
                    <MenuItem value="Predictive">Predictive</MenuItem>
                    <MenuItem value="Condition-based">Condition-based</MenuItem>
                    <MenuItem value="Breakdown">Breakdown</MenuItem>
                  </Select>
                  {errors.maintenance_type && (
                    <FormHelperText error>{errors.maintenance_type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  error={Boolean(errors.cost)}
                  helperText={errors.cost}
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
                  label="Performed By"
                  name="performed_by"
                  value={formData.performed_by}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Person or team who performed the maintenance"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  helperText="Detailed description of the maintenance performed"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    component={RouterLink}
                    to={`/assets/${assetId}`}
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
                    {submitting ? 'Saving...' : isEditMode ? 'Update Maintenance' : 'Create Maintenance'}
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

export default AssetMaintenanceForm;
