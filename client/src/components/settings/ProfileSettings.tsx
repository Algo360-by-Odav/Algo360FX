import React from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Grid } from '@mui/material';

const ProfileSettings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileSettings;
