import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const DocumentList = ({ 
  documents = [], 
  loading = false, 
  onDelete, 
  onDownload,
  onViewVersions,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange
}) => {
  const navigate = useNavigate();
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleActionClick = (event, document) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedDocument(null);
  };

  const handleView = () => {
    if (selectedDocument) {
      navigate(`/documents/${selectedDocument.id}`);
    }
    handleActionClose();
  };

  const handleEdit = () => {
    if (selectedDocument) {
      navigate(`/documents/${selectedDocument.id}/edit`);
    }
    handleActionClose();
  };

  const handleDelete = () => {
    if (selectedDocument && onDelete) {
      onDelete(selectedDocument.id);
    }
    handleActionClose();
  };

  const handleDownload = () => {
    if (selectedDocument && onDownload) {
      onDownload(selectedDocument.id);
    }
    handleActionClose();
  };

  const handleViewVersions = () => {
    if (selectedDocument && onViewVersions) {
      onViewVersions(selectedDocument.id);
    }
    handleActionClose();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/documents/upload')}
        >
          Upload Document
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Related To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{document.document_type}</TableCell>
                  <TableCell>{formatDate(document.upload_date)}</TableCell>
                  <TableCell>
                    {document.related_entity_type && document.related_entity_id
                      ? `${document.related_entity_type} #${document.related_entity_id}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={document.status || 'active'} 
                      color={getStatusColor(document.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/documents/${document.id}`)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionClick(e, document)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </TableContainer>

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleViewVersions}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Versions</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DocumentList;
