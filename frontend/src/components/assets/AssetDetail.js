import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import assetService from '../../services/assetService';

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
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

const AssetDetail = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [depreciations, setDepreciations] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        setLoading(true);
        const assetData = await assetService.getAsset(id);
        setAsset(assetData);

        // Fetch depreciation entries
        const depreciationData = await assetService.getAssetDepreciations(id);
        setDepreciations(depreciationData);

        // Fetch maintenance records
        const maintenanceData = await assetService.getAssetMaintenances(id);
        setMaintenances(maintenanceData);
      } catch (error) {
        console.error('Failed to fetch asset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteDepreciation = async (depreciationId) => {
    if (window.confirm('Are you sure you want to delete this depreciation entry?')) {
      try {
        await assetService.deleteAssetDepreciation(depreciationId);
        setDepreciations(depreciations.filter(dep => dep.id !== depreciationId));
      } catch (error) {
        console.error('Failed to delete depreciation entry:', error);
      }
    }
  };

  const handleDeleteMaintenance = async (maintenanceId) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await assetService.deleteAssetMaintenance(maintenanceId);
        setMaintenances(maintenances.filter(maint => maint.id !== maintenanceId));
      } catch (error) {
        console.error('Failed to delete maintenance record:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'disposed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Loading asset details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!asset) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Asset not found
          </Typography>
          <Button component={RouterLink} to="/assets" variant="contained">
            Back to Assets
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Asset Details
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/assets"
              sx={{ mr: 1 }}
            >
              Back to Assets
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={RouterLink}
              to={`/assets/${id}/edit`}
            >
              Edit Asset
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Asset Number
              </Typography>
              <Typography variant="body1" gutterBottom>
                {asset.asset_number}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {asset.name}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1" gutterBottom>
                {asset.category}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" gutterBottom>
                <Chip
                  label={asset.status}
                  color={getStatusColor(asset.status)}
                  size="small"
                />
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Acquisition Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(asset.acquisition_date).toLocaleDateString()}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Acquisition Cost
              </Typography>
              <Typography variant="body1" gutterBottom>
                ${parseFloat(asset.acquisition_cost).toFixed(2)}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Current Value
              </Typography>
              <Typography variant="body1" gutterBottom>
                ${parseFloat(asset.current_value).toFixed(2)}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Depreciation Rate
              </Typography>
              <Typography variant="body1" gutterBottom>
                {parseFloat(asset.depreciation_rate).toFixed(2)}%
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1" gutterBottom>
                {asset.location || 'Not specified'}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Assigned To
              </Typography>
              <Typography variant="body1" gutterBottom>
                {asset.assigned_to || 'Not assigned'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="asset tabs">
            <Tab label="Depreciation History" id="asset-tab-0" />
            <Tab label="Maintenance Records" id="asset-tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to={`/assets/${id}/depreciations/new`}
            >
              Add Depreciation Entry
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Depreciation Amount</TableCell>
                  <TableCell>Book Value After</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {depreciations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No depreciation entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  depreciations.map((depreciation) => (
                    <TableRow key={depreciation.id}>
                      <TableCell>
                        {new Date(depreciation.depreciation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        ${parseFloat(depreciation.depreciation_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${parseFloat(depreciation.book_value_after).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          component={RouterLink}
                          to={`/assets/${id}/depreciations/${depreciation.id}/edit`}
                          size="small"
                          color="primary"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDepreciation(depreciation.id)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to={`/assets/${id}/maintenances/new`}
            >
              Add Maintenance Record
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Performed By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No maintenance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenances.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell>
                        {new Date(maintenance.maintenance_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{maintenance.maintenance_type}</TableCell>
                      <TableCell>
                        ${parseFloat(maintenance.cost).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {maintenance.performed_by || 'Not specified'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          component={RouterLink}
                          to={`/assets/${id}/maintenances/${maintenance.id}/edit`}
                          size="small"
                          color="primary"
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteMaintenance(maintenance.id)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AssetDetail;
