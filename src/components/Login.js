/* eslint-disable no-unused-vars */
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import background from '../assets/image/bg1.png';
import { useFormik } from 'formik';
import MenuIcon from '@mui/icons-material/Menu';
import { LoginService } from '../services/AuthServices';

import React, { useContext, useState } from 'react';
import { useSnackbar } from 'notistack';
import API from '../hook/API';
import AuthContext from '../context/auth';
import { LoadingButton } from '@mui/lab';
import * as Icon from '@mui/icons-material';
import Logo from '../assets/image/logo.png';

const Login = () => {
  const { setCurrentUser, curretUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      nip: '',
      password: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const { nip, password } = values;
      API.post('/api/users/auth/login', {
        nip,
        password,
      })
        .then((response) => {
          if (response.data.status === 1) {
            console.log(response.data.data);
            localStorage.setItem('role_id', response.data.data[0].role_id);
            localStorage.setItem('role', response.data.data[0].role_name);
            localStorage.setItem('id', response.data.data[0].id);
            localStorage.setItem('nip', response.data.data[0].nip);
            localStorage.setItem('jabatan', response.data.data[0].jabatan);
            localStorage.setItem('nama', response.data.data[0].nama);
            localStorage.setItem('disposision_level', response.data.data[0].disposision_level);
            localStorage.setItem('atribut', response.data.data[0].atribut);
            localStorage.setItem('paraf', response.data.data[0].paraf);
            localStorage.setItem('ttd', response.data.data[0].tandatangan);
            setCurrentUser({
              role_id: response.data.data[0].role_id,
              role: response.data.data[0].role_name,
              id: response.data.data[0].id,
              nip: response.data.data[0].nip,
              jabatan: response.data.data[0].jabatan,
              nama: response.data.data[0].nama,
              disposision_level: response.data.data[0].disposision_level,
              atribut: response.data.data[0].atribut,
              paraf: response.data.data[0].paraf,
              ttd: response.data.data[0].tandatangan,
            });
            enqueueSnackbar('Login Berhasil', {
              variant: 'success',
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
          } else {
            console.log(response.data.message);
            enqueueSnackbar('Login Gagal', {
              variant: 'error',
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar('Login Gagal', {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
        });
      setLoading(false);
    },
  });

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        height: '99.2vh',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <AppBar>
          <Toolbar>
            <Typography variant="overline" display="block" sx={{ flexGrow: 1 }}>
              Digital Signature & Disposisi Web Apps - Si Aksi
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{}} maxWidth="md">
        <Grid alignContent="center" container spacing={1}>
          <Grid item xs={12} md={8} lg={8}>
            <center>
              <img alt="logo" style={{ width: '30%', marginLeft: 230, marginTop: 100 }} src={Logo} />
            </center>

            <Card
              sx={{
                alignItems: 'center',
                mt: 10,
                ml: 30,
                padding: 3,
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <Typography variant="overline" component={'strong'}>
                Si Aksi - Disposisi Online Web Apps Login Form
              </Typography>
              <Divider orientation="horizontal" sx={{ m: 3 }} variant="middle" />
              <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <Stack direction="column" spacing={3}>
                  <TextField
                    label="Type Your NIP"
                    value={formik.values.nip}
                    name="nip"
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon.AccountBoxTwoTone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Type Your Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon.LockTwoTone color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <LoadingButton
                    loading={loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Icon.LoginTwoTone />}
                    loadingPosition="start"
                    disabled={loading}
                  >
                    Login
                  </LoadingButton>
                </Stack>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
