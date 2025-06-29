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
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import memberService from '../../services/memberService';
import { formatCurrency } from '../../utils/currency';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MemberDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [member, setMember] = useState(null);
  const [savingsTransactions, setSavingsTransactions] = useState([]);
  const [shuDistributions, setShuDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination for transactions
  const [transactionPage, setTransactionPage] = useState(0);
  const [transactionRowsPerPage, setTransactionRowsPerPage] = useState(5);
  
  // Pagination for SHU distributions
  const [distributionPage, setDistributionPage] = useState(0);
  const [distributionRowsPerPage, setDistributionRowsPerPage] = useState(5);
  
  // Fetch member data on component mount
  useEffect(() => {
    fetchMemberData();
  }, [id]);
  
  // Fetch member data from API
  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch member details
      const memberData = await memberService.getMember(id);
      setMember(memberData);
      
      // Fetch savings transactions
      const transactionsData = await memberService.getMemberSavingsTransactions(id);
      setSavingsTransactions(transactionsData);
      
      // Fetch SHU distributions
      const distributionsData = await memberService.getMemberSHUDistributions(id);
      setShuDistributions(distributionsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching member data:', err);
      setError('Failed to fetch member data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle transaction page change
  const handleTransactionPageChange = (event, newPage) => {
    setTransactionPage(newPage);
  };
  
  // Handle transaction rows per page change
  const handleTransactionRowsPerPageChange = (event) => {
    setTransactionRowsPerPage(parseInt(event.target.value, 10));
    setTransactionPage(0);
  };
  
  // Handle distribution page change
  const handleDistributionPageChange = (event, newPage) => {
    setDistributionPage(newPage);
  };
  
  // Handle distribution rows per page change
  const handleDistributionRowsPerPageChange = (event) => {
    setDistributionRowsPerPage(parseInt(event.target.value, 10));
    setDistributionPage(0);
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/members');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/members/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchMemberData();
  };
  
  // Handle add transaction button click
  const handleAddTransaction = () => {
    // This would typically open a modal or navigate to a form
    alert('Add transaction functionality would be implemented here');
  };
  
  // Handle add SHU distribution button click
  const handleAddDistribution = () => {
    // This would typically open a modal or navigate to a form
    alert('Add SHU distribution functionality would be implemented here');
  };
  
  
  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'calon_anggota':
        color = 'info';
        break;
      case 'anggota':
        color = 'success';
        break;
      case 'pengurus':
        color = 'primary';
        break;
      case 'inactive':
        color = 'error';
        break;
      case 'suspended':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    // Format the display text (capitalize and replace underscores with spaces)
    const displayText = status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return (
      <Chip 
        label={displayText} 
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
          Back to Members
        </Button>
      </Box>
    );
  }
  
  if (!member) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Member not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Members
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
          Back to Members
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
            Edit Member
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {member.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Member ID: {member.member_id}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {member.email || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {member.phone || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {member.address || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Join Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {new Date(member.join_date).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {renderStatusChip(member.status)}
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Registration Method
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {member.registration_method}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Savings Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Principal Savings
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(member.principal_savings)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Mandatory Savings
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(member.mandatory_savings)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Voluntary Savings
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(member.voluntary_savings)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Unpaid Mandatory
                    </Typography>
                    <Typography variant="h6" color={member.unpaid_mandatory > 0 ? 'error.main' : 'inherit'}>
                      {formatCurrency(member.unpaid_mandatory)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      SHU Balance
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(member.shu_balance)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Savings
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      {formatCurrency(
                        member.principal_savings + 
                        member.mandatory_savings + 
                        member.voluntary_savings
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="member tabs">
            <Tab label="Savings Transactions" id="member-tab-0" aria-controls="member-tabpanel-0" />
            <Tab label="SHU Distributions" id="member-tab-1" aria-controls="member-tabpanel-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTransaction}
            >
              Add Transaction
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savingsTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  savingsTransactions
                    .slice(
                      transactionPage * transactionRowsPerPage,
                      transactionPage * transactionRowsPerPage + transactionRowsPerPage
                    )
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {transaction.transaction_type}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.description || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.status} 
                            color={transaction.status === 'completed' ? 'success' : 'default'} 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={savingsTransactions.length}
            rowsPerPage={transactionRowsPerPage}
            page={transactionPage}
            onPageChange={handleTransactionPageChange}
            onRowsPerPageChange={handleTransactionRowsPerPageChange}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDistribution}
            >
              Add SHU Distribution
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Fiscal Year</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Distribution Method</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shuDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No SHU distributions found
                    </TableCell>
                  </TableRow>
                ) : (
                  shuDistributions
                    .slice(
                      distributionPage * distributionRowsPerPage,
                      distributionPage * distributionRowsPerPage + distributionRowsPerPage
                    )
                    .map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell>
                          {new Date(distribution.distribution_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{distribution.fiscal_year}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(distribution.amount)}
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {distribution.distribution_method.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={distribution.status} 
                            color={
                              distribution.status === 'completed' 
                                ? 'success' 
                                : distribution.status === 'pending' 
                                  ? 'warning' 
                                  : 'default'
                            } 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={shuDistributions.length}
            rowsPerPage={distributionRowsPerPage}
            page={distributionPage}
            onPageChange={handleDistributionPageChange}
            onRowsPerPageChange={handleDistributionRowsPerPageChange}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default MemberDetail;
