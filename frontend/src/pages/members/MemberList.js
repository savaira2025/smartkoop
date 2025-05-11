import React from 'react';
import { Box, Typography } from '@mui/material';
import MemberListComponent from '../../components/members/MemberList';

const MemberListPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Member Management
      </Typography>
      <Typography variant="body1" paragraph>
        View, create, edit, and manage cooperative members. Track member information, savings, and SHU distributions.
      </Typography>
      
      <MemberListComponent />
    </Box>
  );
};

export default MemberListPage;
