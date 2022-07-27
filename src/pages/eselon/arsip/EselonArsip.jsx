import { Container, Grid } from '@mui/material';
import React from 'react';
import ArsipTable from '../../Table/ArsipTable';

const EselonArsip = () => {
  return (
    // <Container maxWidth="lg">
    <Grid container spacing={1}>
      <Grid item xs={12} md={12} lg={12}>
        <h1>Data Arsip</h1>
        <ArsipTable />
      </Grid>
    </Grid>
    // </Container>
  );
};

export default EselonArsip;
