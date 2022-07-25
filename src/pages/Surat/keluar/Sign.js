import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import useInstance from '../../../hook/useInstance';
import WebViewerComponent from '../../../components/WebViewer';
import API from '../../../hook/API';
import QRCode from 'qrcode';

const Sign = () => {
  const instance = useInstance();
  const signId = 1;
  const [signList, setSignList] = useState([]);
  const [signListValue, setSignListvalue] = useState(null);

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
  //   API.get(`/api/suratkeluar/sign-list/${signId}`)
  //     .then((response) => {
  //       if (response.data.status === 1) {
  //         setSignList(response.data.data);
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
        <Button onClick={handleSign} variant="contained" color="primary">
          Sign
        </Button>
      </Stack>

      <WebViewerComponent />
    </>
  );
};

export default Sign;
