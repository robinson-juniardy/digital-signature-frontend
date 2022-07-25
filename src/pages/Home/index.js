/* eslint-disable prefer-arrow-callback */
import {
  AppBar,
  Autocomplete,
  Button,
  Container,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import React, { forwardRef, useState, useEffect, useLayoutEffect } from 'react';
import API from '../../hook/API';
import Iconify from '../../components/Iconify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  const [usersOpen, setUsersOpen] = useState(false);
  const form = useFormik({
    initialValues: {
      nip: '',
      password: '',
      nama: '',
      jabatan: '',
      role: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Dialog fullScreen open={usersOpen} onClose={() => setUsersOpen(false)} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setUsersOpen(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Kelola Users
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <br />
          <Grid container spacing={2}>
            <Grid item xs={6} md={6} lg={6}>
              <FormikProvider value={form}>
                <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                  <Stack direction="column" spacing={1}>
                    <TextField
                      label="NIP"
                      variant="standard"
                      name="nip"
                      value={form.values.nip}
                      onChange={form.handleChange}
                    />
                    <TextField
                      type="password"
                      label="password"
                      variant="standard"
                      name="password"
                      value={form.values.password}
                      onChange={form.handleChange}
                    />
                    <TextField
                      label="Nama"
                      variant="standard"
                      name="nama"
                      value={form.values.nama}
                      onChnage={form.handleChange}
                    />
                    <Autocomplete
                      options={[
                        {
                          role: 'Admin',
                          value: 'admin',
                        },
                        {
                          role: 'Operator',
                          value: 'operator',
                        },
                        {
                          role: 'Ka. OPD',
                          value: 'ka_opd',
                        },
                        {
                          role: 'Eselon 3',
                          value: 'eselon_3',
                        },
                        {
                          role: 'Eselon 4',
                          value: 'eselon_4',
                        },
                        {
                          role: 'Staff',
                          value: 'staff',
                        },
                      ]}
                      getOptionLabel={(option) => option.role}
                      value={form.values.role}
                      onChange={(e, v) => form.setFieldValue('role', v)}
                      isOptionEqualToValue={(option, value) => option.role === value.role}
                      renderInput={(props) => <TextField {...props} label="Role User" variant="standard" />}
                    />
                    <Autocomplete
                      options={[
                        {
                          jabatan: 'Ka. OPD',
                          value: 'ka_opd',
                        },
                        {
                          jabatan: 'Eselon 3',
                          value: 'eselon_3',
                        },
                        {
                          jabatan: 'Eselon 4',
                          value: 'eselon_4',
                        },
                        {
                          jabatan: 'Staff',
                          value: 'staff',
                        },
                      ]}
                      getOptionLabel={(option) => option.jabatan}
                      value={form.values.jabatan}
                      onChange={(e, v) => form.setFieldValue('jabatan', v)}
                      isOptionEqualToValue={(option, value) => option.jabatan === value.jabatan}
                      renderInput={(props) => <TextField {...props} label="Jabatan" variant="standard" />}
                    />
                    <Button variant="container" color="primary" type="submit">
                      Simpan
                    </Button>
                  </Stack>
                </form>
              </FormikProvider>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    </>
  );
};

export default Home;
