import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { formatNumber, parseCurrency } from '../../utils/currency';

/**
 * Currency input component for Indonesian Rupiah (IDR)
 * Handles Indonesian number formatting with "Rp" prefix
 */
const CurrencyInput = ({
  value,
  onChange,
  name,
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  ...otherProps
}) => {
  const handleChange = (event) => {
    const inputValue = event.target.value;
    
    // Remove non-numeric characters except periods (thousand separators)
    const cleanValue = inputValue.replace(/[^\d.]/g, '');
    
    // Parse to numeric value
    const numericValue = parseCurrency(cleanValue);
    
    // Call onChange with the numeric value
    if (onChange) {
      onChange({
        ...event,
        target: {
          ...event.target,
          name: name,
          value: numericValue
        }
      });
    }
  };

  // Format the display value
  const displayValue = value ? formatNumber(value) : '';

  return (
    <TextField
      {...otherProps}
      name={name}
      label={label}
      value={displayValue}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
        ...otherProps.InputProps
      }}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9.]*',
        ...otherProps.inputProps
      }}
    />
  );
};

export default CurrencyInput;
