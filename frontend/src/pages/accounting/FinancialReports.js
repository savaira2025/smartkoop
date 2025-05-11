import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PictureAsPdf as PdfIcon, TableChart as ExcelIcon } from '@mui/icons-material';

const FinancialReports = () => {
  const [reportType, setReportType] = React.useState('income');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [fiscalPeriod, setFiscalPeriod] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleFiscalPeriodChange = (event) => {
    setFiscalPeriod(event.target.value);
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // In a real implementation, this would call the backend API to generate the report
    setTimeout(() => {
      setLoading(false);
      alert('Report generation is not implemented yet. This is a placeholder UI.');
    }, 1000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Financial Reports
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Report
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-label"
                  value={reportType}
                  onChange={handleReportTypeChange}
                  label="Report Type"
                >
                  <MenuItem value="income">Income Statement</MenuItem>
                  <MenuItem value="balance">Balance Sheet</MenuItem>
                  <MenuItem value="cash">Cash Flow Statement</MenuItem>
                  <MenuItem value="trial">Trial Balance</MenuItem>
                  <MenuItem value="general">General Ledger</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="fiscal-period-label">Fiscal Period</InputLabel>
                <Select
                  labelId="fiscal-period-label"
                  value={fiscalPeriod}
                  onChange={handleFiscalPeriodChange}
                  label="Fiscal Period"
                >
                  <MenuItem value="">Custom Date Range</MenuItem>
                  <MenuItem value="current">Current Period</MenuItem>
                  <MenuItem value="previous">Previous Period</MenuItem>
                  <MenuItem value="ytd">Year to Date</MenuItem>
                  <MenuItem value="q1">Q1 2025</MenuItem>
                  <MenuItem value="q2">Q2 2025</MenuItem>
                  <MenuItem value="q3">Q3 2025</MenuItem>
                  <MenuItem value="q4">Q4 2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!fiscalPeriod && (
              <>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateReport}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Recent Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Income Statement - Q1 2025</Typography>
              <Box>
                <Button startIcon={<PdfIcon />} size="small" sx={{ mr: 1 }}>
                  PDF
                </Button>
                <Button startIcon={<ExcelIcon />} size="small">
                  Excel
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Generated on April 15, 2025
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Balance Sheet - Q1 2025</Typography>
              <Box>
                <Button startIcon={<PdfIcon />} size="small" sx={{ mr: 1 }}>
                  PDF
                </Button>
                <Button startIcon={<ExcelIcon />} size="small">
                  Excel
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Generated on April 15, 2025
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Cash Flow Statement - Q1 2025</Typography>
              <Box>
                <Button startIcon={<PdfIcon />} size="small" sx={{ mr: 1 }}>
                  PDF
                </Button>
                <Button startIcon={<ExcelIcon />} size="small">
                  Excel
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Generated on April 15, 2025
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Trial Balance - Q1 2025</Typography>
              <Box>
                <Button startIcon={<PdfIcon />} size="small" sx={{ mr: 1 }}>
                  PDF
                </Button>
                <Button startIcon={<ExcelIcon />} size="small">
                  Excel
                </Button>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Generated on April 15, 2025
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FinancialReports;
