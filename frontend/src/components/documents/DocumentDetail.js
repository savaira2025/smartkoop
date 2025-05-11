import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Divider, 
  Grid, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const DocumentDetail = ({ 
  document, 
  versions = [], 
  loading = false, 
  onDelete, 
  onDownload,
  onUploadVersion
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading document details...</Typography>
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Document not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/documents')}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'default';
      default:
        return 'primary';
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(document.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document.id);
    }
  };

  const handleUploadVersion = () => {
    if (onUploadVersion) {
      onUploadVersion(document.id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Document Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mr: 1 }}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/documents/${document.id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Document Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {document.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Document Type
              </Typography>
              <Typography variant="body1" gutterBottom>
                {document.document_type}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Upload Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(document.upload_date)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip 
                label={document.status || 'active'} 
                color={getStatusColor(document.status)} 
                size="small" 
              />
            </Grid>
            {document.related_entity_type && document.related_entity_id && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Related To
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {`${document.related_entity_type} #${document.related_entity_id}`}
                </Typography>
              </Grid>
            )}
            {document.expiry_date && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiry Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(document.expiry_date)}
                </Typography>
              </Grid>
            )}
            {document.tags && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {document.tags.split(',').map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag.trim()} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </Grid>
            )}
            {document.description && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {document.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Document Versions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUploadVersion}
        >
          Upload New Version
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No versions found
                </TableCell>
              </TableRow>
            ) : (
              versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>{version.version_number}</TableCell>
                  <TableCell>{formatDate(version.upload_date)}</TableCell>
                  <TableCell>{version.uploaded_by || 'N/A'}</TableCell>
                  <TableCell>{version.notes || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => onDownload && onDownload(document.id, version.id)}
                      title="Download Version"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentDetail;
