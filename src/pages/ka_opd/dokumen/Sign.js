/* eslint-disable prefer-template */
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import useInstance from '../../../hook/useInstance';
import WebViewerComponent from '../../../components/WebViewer';
import API from '../../../hook/API';
import QRCode from 'qrcode';
import AuthContext from '../../../context/auth';
import {
  CheckCircleOutlined,
  CheckCircleOutlineSharp,
  SendAndArchive,
  SendAndArchiveOutlined,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Sign = (props) => {
  const { currentUser } = useContext(AuthContext);
  const instance = useInstance();
  const { enqueueSnackbar } = useSnackbar();
  const signId = currentUser.nip;
  const [signList, setSignList] = useState([]);
  const [signListValue, setSignListvalue] = useState(null);

  const formData = new FormData();

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
    formData.append('status', '1');
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
    const QRSign = await QRCode.toDataURL(String(signId))
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
      if (annot.fieldName === signListValue.field_annotation) {
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
    const field = fieldManager.getField(signListValue.field_annotation);
    annotationManager.deleteAnnotations(field.widgets);
  };

  // useLayoutEffect(() => {
  //   console.log(props.signType);
  //   API.get(`/api/suratkeluar/sign-list/${currentUser.id}`)
  //     .then((response) => {
  //       if (response.data.status === 1) {
  //         const signLists = response.data.data.filter((item) => item.sign_type === props.signType);
  //         console.log(signList);
  //         setSignList(signLists);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  return (
    <>
      <Stack marginBottom={4} direction="row" spacing={1}>
        <Autocomplete
          fullWidth
          options={signList}
          value={signListValue}
          getOptionLabel={(option) => option.judul}
          isOptionEqualToValue={(option, value) => option.judul === value.judul}
          onChange={async (e, v) => {
            setSignListvalue(v);
            instance.UI.loadDocument(`${process.env.REACT_APP_BACKEND}/uploads/${v.filename}`);
          }}
          renderInput={(props) => <TextField {...props} variant="standard" label="List Dokumen" />}
        />
        <Button startIcon={<CheckCircleOutlined />} onClick={handleSign} variant="contained" color="primary">
          Sign
        </Button>
        <Button startIcon={<SendAndArchiveOutlined />} onClick={handleSend} variant="contained" color="success">
          Send
        </Button>
      </Stack>

      <WebViewerComponent />
    </>
  );
};

export default Sign;
