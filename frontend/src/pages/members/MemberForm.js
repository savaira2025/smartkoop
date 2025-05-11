import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import MemberFormComponent from '../../components/members/MemberForm';

const MemberFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Member' : 'Create New Member'}
      </Typography>
      <Typography variant="body1" paragraph>
        {isEditMode 
          ? 'Update member information, status, and savings details.' 
          : 'Add a new member to the cooperative with their basic information and initial savings.'}
      </Typography>
      
      <MemberFormComponent />
    </Box>
  );
};

export default MemberFormPage;
