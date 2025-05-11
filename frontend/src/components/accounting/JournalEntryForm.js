import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import accountingService from '../../services/accountingService';

const JournalEntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    entry_number: '',
    entry_date: new Date(),
    description: '',
    entry_type: 'manual',
    status: 'draft',
    fiscal_period_id: '',
    ledger_entries: []
  });

  const [accounts, setAccounts] = useState([]);
  const [fiscalPeriods, setFiscalPeriods] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch chart of accounts
        const accountsData = await accountingService.getChartOfAccounts();
        setAccounts(accountsData);
        
        // Fetch fiscal periods
        const periodsData = await accountingService.getFiscalPeriods();
        setFiscalPeriods(periodsData);
        
        // If in edit mode, fetch the journal entry
        if (isEditMode) {
          const entryData = await accountingService.getJournalEntry(id);
          
          // Fetch ledger entries for this journal entry
          const ledgerEntries = await accountingService.getLedgerEntries(id);
          
          setFormData({
            ...entryData,
            entry_date: new Date(entryData.entry_date),
            ledger_entries: ledgerEntries
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.entry_number.trim()) {
      newErrors.entry_number = 'Entry number is required';
    }

    if (!formData.entry_date) {
      newErrors.entry_date = 'Entry date is required';
    }

    if (!formData.entry_type.trim()) {
      newErrors.entry_type = 'Entry type is required';
    }

    if (!formData.fiscal_period_id) {
      newErrors.fiscal_period_id = 'Fiscal period is required';
    }

    // Validate ledger entries
    if (formData.ledger_entries.length === 0) {
      newErrors.ledger_entries = 'At least one ledger entry is required';
    } else {
      let totalDebits = 0;
      let totalCredits = 0;
      
      formData.ledger_entries.forEach((entry, index) => {
        if (!entry.account_id) {
          newErrors[`ledger_entries[${index}].account_id`] = 'Account is required';
        }
        
        totalDebits += parseFloat(entry.debit_amount || 0);
        totalCredits += parseFloat(entry.credit_amount || 0);
      });
      
      // Check if debits equal credits
      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        newErrors.balance = 'Total debits must equal total credits';
      }
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
      entry_date: date
    }));
  };

  const handleLedgerEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.ledger_entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    
    setFormData((prev) => ({
      ...prev,
      ledger_entries: updatedEntries
    }));
  };

  const handleAddLedgerEntry = () => {
    setFormData((prev) => ({
      ...prev,
      ledger_entries: [
        ...prev.ledger_entries,
        {
          journal_entry_id: id || 0,
          account_id: '',
          debit_amount: 0,
          credit_amount: 0,
          description: ''
        }
      ]
    }));
  };

  const handleRemoveLedgerEntry = (index) => {
    const updatedEntries = [...formData.ledger_entries];
    updatedEntries.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      ledger_entries: updatedEntries
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (isEditMode) {
        // Update journal entry
        const { ledger_entries, ...journalEntryData } = formData;
        await accountingService.updateJournalEntry(id, journalEntryData);
        
        // Handle ledger entries
        for (const entry of ledger_entries) {
          if (entry.id) {
            // Update existing ledger entry
            await accountingService.updateLedgerEntry(entry.id, entry);
          } else {
            // Create new ledger entry
            await accountingService.createLedgerEntry(id, entry);
          }
        }
      } else {
        // Create new journal entry
        const { ledger_entries, ...journalEntryData } = formData;
        const newEntry = await accountingService.createJournalEntry(journalEntryData);
        
        // Create ledger entries
        for (const entry of ledger_entries) {
          await accountingService.createLedgerEntry(newEntry.id, {
            ...entry,
            journal_entry_id: newEntry.id
          });
        }
      }

      navigate('/accounting/journal');
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} journal entry. Please try again.`);
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
          {isEditMode ? 'Edit Journal Entry' : 'Add New Journal Entry'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Entry Number"
                  name="entry_number"
                  value={formData.entry_number}
                  onChange={handleChange}
                  error={Boolean(errors.entry_number)}
                  helperText={errors.entry_number}
                  required
                  margin="normal"
                  disabled={isEditMode} // Can't change entry number in edit mode
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Entry Date"
                    value={formData.entry_date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                        error={Boolean(errors.entry_date)}
                        helperText={errors.entry_date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" error={Boolean(errors.entry_type)}>
                  <InputLabel id="entry-type-label">Entry Type</InputLabel>
                  <Select
                    labelId="entry-type-label"
                    name="entry_type"
                    value={formData.entry_type}
                    onChange={handleChange}
                    label="Entry Type"
                    required
                  >
                    <MenuItem value="manual">Manual</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                    <MenuItem value="adjustment">Adjustment</MenuItem>
                  </Select>
                  {errors.entry_type && <FormHelperText>{errors.entry_type}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" error={Boolean(errors.status)}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="posted">Posted</MenuItem>
                    <MenuItem value="reversed">Reversed</MenuItem>
                  </Select>
                  {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" error={Boolean(errors.fiscal_period_id)}>
                  <InputLabel id="fiscal-period-label">Fiscal Period</InputLabel>
                  <Select
                    labelId="fiscal-period-label"
                    name="fiscal_period_id"
                    value={formData.fiscal_period_id}
                    onChange={handleChange}
                    label="Fiscal Period"
                    required
                  >
                    {fiscalPeriods.map((period) => (
                      <MenuItem key={period.id} value={period.id}>
                        {period.period_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.fiscal_period_id && <FormHelperText>{errors.fiscal_period_id}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Ledger Entries</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddLedgerEntry}
                  >
                    Add Entry
                  </Button>
                </Box>

                {errors.ledger_entries && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {errors.ledger_entries}
                  </Typography>
                )}

                {errors.balance && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {errors.balance}
                  </Typography>
                )}

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Account</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Debit</TableCell>
                        <TableCell align="right">Credit</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.ledger_entries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No ledger entries. Click "Add Entry" to add one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        formData.ledger_entries.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <FormControl 
                                fullWidth 
                                error={Boolean(errors[`ledger_entries[${index}].account_id`])}
                              >
                                <Select
                                  value={entry.account_id}
                                  onChange={(e) => handleLedgerEntryChange(index, 'account_id', e.target.value)}
                                  displayEmpty
                                  size="small"
                                >
                                  <MenuItem value="" disabled>Select Account</MenuItem>
                                  {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                      {account.account_number} - {account.account_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[`ledger_entries[${index}].account_id`] && (
                                  <FormHelperText>
                                    {errors[`ledger_entries[${index}].account_id`]}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                size="small"
                                value={entry.description || ''}
                                onChange={(e) => handleLedgerEntryChange(index, 'description', e.target.value)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                size="small"
                                value={entry.debit_amount || 0}
                                onChange={(e) => handleLedgerEntryChange(index, 'debit_amount', e.target.value)}
                                InputProps={{
                                  inputProps: { min: 0, step: 0.01 }
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                size="small"
                                value={entry.credit_amount || 0}
                                onChange={(e) => handleLedgerEntryChange(index, 'credit_amount', e.target.value)}
                                InputProps={{
                                  inputProps: { min: 0, step: 0.01 }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveLedgerEntry(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      {formData.ledger_entries.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={2} align="right">
                            <Typography variant="subtitle1">Total:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              ${formData.ledger_entries.reduce((sum, entry) => sum + parseFloat(entry.debit_amount || 0), 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1">
                              ${formData.ledger_entries.reduce((sum, entry) => sum + parseFloat(entry.credit_amount || 0), 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/accounting/journal"
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
                    {submitting ? 'Saving...' : isEditMode ? 'Update Journal Entry' : 'Create Journal Entry'}
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

export default JournalEntryForm;
