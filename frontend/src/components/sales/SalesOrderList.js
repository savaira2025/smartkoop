import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import salesService from '../../services/salesService';

const SalesOrderList = () => {
  const navigate = useNavigate();
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch sales orders on component mount and when filters change
  useEffect(() => {
    fetchSalesOrders();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  // Fetch sales orders from API
  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      };
      
      const data = await salesService.getSalesOrders(params);
      setSalesOrders(data);
      setTotalCount(data.length); // In a real API, this would come from the response metadata
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sales orders:', err);
      setError('Failed to fetch sales orders. Please try again.');
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchSalesOrders();
  };

  // Handle view sales order button click
  const handleViewSalesOrder = (id) => {
    navigate(`/sales/orders/${id}`);
  };

  // Handle edit sales order button click
  const handleEditSalesOrder = (id) => {
    navigate(`/sales/orders/${id}/edit`);
  };

  // Handle delete sales order button click
  const handleDeleteSalesOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        await salesService.deleteSalesOrder(id);
        fetchSalesOrders();
      } catch (err) {
        console.error('Error deleting sales order:', err);
        setError('Failed to delete sales order. Please try again.');
      }
    }
  };

  // Handle add sales order button click
  const handleAddSalesOrder = () => {
    navigate('/sales/orders/new');
  };

  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'confirmed':
        color = 'info';
        break;
      case 'shipped':
        color = 'primary';
        break;
      case 'delivered':
        color = 'success';
        break;
      case 'cancelled':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={color} 
        size="small" 
      />
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Sales Orders
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddSalesOrder}
            sx={{ mr: 1 }}
          >
            Add Sales Order
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sales orders..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : salesOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No sales orders found
                </TableCell>
              </TableRow>
            ) : (
              salesOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(order.status)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleViewSalesOrder(order.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditSalesOrder(order.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSalesOrder(order.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default SalesOrderList;
