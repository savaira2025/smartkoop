import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  
  // Mock data for charts and statistics
  const memberStats = {
    total: 245,
    active: 220,
    inactive: 25,
    newThisMonth: 12
  };
  
  const financialStats = {
    totalSavings: 1250000,
    principalSavings: 500000,
    mandatorySavings: 600000,
    voluntarySavings: 150000,
    unpaidMandatory: 25000,
    shuDistributed: 75000
  };
  
  const salesStats = {
    totalOrders: 156,
    pendingOrders: 23,
    completedOrders: 133,
    totalSales: 450000,
    outstandingInvoices: 75000
  };
  
  const purchaseStats = {
    totalOrders: 98,
    pendingOrders: 15,
    completedOrders: 83,
    totalPurchases: 320000,
    outstandingInvoices: 45000
  };
  
  // Line chart data for savings trend
  const savingsTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Principal',
        data: [50000, 55000, 60000, 65000, 70000, 75000],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
      },
      {
        label: 'Mandatory',
        data: [60000, 65000, 70000, 75000, 80000, 85000],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
      },
      {
        label: 'Voluntary',
        data: [15000, 17000, 19000, 21000, 23000, 25000],
        borderColor: theme.palette.info.main,
        backgroundColor: theme.palette.info.main,
      },
    ],
  };
  
  // Bar chart data for sales vs purchases
  const salesPurchasesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65000, 70000, 75000, 80000, 85000, 90000],
        backgroundColor: theme.palette.success.main,
      },
      {
        label: 'Purchases',
        data: [50000, 55000, 60000, 65000, 70000, 75000],
        backgroundColor: theme.palette.error.main,
      },
    ],
  };
  
  // Pie chart data for member distribution
  const memberDistributionData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [memberStats.active, memberStats.inactive],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser?.full_name || 'User'}!
      </Typography>
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {memberStats.total}
            </Typography>
            <Typography variant="body2">
              {memberStats.newThisMonth} new this month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.secondary.light,
              color: theme.palette.secondary.contrastText,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Savings
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {formatCurrency(financialStats.totalSavings)}
            </Typography>
            <Typography variant="body2">
              Across all savings types
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.success.light,
              color: theme.palette.success.contrastText,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sales
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {formatCurrency(salesStats.totalSales)}
            </Typography>
            <Typography variant="body2">
              {salesStats.totalOrders} orders
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Purchases
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {formatCurrency(purchaseStats.totalPurchases)}
            </Typography>
            <Typography variant="body2">
              {purchaseStats.totalOrders} orders
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Detailed Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Savings Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Savings Trend" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Line
                  data={savingsTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Member Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Member Status" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie
                  data={memberDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sales vs Purchases Chart */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Sales vs Purchases" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={salesPurchasesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activities and Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Activities" />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="New member registered"
                    secondary="John Doe - 2 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="New sales order created"
                    secondary="Order #SO-2023-042 - 3 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Journal entry posted"
                    secondary="Entry #JE-2023-128 - 5 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Purchase order approved"
                    secondary="Order #PO-2023-037 - 1 day ago"
                  />
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  component={RouterLink}
                  to="/activities"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Alerts & Notifications" />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Unpaid mandatory savings"
                    secondary={`${formatCurrency(financialStats.unpaidMandatory)} total unpaid amount`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Outstanding sales invoices"
                    secondary={`${formatCurrency(salesStats.outstandingInvoices)} pending payment`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Outstanding purchase invoices"
                    secondary={`${formatCurrency(purchaseStats.outstandingInvoices)} pending payment`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="SHU distribution completed"
                    secondary={`${formatCurrency(financialStats.shuDistributed)} distributed to members`}
                  />
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  component={RouterLink}
                  to="/notifications"
                  endIcon={<ArrowForwardIcon />}
                >
                  View All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
