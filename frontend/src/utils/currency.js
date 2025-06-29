/**
 * Currency utilities for Indonesian Rupiah (IDR)
 * Uses Indonesian locale (id-ID) with no decimal places
 */

/**
 * Format amount as Indonesian Rupiah currency
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return 'Rp 0';
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return 'Rp 0';
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

/**
 * Format number for display in Indonesian locale (without currency symbol)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted number string (e.g., "1.000.000")
 */
export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return '0';
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0';
  }
  
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

/**
 * Parse Indonesian formatted number string to numeric value
 * @param {string} formattedAmount - Indonesian formatted number (e.g., "1.000.000")
 * @returns {number} Numeric value
 */
export const parseCurrency = (formattedAmount) => {
  if (!formattedAmount || typeof formattedAmount !== 'string') {
    return 0;
  }
  
  // Remove currency symbol and spaces
  let cleanAmount = formattedAmount.replace(/Rp\s?/g, '');
  
  // Remove thousand separators (periods in Indonesian format)
  cleanAmount = cleanAmount.replace(/\./g, '');
  
  // Convert to number
  const numericValue = parseFloat(cleanAmount);
  
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Currency configuration constants
 */
export const CURRENCY_CONFIG = {
  symbol: 'Rp',
  code: 'IDR',
  locale: 'id-ID',
  decimals: 0,
  name: 'Indonesian Rupiah'
};

/**
 * Default exchange rate for USD to IDR conversion
 * Used for data migration purposes
 */
export const USD_TO_IDR_RATE = 15500;
