/* eslint-disable prefer-template */
import { Autocomplete, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import useInstance from '../../../hook/useInstance';
import WebViewerComponent from '../../../components/WebViewer';
import API from '../../../hook/API';
import QRCode from 'qrcode';
import AuthContext from '../../../context/auth';
import {
  CancelOutlined,
  CheckCircleOutlined,
  CheckCircleOutlineSharp,
  RestoreOutlined,
  SendAndArchive,
  SendAndArchiveOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Sign = () => {
  const { currentUser } = useContext(AuthContext);
  const instance = useInstance();
  const { enqueueSnackbar } = useSnackbar();
  const [signList, setSignList] = useState([]);
  const [signListValue, setSignListvalue] = useState(null);
  const [revisi, setRevisi] = useState(false);
  const [alasanRevisi, setAlasanRevisi] = useState('');

  const formData = new FormData();

  const handleRevisi = () => {
    API.post(`/api/suratkeluar/revisi`, {
      old_filename: signListValue.filename,
      status: 'Di Kembalikan',
      status_eksekusi: 'Di Kembalikan',
      status_level: 5,
      alasan_revisi: alasanRevisi,
    })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('File Berhasil Di Kirim Ke Operator', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
        } else {
          console.log(response.data.message);
          enqueueSnackbar('File Gagal Di Kirim', {
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
        enqueueSnackbar('File Gagal Di Kirim', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const handleSend = async () => {
    const doc = instance.Core.documentViewer.getDocument();
    const xfdfString = await instance.Core.annotationManager.exportAnnotations();
    const data = await doc.getFileData({
      // saves the document with annotations in it
      xfdfString,
    });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: 'application/pdf' });
    formData.append('fileName', blob, doc.getFilename());
    formData.append('old_filename', signListValue.filename);
    formData.append('status', 'Di Kirimkan');
    formData.append('status_eksekusi', currentUser.atribut === 'Pemaraf' ? 'Diparaf' : 'Di Tandatangani');
    formData.append('status_level', String(signListValue.level_eksekusi + 1));
    console.log(formData);
    const res = await API.post(process.env.REACT_APP_BACKEND + '/api/suratkeluar/sign', formData)
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('File Berhasil Di Kirim', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Kirim', {
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
        enqueueSnackbar('Data Gagal Di Kirim', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const handleSign = async () => {
    const QRSign = await QRCode.toDataURL(String(currentUser.nip))
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });
    const { annotationManager, documentViewer, Annotations, PDFNet } = instance.Core;
    await PDFNet.initialize();
    const doc = await documentViewer.getDocument().getPDFDoc();
    annotationManager.getAnnotationsList().forEach((annot) => {
      // setAnnotsList({
      //   fieldName: annot.fieldName,
      // });
      // const stampAnnotPemaraf = new Annotations.StampAnnotation();
      if (annot.fieldName === signListValue.annotation_field) {
        const stampAnnot = new Annotations.StampAnnotation();
        stampAnnot.PageNumber = 1;
        stampAnnot.X = annot.getX();
        stampAnnot.Y = annot.getY();
        stampAnnot.Width = 100;
        stampAnnot.Height = 100;
        const keepAsSVG = false;
        stampAnnot.setImageData(QRSign, keepAsSVG);
        annotationManager.addAnnotation(stampAnnot);
        annotationManager.redrawAnnotation(stampAnnot);
      }
    });
    const fieldManager = annotationManager.getFieldManager();
    const field = fieldManager.getField(signListValue.annotation_field);
    annotationManager.deleteAnnotations(field.widgets);
  };

  const getSignList = () => {
    API.get(`/api/suratkeluar/sign-list`, {
      params: {
        sign_id: currentUser.id,
        atribut: JSON.stringify(currentUser.atribut),
      },
    })
      .then((response) => {
        if (response.data.status === 1) {
          setSignList(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSignList();
  }, []);
  return (
    <>
      <Stack marginBottom={4} direction="column" spacing={1}>
        <Autocomplete
          fullWidth
          options={signList.filter((item) => item.level_eksekusi === item.status_level)}
          value={signListValue}
          getOptionLabel={(option) => option.judul}
          isOptionEqualToValue={(option, value) => option.judul === value.judul}
          onChange={async (e, v) => {
            setSignListvalue(v);
            instance.UI.loadDocument(`${process.env.REACT_APP_BACKEND}/uploads/${v.filename}`);
          }}
          renderInput={(props) => <TextField {...props} variant="standard" label="List Dokumen" />}
        />
        <Stack direction="row" spacing={1}>
          <Button startIcon={<CheckCircleOutlined />} onClick={handleSign} variant="contained" color="primary">
            Sign
          </Button>
          <Button startIcon={<SendAndArchiveOutlined />} onClick={handleSend} variant="contained" color="success">
            Send
          </Button>
          {revisi ? (
            <Button startIcon={<CancelOutlined />} onClick={() => setRevisi(false)} variant="contained" color="error">
              Batalkan
            </Button>
          ) : (
            <Button startIcon={<RestoreOutlined />} onClick={() => setRevisi(true)} variant="contained" color="warning">
              Revisi / Kembalikan
            </Button>
          )}
        </Stack>
        {revisi && (
          <Stack direction="row" spacing={1}>
            <TextField
              multiline
              fullWidth
              value={alasanRevisi}
              onChange={(e) => setAlasanRevisi(e.target.value)}
              label="Alasan Pengembalian / Revisi"
            />
            <Button startIcon={<SendAndArchiveOutlined />} onClick={handleRevisi} variant="contained" color="primary">
              Kirim
            </Button>
          </Stack>
        )}
      </Stack>
      {signListValue !== null && (
        <Typography variant="caption">
          Anda adalah {currentUser.atribut} Dengan Level Eksekusi Level {signListValue.level_eksekusi} Pada Dokumen Ini
        </Typography>
      )}

      <WebViewerComponent />
    </>
  );
};

export default Sign;
