import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProjectFormComponent from '../../components/projects/ProjectForm';

const ProjectFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Project' : 'Create New Project'}
      </Typography>
      <Typography variant="body1" paragraph>
        {isEditMode 
          ? 'Update project details, status, and financial information.' 
          : 'Create a new project with customer, timeline, and budget information.'}
      </Typography>
      
      <ProjectFormComponent />
    </Box>
  );
};

export default ProjectFormPage;
