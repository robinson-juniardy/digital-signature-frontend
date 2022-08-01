/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useFormik, FormikProvider } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
// import SuratMasukTable from './SuratMasukTable';
import API from '../../../hook/API';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import Charts from './Charts';
import DataTable from 'react-data-table-component';
import SuratMasukTable from '../../../components/dataComponent/SuratMasukTable';
import PrimeCharts from '../../../components/dataComponent/PrimeCharts';
import AuthContext from '../../../context/auth';

const SuratMasuk = () => {
  const { currentUser } = useContext(AuthContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [EditValue, setEditValue] = useState();
  const [surat, setSurat] = useState([]);

  const conditionalRow = [
    {
      when: (row) => row.jenis_surat === 'Penting',
      style: {
        backgroundColor: 'rgba(248, 148, 6, 0.9)',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      when: (row) => row.jenis_surat === 'Biasa',
      style: {
        backgroundColor: 'rgba(63, 195, 128, 0.9)',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  ];

  const formik = useFormik({
    initialValues: {
      tanggalTerimaSurat: moment().format('YYYY-MM-DD'),
      asalSurat: '',
      perihalSurat: '',
      jenisSurat: '',
      fileName: '',
      created_by: currentUser.id,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      API.post('/api/suratmasuk', formData)
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
            formik.resetForm();
            getSuratMasuk();
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
          enqueueSnackbar('Data Berhasil Di Simpan', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
        });
    },
  });
  const getSuratMasuk = () => {
    API.get('/api/suratmasuk')
      .then((response) => {
        if (response.data.status === 1) {
          setSurat(response.data.data);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('data gagal di load', {
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
        enqueueSnackbar('data loket gagal di load', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  useEffect(() => {
    getSuratMasuk();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1} direction="column" sx={{ p: 3 }}>
                  <TextField
                    type="date"
                    variant="standard"
                    label="Tanggal Terima Surat"
                    onChange={formik.handleChange}
                    name="tanggalTerimaSurat"
                    value={formik.values.tanggalTerimaSurat}
                  />
                  <TextField
                    variant="standard"
                    label="Asal Surat"
                    onChange={formik.handleChange}
                    name="asalSurat"
                    value={formik.values.asalSurat}
                  />
                  <TextField
                    variant="standard"
                    label="Perihal Surat"
                    onChange={formik.handleChange}
                    name="perihalSurat"
                    value={formik.values.perihalSurat}
                  />
                  <FormControl>
                    <FormLabel>Jenis Urgensi Surat</FormLabel>
                    <RadioGroup row name="jenisSurat" value={formik.values.jenisSurat} onChange={formik.handleChange}>
                      <FormControlLabel value="Penting" control={<Radio />} label="Penting" />
                      <FormControlLabel value="Biasa" control={<Radio />} label="Biasa" />
                    </RadioGroup>
                  </FormControl>
                  <label htmlFor="icon-button-file">
                    Upload File &nbsp;
                    <Input
                      //   style={{ }}
                      onChange={(e) => formik.setFieldValue('fileName', e.currentTarget.files[0])}
                      // accept="/*"
                      id="icon-button-file"
                      type="file"
                    />
                  </label>
                  <Button type="submit" variant="contained" color="primary" startIcon={<Icons.SaveTwoTone />}>
                    Simpan dan Upload
                  </Button>
                </Stack>
              </form>
            </FormikProvider>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={6} lg={8}>
          <Card>
            <PrimeCharts />
          </Card>
        </Grid> */}
        <Grid item xs={12} md={8} lg={12}>
          <Card>
            <SuratMasukTable />
            {/* <DataTable
              style={{ width: '100%' }}
              title="Surat Masuk"
              pagination
              defaultSortFieldId={'perihal_surat'}
              selectableRows
              conditionalRowStyles={conditionalRow}
              dense
              columns={[
                {
                  name: 'Perihal',
                  id: 'perihal_surat',
                  selector: (row) => row.perihal_surat,
                  sortable: true,
                },
                {
                  name: 'Tanggal Terima Surat',
                  id: 'tanggal_terimasurat',
                  selector: (row) => row.tanggal_terimasurat.split('T')[0],
                  sortable: true,
                },
                {
                  name: 'File',
                  id: 'filename',
                  selector: (row) => (
                    <a target="blank" href={`${process.env.REACT_APP_BACKEND}/uploads/${row.filename}`}>
                      Lihat File
                    </a>
                  ),
                  sortable: true,
                },
              ]}
              data={surat}
            /> */}
            {/* <SuratMasukTable editProps={setEditValue} /> */}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SuratMasuk;
