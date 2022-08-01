/* eslint-disable prefer-arrow-callback */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Grid, Dialog, AppBar, Toolbar, IconButton, Typography, Container, Card, Slide } from '@mui/material';
import Iconify from '../../components/Iconify';
import Signatures from '../Signatures/Signatures';
import SuratKeluarTable from '../Table/SuratKeluarTable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SuratKeluarComponent = () => {
  const [open, setOpen] = useState(false);
  const [filename, setfilename] = useState(null);
  const [rows, setRows] = useState(null);
  return (
    <>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Document Sign
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Card sx={{ p: 3, mt: 10 }}>
            <Grid container spacing={2}>
              <Grid marginTop={7} item xs={12} md={8} lg={8}>
                <Signatures rowdata={rows} filename={filename} />
              </Grid>
              {/* <Grid marginTop={7} item xs={12} md={8} lg={4}>
                <Sign />
              </Grid> */}
            </Grid>
          </Card>
        </Container>
      </Dialog>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          <h1>Surat Keluar</h1>
          <SuratKeluarTable setRows={setRows} setOpen={setOpen} setFilename={setfilename} />
        </Grid>
      </Grid>
    </>
  );
};

export default SuratKeluarComponent;
