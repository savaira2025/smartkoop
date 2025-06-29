import React from 'react';
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ContactEntry = ({ 
  contact, 
  index, 
  onChange, 
  onRemove, 
  onPrimaryChange,
  errors = {},
  disabled = false,
  showRemove = true 
}) => {
  const handleFieldChange = (field) => (event) => {
    onChange(index, field, event.target.value);
  };

  const handlePrimaryChange = (event) => {
    onPrimaryChange(index, event.target.checked);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <Paper sx={{ p: 2, mb: 2, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="primary">
          Contact {index + 1}
        </Typography>
        {showRemove && (
          <IconButton
            onClick={handleRemove}
            color="error"
            size="small"
            disabled={disabled}
            aria-label={`Remove contact ${index + 1}`}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            value={contact.name || ''}
            onChange={handleFieldChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            disabled={disabled}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title/Position"
            value={contact.title || ''}
            onChange={handleFieldChange('title')}
            error={Boolean(errors.title)}
            helperText={errors.title}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={contact.email || ''}
            onChange={handleFieldChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            value={contact.phone || ''}
            onChange={handleFieldChange('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Department"
            value={contact.department || ''}
            onChange={handleFieldChange('department')}
            error={Boolean(errors.department)}
            helperText={errors.department}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={contact.is_primary || false}
                onChange={handlePrimaryChange}
                disabled={disabled}
                color="primary"
              />
            }
            label="Primary Contact"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContactEntry;
