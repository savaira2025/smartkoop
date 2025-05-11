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
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Edit as EditIcon, 
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  Receipt as InvoiceIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../../services/projectService';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
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

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination for tasks
  const [taskPage, setTaskPage] = useState(0);
  const [taskRowsPerPage, setTaskRowsPerPage] = useState(5);
  
  // Pagination for invoices
  const [invoicePage, setInvoicePage] = useState(0);
  const [invoiceRowsPerPage, setInvoiceRowsPerPage] = useState(5);
  
  // Fetch project data on component mount
  useEffect(() => {
    fetchProjectData();
  }, [id]);
  
  // Fetch project data from API
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch project details
      const projectData = await projectService.getProject(id);
      setProject(projectData);
      
      // Fetch project tasks
      const tasksData = await projectService.getProjectTasks(id);
      setTasks(tasksData);
      
      // Fetch project invoices
      const invoicesData = await projectService.getProjectInvoices(id);
      setInvoices(invoicesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to fetch project data. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle task page change
  const handleTaskPageChange = (event, newPage) => {
    setTaskPage(newPage);
  };
  
  // Handle task rows per page change
  const handleTaskRowsPerPageChange = (event) => {
    setTaskRowsPerPage(parseInt(event.target.value, 10));
    setTaskPage(0);
  };
  
  // Handle invoice page change
  const handleInvoicePageChange = (event, newPage) => {
    setInvoicePage(newPage);
  };
  
  // Handle invoice rows per page change
  const handleInvoiceRowsPerPageChange = (event) => {
    setInvoiceRowsPerPage(parseInt(event.target.value, 10));
    setInvoicePage(0);
  };
  
  // Handle back button click
  const handleBack = () => {
    navigate('/projects');
  };
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchProjectData();
  };
  
  // Handle add task button click
  const handleAddTask = () => {
    navigate(`/projects/${id}/tasks/new`);
  };
  
  // Handle view task button click
  const handleViewTask = (taskId) => {
    navigate(`/projects/${id}/tasks/${taskId}`);
  };
  
  // Handle add invoice button click
  const handleAddInvoice = () => {
    navigate(`/projects/${id}/invoices/new`);
  };
  
  // Handle view invoice button click
  const handleViewInvoice = (invoiceId) => {
    navigate(`/project-invoices/${invoiceId}`);
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
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Render status chip
  const renderStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'active':
        color = 'success';
        break;
      case 'completed':
        color = 'primary';
        break;
      case 'on-hold':
        color = 'warning';
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
  
  // Render task status chip
  const renderTaskStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'pending':
        color = 'default';
        break;
      case 'in-progress':
        color = 'info';
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
  
  // Render invoice status chip
  const renderInvoiceStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'draft':
        color = 'default';
        break;
      case 'sent':
        color = 'info';
        break;
      case 'paid':
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
          Back to Projects
        </Button>
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Project not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Projects
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
          Back to Projects
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
            Edit Project
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {project.project_name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Project Number: {project.project_number}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Project Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {project.customer ? project.customer.name : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatDate(project.start_date)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatDate(project.end_date)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {renderStatusChip(project.status)}
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {project.description || 'No description provided'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Financial Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Budget
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatCurrency(project.budget_amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Invoiced
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatCurrency(project.total_invoiced)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Cost
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {formatCurrency(project.total_cost)}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Project Profitability
                  </Typography>
                  <Typography variant="h5" color={project.total_invoiced - project.total_cost > 0 ? 'success.main' : 'error.main'}>
                    {formatCurrency(project.total_invoiced - project.total_cost)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="project tabs">
            <Tab label="Tasks" id="project-tab-0" aria-controls="project-tabpanel-0" />
            <Tab label="Invoices" id="project-tab-1" aria-controls="project-tabpanel-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Est. Hours</TableCell>
                  <TableCell align="right">Actual Hours</TableCell>
                  <TableCell align="right">Hourly Rate</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks
                    .slice(
                      taskPage * taskRowsPerPage,
                      taskPage * taskRowsPerPage + taskRowsPerPage
                    )
                    .map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.task_name}</TableCell>
                        <TableCell>{formatDate(task.start_date)}</TableCell>
                        <TableCell>{formatDate(task.due_date)}</TableCell>
                        <TableCell align="right">{task.estimated_hours}</TableCell>
                        <TableCell align="right">{task.actual_hours}</TableCell>
                        <TableCell align="right">{formatCurrency(task.hourly_rate)}</TableCell>
                        <TableCell>
                          {renderTaskStatusChip(task.status)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View/Edit Task">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTask(task.id)}
                            >
                              <TaskIcon />
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
            count={tasks.length}
            rowsPerPage={taskRowsPerPage}
            page={taskPage}
            onPageChange={handleTaskPageChange}
            onRowsPerPageChange={handleTaskRowsPerPageChange}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddInvoice}
            >
              Create Invoice
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices
                    .slice(
                      invoicePage * invoiceRowsPerPage,
                      invoicePage * invoiceRowsPerPage + invoiceRowsPerPage
                    )
                    .map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.subtotal)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.tax_amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.total_amount)}</TableCell>
                        <TableCell>
                          {renderInvoiceStatusChip(invoice.status)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Invoice">
                            <IconButton
                              size="small"
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <InvoiceIcon />
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
            count={invoices.length}
            rowsPerPage={invoiceRowsPerPage}
            page={invoicePage}
            onPageChange={handleInvoicePageChange}
            onRowsPerPageChange={handleInvoiceRowsPerPageChange}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProjectDetail;
