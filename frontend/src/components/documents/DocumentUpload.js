import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  FormHelperText, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography,
  Alert,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DocumentUpload = ({ 
  onUpload, 
  loading = false, 
  error = null,
  documentTypes = ['Contract', 'Invoice', 'Receipt', 'Report', 'Other'],
  entityTypes = ['Member', 'Customer', 'Supplier', 'Asset', 'Other']
}) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    document_type: '',
    related_entity_type: '',
    related_entity_id: '',
    description: '',
    tags: [],
    expiry_date: null
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill name with file name if not already set
      if (!formData.name) {
        setFormData({
          ...formData,
          name: selectedFile.name
        });
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      expiry_date: date
    });
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyDown = (event) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!file) {
      newErrors.file = 'Please select a file to upload';
    }
    
    if (!formData.name) {
      newErrors.name = 'Document name is required';
    }
    
    if (!formData.document_type) {
      newErrors.document_type = 'Document type is required';
    }
    
    if (formData.related_entity_type && !formData.related_entity_id) {
      newErrors.related_entity_id = 'Entity ID is required when entity type is selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Prepare data for upload
      const uploadData = {
        ...formData,
        tags: formData.tags.join(',')
      };
      
      if (onUpload) {
        onUpload(file, uploadData);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Upload Document
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  border: '2px dashed #ccc', 
                  borderRadius: 1, 
                  p: 3, 
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {file ? file.name : 'Drag & drop a file here or click to browse'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {file 
                    ? `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB` 
                    : 'Supported file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG'}
                </Typography>
                {errors.file && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.file}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Document Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.document_type}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleInputChange}
                  label="Document Type"
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.document_type && (
                  <FormHelperText>{errors.document_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Related Entity Type</InputLabel>
                <Select
                  name="related_entity_type"
                  value={formData.related_entity_type}
                  onChange={handleInputChange}
                  label="Related Entity Type"
                >
                  <MenuItem value="">None</MenuItem>
                  {entityTypes.map((type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Related Entity ID"
                name="related_entity_id"
                value={formData.related_entity_id}
                onChange={handleInputChange}
                disabled={!formData.related_entity_type}
                error={!!errors.related_entity_id}
                helperText={errors.related_entity_id}
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry Date (Optional)"
                  value={formData.expiry_date}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags and press Enter"
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  sx={{ minWidth: 'auto', height: 56 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              {formData.tags.length > 0 && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 1, 
                    p: 1, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5 
                  }}
                >
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Paper>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/documents')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<UploadIcon />}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUpload;
