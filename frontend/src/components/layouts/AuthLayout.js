import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            SmartKoop System
          </Typography>
          
          {/* This is where the child routes (Login, Register, etc.) will be rendered */}
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
