import React from 'react';
import { Box, Typography } from '@mui/material';
import ProjectListComponent from '../../components/projects/ProjectList';

const ProjectListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Management
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage projects. Track project tasks, time entries, and invoices.
      </Typography>
      
      <ProjectListComponent />
    </Box>
  );
};

export default ProjectListPage;
