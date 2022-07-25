/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-const */
import {
  AppBar,
  Autocomplete,
  Button,
  Card,
  Container,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import * as Icons from '@mui/icons-material';
import { useFormik, FormikProvider } from 'formik';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import SuratMasukTable from '../masuk/SuratMasukTable';
import API from '../../../hook/API';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import Charts from '../masuk/Charts';
// import SuratKeluarTable from './SuratKeluarTable';
import SuratKeluarTable from '../../../components/dataComponent/SuratKeluarTable';
import Iconify from '../../../components/Iconify';
import WebViewer from '@pdftron/webviewer';
import PDFViewer from './PDFViewer';
import WebViewerComponent from 'src/components/WebViewer';
import Sign from './Sign';
import DataTable from 'react-data-table-component';
import PrimeCharts from '../../../components/dataComponent/PrimeCharts';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SuratKeluar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [EditValue, setEditValue] = useState(null);
  const [isSettingsFile, setIsSettingsFile] = useState(false);
  const [pemarafValue, setPemarafValue] = useState(null);
  const [ttdValue, setTtdValue] = useState(null);
  const [signature, setSignature] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploadDialog, setIsUploadDialog] = useState(false);
  const [isSignDialog, setIsSignDialog] = useState(false);
  const [suratkeluar, setsuratkeluar] = useState([]);
  const [anchor, setAnchor] = useState({
    x: undefined,
    y: undefined,
  });

  const viewerDiv = useRef(null);

  const getSignature = () => {
    API.get('/api/suratkeluar/signature')
      .then((response) => setSignature(response.data.data))
      .catch((error) => console.log(error));
  };

  const getTempSurat = () => {
    API.get('/api/suratkeluar/temp-status-data')
      .then((response) => setsuratkeluar(response.data.data))
      .catch((error) => console.log(error));
  };

  const formData = new FormData();
  const formik = useFormik({
    initialValues: {
      perihalSurat: '',
      judul: '',
      fileName: '',
    },
    onSubmit: (values) => {
      for (let value in values) {
        formData.append(value, values[value]);
      }
      API.post('/api/suratkeluar', formData)
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

  console.log(formData);

  useEffect(() => {
    getSignature();
    getTempSurat();
  }, [EditValue]);
  return (
    <>
      <Dialog fullScreen open={isSignDialog} onClose={() => setIsSignDialog(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setIsSignDialog(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sign Dokumen
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClosePdfDialog}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <br />
          <Grid container spacing={2}>
            <Grid item xs={6} md={6} lg={6}>
              <Sign />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <Dialog
        fullScreen
        open={isSettingsFile}
        onClose={() => setIsSettingsFile(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setIsSettingsFile(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              File Settings
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClosePdfDialog}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          <br />
          <Grid container spacing={2}>
            <Grid item xs={4} md={4} lg={4}>
              <Card sx={{ p: 4 }}>
                <Stack spacing={1} direction="column">
                  <Autocomplete
                    options={signature.filter((item) => item.type === 'ttd')}
                    getOptionLabel={(option) => option.nama}
                    isOptionEqualToValue={(options, values) => options.nama === values.nama}
                    renderInput={(props) => <TextField {...props} label="Penanda Tangan" variant="standard" />}
                  />
                  <Autocomplete
                    options={signature.filter((item) => item.type === 'pemaraf')}
                    getOptionLabel={(option) => option.nama}
                    isOptionEqualToValue={(options, values) => options.nama === values.nama}
                    renderInput={(props) => <TextField {...props} label="Pemaraf" variant="standard" />}
                  />
                  <Button variant="contained" color="primary" startIcon={<Icons.SaveTwoTone />}>
                    Simpan
                  </Button>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={8} md={8} lg={8}>
              <Card sx={{ p: 4 }}>
                <Stack spacing={1} direction="column">
                  <PDFViewer url={`${process.env.REACT_APP_BACKEND}/uploads/${EditValue?.filename}`} />
                  {/* <div
                    onDragStart={(e) => console.log(e.clientX)}
                    onMouseDownCapture={(e) => setAnchor({ ...anchor, x: e.clientX, y: e.clientY })}
                  >
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                      <Viewer fileUrl={`${process.env.REACT_APP_BACKEND}/uploads/${EditValue?.filename}`} />
                    </Worker>
                  </div>
                  <p>
                    Anchor Point X : {anchor.x} : Anchor Point Y : {anchor.y}
                  </p> */}
                  <Button variant="contained" color="primary" startIcon={<Icons.SaveTwoTone />}>
                    Set Anchor
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <Dialog
        fullScreen
        open={isUploadDialog}
        onClose={() => setIsUploadDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'fixed' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setIsUploadDialog(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Upload Dokumen Baru
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Grid padding={1} marginTop={10} container spacing={1}>
            {/* <Grid item xs={12} md={12} lg={12}>
              <Input
                //   style={{ }}
                onChange={(e) => {
                  setFileUrl(e.currentTarget.files[0].name);
                }}
                // accept="/*"
                id="icon-button-file"
                type="file"
              />
            </Grid> */}
            <Grid item xs={6} md={6} lg={6}>
              <WebViewerComponent />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <PDFViewer
                url={'http://www.africau.edu/images/default/sample.pdf'}
                formData={formData}
                setOpen={setIsUploadDialog}
              />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>{/* <PrimeCharts /> */}</Card>
        </Grid>

        <Grid item xs={12} md={8} lg={12}>
          {/* <Typography variant="h5">Surat Keluar</Typography> */}
          {/* <Card> */}
          <Stack direction="column" spacing={2}>
            <Button
              sx={{ width: '20%' }}
              onClick={(e) => setIsUploadDialog(true)}
              variant="contained"
              startIcon={<Icons.UploadFile />}
              color="primary"
            >
              Upload Dokumen Baru
            </Button>
            <SuratKeluarTable />
          </Stack>
          {/* </Card> */}
        </Grid>
      </Grid>
    </>
  );
};

export default SuratKeluar;
