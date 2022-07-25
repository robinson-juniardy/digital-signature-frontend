/* eslint-disable prefer-arrow-callback */
import {
  AppBar,
  Autocomplete,
  Button,
  Card,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { FormikProvider, useFormik } from 'formik';
import React, { forwardRef, useState, useEffect, useLayoutEffect } from 'react';
import API from '../../../hook/API';
import Iconify from '../../../components/Iconify';
import { useSnackbar } from 'notistack';
import DataTable from 'react-data-table-component';
import PrimeCharts from '../../../components/dataComponent/PrimeCharts';
import SuratKeluarTable from '../../../components/dataComponent/SuratKeluarTable';
import SuratMasukTable from '../../../components/dataComponent/SuratMasukTable';
// import SuratKeluarTable from '../components/SuratKeluarTable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const AdminHome = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [usersOpen, setUsersOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [jabatanData, setJabatanData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const form = useFormik({
    initialValues: {
      nip: '',
      password: '',
      nama: '',
      jabatan: null,
      role: null,
    },
    onSubmit: (values) => {
      API.post('/api/users/create', { ...values })
        .then((response) => {
          if (response.data.status === 1) {
            enqueueSnackbar('Data Berhasil Di Simpan', {
              variant: 'success',
              autoHideDuration: 3000,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
            getUsers();
          } else {
            console.log(response.data.message);
            enqueueSnackbar('Data Gagal Di Simpan', {
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
          enqueueSnackbar('Data Gagal Di Simpan', {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
        });
    },
  });

  const getJabatan = () => {
    API.get('/api/users/jabatan')
      .then((response) => {
        if (response.data.status === 1) {
          setJabatanData(response.data.data);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Jabatan Gagal Di Load', {
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
        enqueueSnackbar('Data Jabatan Gagal Di Load', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const getUsers = () => {
    API.get('/api/users/list')
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  useLayoutEffect(() => {
    getUsers();
    getJabatan();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          {/* <Card> */}
          <PrimeCharts />
          {/* </Card> */}
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Data Surat Keluar" {...a11yProps(0)} />
                <Tab label="Data Surat Masuk" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <SuratKeluarTable />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <SuratMasukTable />
              </TabPanel>
            </SwipeableViews>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminHome;
