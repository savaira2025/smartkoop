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
import purchaseService from '../../services/purchaseService';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch purchase orders on component mount and when filters change
  useEffect(() => {
    fetchPurchaseOrders();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  // Fetch purchase orders from API
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      };
      
      const data = await purchaseService.getPurchaseOrders(params);
      setPurchaseOrders(data);
      setTotalCount(data.length); // In a real API, this would come from the response metadata
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError('Failed to fetch purchase orders. Please try again.');
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
    fetchPurchaseOrders();
  };

  // Handle view purchase order button click
  const handleViewPurchaseOrder = (id) => {
    navigate(`/purchases/orders/${id}`);
  };

  // Handle edit purchase order button click
  const handleEditPurchaseOrder = (id) => {
    navigate(`/purchases/orders/${id}/edit`);
  };

  // Handle delete purchase order button click
  const handleDeletePurchaseOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await purchaseService.deletePurchaseOrder(id);
        fetchPurchaseOrders();
      } catch (err) {
        console.error('Error deleting purchase order:', err);
        setError('Failed to delete purchase order. Please try again.');
      }
    }
  };

  // Handle add purchase order button click
  const handleAddPurchaseOrder = () => {
    navigate('/purchases/orders/new');
  };

  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'approved':
        color = 'primary';
        break;
      case 'completed':
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

  // Render payment status chip
  const renderPaymentStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'unpaid':
        color = 'error';
        break;
      case 'partial':
        color = 'warning';
        break;
      case 'paid':
        color = 'success';
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Purchase Orders
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPurchaseOrder}
            sx={{ mr: 1 }}
          >
            Add Purchase Order
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
          placeholder="Search purchase orders..."
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
              <TableCell>Order Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : purchaseOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No purchase orders found
                </TableCell>
              </TableRow>
            ) : (
              purchaseOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.supplier?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell>{formatDate(order.due_date)}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>
                    {renderStatusChip(order.status)}
                  </TableCell>
                  <TableCell>
                    {renderPaymentStatusChip(order.payment_status)}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPurchaseOrder(order.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditPurchaseOrder(order.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePurchaseOrder(order.id)}
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

export default PurchaseOrderList;
