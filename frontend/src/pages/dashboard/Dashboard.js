import React, { useState, useEffect } from 'react';
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
  useTheme,
  CircularProgress,
  Alert,
  Skeleton,
  IconButton,
  Tooltip
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
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import dashboardService from '../../services/dashboardService';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip as ChartTooltip, 
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
  ChartTooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState({
    savingsTrend: null,
    salesPurchases: null,
    memberDistribution: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Load main dashboard data
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);

      // Load chart data in parallel
      const [savingsTrend, salesPurchases, memberDistribution] = await Promise.all([
        dashboardService.getSavingsTrendData(),
        dashboardService.getSalesPurchasesData(),
        dashboardService.getMemberDistributionData()
      ]);

      setChartData({
        savingsTrend,
        salesPurchases,
        memberDistribution
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // Get icon component by name
  const getIconComponent = (iconName) => {
    const icons = {
      PeopleIcon,
      ShoppingCartIcon,
      LocalShippingIcon,
      AccountBalanceIcon,
      WarningIcon,
      CheckCircleIcon
    };
    return icons[iconName] || PeopleIcon;
  };

  // Get alert color by type
  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  // Loading skeleton component
  const StatCardSkeleton = () => (
    <Paper elevation={2} sx={{ p: 2, height: 140 }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="80%" height={48} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
    </Paper>
  );

  // Error state
  if (error && !dashboardData) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => loadDashboardData()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }
  
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Welcome back, {currentUser?.full_name || 'User'}!
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            color="primary"
          >
            {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
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
                {dashboardData?.memberStats?.total || 0}
              </Typography>
              <Typography variant="body2">
                {dashboardData?.memberStats?.newThisMonth || 0} new this month
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
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
                {formatCurrency(dashboardData?.financialStats?.totalSavings || 0)}
              </Typography>
              <Typography variant="body2">
                Across all savings types
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
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
                {formatCurrency(dashboardData?.salesStats?.totalSales || 0)}
              </Typography>
              <Typography variant="body2">
                {dashboardData?.salesStats?.totalOrders || 0} orders
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <StatCardSkeleton />
          ) : (
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
                {formatCurrency(dashboardData?.purchaseStats?.totalPurchases || 0)}
              </Typography>
              <Typography variant="body2">
                {dashboardData?.purchaseStats?.totalOrders || 0} orders
              </Typography>
            </Paper>
          )}
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
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : chartData.savingsTrend ? (
                <Box sx={{ height: 300 }}>
                  <Line
                    data={chartData.savingsTrend}
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
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Member Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Member Status" />
            <Divider />
            <CardContent>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : chartData.memberDistribution ? (
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie
                    data={chartData.memberDistribution}
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
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sales vs Purchases Chart */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Sales vs Purchases" />
            <Divider />
            <CardContent>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : chartData.salesPurchases ? (
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={chartData.salesPurchases}
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
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activities and Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Activities" />
            <Divider />
            <CardContent>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : dashboardData?.recentActivities?.length > 0 ? (
                <List>
                  {dashboardData.recentActivities.map((activity, index) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <IconComponent />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.description}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No recent activities</Typography>
                </Box>
              )}
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
              {loading ? (
                <Box sx={{ p: 2 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : dashboardData?.systemAlerts?.length > 0 ? (
                <List>
                  {dashboardData.systemAlerts.map((alert, index) => {
                    const IconComponent = getIconComponent(alert.icon);
                    const alertColor = getAlertColor(alert.type);
                    return (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <IconComponent color={alertColor} />
                        </ListItemIcon>
                        <ListItemText
                          primary={alert.title}
                          secondary={alert.description}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">No alerts</Typography>
                </Box>
              )}
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
