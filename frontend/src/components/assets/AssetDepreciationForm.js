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
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import assetService from '../../services/assetService';

const AssetDepreciationForm = () => {
  const { assetId, depreciationId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(depreciationId);

  const [asset, setAsset] = useState(null);
  const [formData, setFormData] = useState({
    asset_id: parseInt(assetId),
    depreciation_date: new Date(),
    depreciation_amount: '',
    book_value_after: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the asset to get current value
        const assetData = await assetService.getAsset(assetId);
        setAsset(assetData);
        
        if (isEditMode) {
          // If editing, fetch the depreciation entry
          const depreciationData = await assetService.getAssetDepreciation(depreciationId);
          
          // Format the date properly
          const formattedData = {
            ...depreciationData,
            depreciation_date: new Date(depreciationData.depreciation_date)
          };
          
          setFormData(formattedData);
        } else {
          // If creating new, set default depreciation amount based on asset's current value and depreciation rate
          const currentValue = parseFloat(assetData.current_value);
          const depreciationRate = parseFloat(assetData.depreciation_rate) / 100; // Convert percentage to decimal
          const calculatedDepreciation = currentValue * depreciationRate;
          const calculatedBookValue = currentValue - calculatedDepreciation;
          
          setFormData({
            ...formData,
            depreciation_amount: calculatedDepreciation.toFixed(2),
            book_value_after: calculatedBookValue.toFixed(2)
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assetId, depreciationId, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.depreciation_date) {
      newErrors.depreciation_date = 'Depreciation date is required';
    }

    if (!formData.depreciation_amount) {
      newErrors.depreciation_amount = 'Depreciation amount is required';
    } else if (isNaN(parseFloat(formData.depreciation_amount)) || parseFloat(formData.depreciation_amount) < 0) {
      newErrors.depreciation_amount = 'Depreciation amount must be a positive number';
    }

    if (!formData.book_value_after) {
      newErrors.book_value_after = 'Book value after depreciation is required';
    } else if (isNaN(parseFloat(formData.book_value_after)) || parseFloat(formData.book_value_after) < 0) {
      newErrors.book_value_after = 'Book value must be a positive number';
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

    // If depreciation_amount changes, recalculate book_value_after
    if (name === 'depreciation_amount' && asset) {
      const depreciationAmount = parseFloat(value) || 0;
      
      // If editing, we need to use the current value before this depreciation
      // If creating new, we use the asset's current value
      let baseValue;
      if (isEditMode) {
        // For editing, we need to add back the current depreciation amount to get the value before depreciation
        baseValue = parseFloat(formData.book_value_after) + parseFloat(formData.depreciation_amount);
      } else {
        baseValue = parseFloat(asset.current_value);
      }
      
      const newBookValue = baseValue - depreciationAmount;
      
      setFormData((prev) => ({
        ...prev,
        book_value_after: newBookValue.toFixed(2)
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      depreciation_date: date
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
        depreciation_date: formatDate(formData.depreciation_date),
        depreciation_amount: parseFloat(formData.depreciation_amount),
        book_value_after: parseFloat(formData.book_value_after)
      };

      if (isEditMode) {
        await assetService.updateAssetDepreciation(depreciationId, submitData);
      } else {
        await assetService.createAssetDepreciation(assetId, submitData);
      }

      navigate(`/assets/${assetId}`);
    } catch (error) {
      console.error('Failed to save depreciation entry:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} depreciation entry. Please try again.`);
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
          {isEditMode ? 'Edit Depreciation Entry' : 'Add Depreciation Entry'}
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
                    label="Depreciation Date"
                    value={formData.depreciation_date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                        error={Boolean(errors.depreciation_date)}
                        helperText={errors.depreciation_date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Depreciation Amount"
                  name="depreciation_amount"
                  value={formData.depreciation_amount}
                  onChange={handleChange}
                  error={Boolean(errors.depreciation_amount)}
                  helperText={errors.depreciation_amount}
                  required
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Book Value After Depreciation"
                  name="book_value_after"
                  value={formData.book_value_after}
                  onChange={handleChange}
                  error={Boolean(errors.book_value_after)}
                  helperText={errors.book_value_after}
                  required
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
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
                    {submitting ? 'Saving...' : isEditMode ? 'Update Depreciation' : 'Create Depreciation'}
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

export default AssetDepreciationForm;
