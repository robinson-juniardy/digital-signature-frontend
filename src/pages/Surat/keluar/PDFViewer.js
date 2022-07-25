/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react';
import WebViewer, { getInstance } from '@pdftron/webviewer';
import QRImage from '../../../components/qrimage.png';
import { saveAs } from 'file-saver';
import { Autocomplete, Button, Divider, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import useInstance from '../../../hook/useInstance';
import QRCode from 'qrcode';
import { Formik, useFormik, FormikProvider, FieldArray } from 'formik';
import { useSnackbar } from 'notistack';
import API from '../../../hook/API';
import { DeleteOutline } from '@mui/icons-material';
import * as Icon from '@mui/icons-material';

const PDFViewer = ({ url, formData, setOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const viewer = useRef(null);
  const instance = useInstance();
  const [annotsList, setAnnotsList] = useState([]);
  const [annotName, setAnnotName] = useState(null);
  const [signature, setSignature] = useState(null);
  const [users, setUsers] = useState(null);

  //   useEffect(() => {
  //     WebViewer(
  //       {
  //         path: '/lib',
  //         // initialDoc: url,
  //         enableFilePicker: true,
  //         fullAPI: true,
  //       },
  //       viewer.current
  //     ).then((instance) => {
  //       setInstance(instance);
  //       const { documentViewer, annotationManager, Annotations, PDFNet } = instance.Core;

  //       //   instance.Core.annotationManager.deleteAnnotation(widgets);

  //       //   Annotations.SignatureWidgetAnnotation.prototype.createSignHereElement = () => {
  //       //     const div = document.createElement('div');
  //       //     div.style.width = '100%';
  //       //     div.style.height = '100%';
  //       //     div.style.cursor = 'pointer';

  //       //     const inlineSvg =
  //       //       '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.588 25.588" style={{"enableBackground":"new 0 0 25.588 25.588","width":"100%","height":"100%","transform":"translateX(-35%)"}} xml:space="preserve"><g><path style={{"fill":"#030104"}} d="M18.724,9.903l3.855,1.416l-3.206,8.729c-0.3,0.821-1.927,3.39-3.06,3.914l-0.275,0.75c-0.07,0.19-0.25,0.309-0.441,0.309c-0.054,0-0.108-0.01-0.162-0.029c-0.243-0.09-0.369-0.359-0.279-0.604l0.26-0.709c-0.575-1.117-0.146-4.361,0.106-5.047L18.724,9.903z M24.303,0.667c-1.06-0.388-2.301,0.414-2.656,1.383l-2.322,6.326l3.854,1.414l2.319-6.325C25.79,2.673,25.365,1.056,24.303,0.667z M17.328,9.576c0.108,0.04,0.219,0.059,0.327,0.059c0.382,0,0.741-0.234,0.882-0.614l2.45-6.608c0.181-0.487-0.068-1.028-0.555-1.208c-0.491-0.178-1.028,0.068-1.209,0.555l-2.45,6.608C16.592,8.855,16.841,9.396,17.328,9.576z M13.384,21.967c-0.253-0.239-0.568-0.537-1.078-0.764c-0.42-0.187-0.829-0.196-1.128-0.203c-0.031,0-0.067-0.001-0.103-0.002c-0.187-0.512-0.566-0.834-1.135-0.96c-0.753-0.159-1.354,0.196-1.771,0.47c0.037-0.21,0.098-0.46,0.143-0.64c0.144-0.58,0.292-1.18,0.182-1.742c-0.087-0.444-0.462-0.774-0.914-0.806c-1.165-0.065-2.117,0.562-2.956,1.129c-0.881,0.595-1.446,0.95-2.008,0.749c-0.686-0.244-0.755-2.101-0.425-3.755c0.295-1.49,0.844-4.264,2.251-5.524c0.474-0.424,1.16-0.883,1.724-0.66c0.663,0.26,1.211,1.352,1.333,2.653c0.051,0.549,0.53,0.952,1.089,0.902c0.55-0.051,0.954-0.539,0.902-1.089c-0.198-2.12-1.192-3.778-2.593-4.329C6.058,7.07,4.724,6.982,3.107,8.429c-1.759,1.575-2.409,4.246-2.88,6.625c-0.236,1.188-0.811,5.13,1.717,6.029c1.54,0.549,2.791-0.298,3.796-0.976c0.184-0.124,0.365-0.246,0.541-0.355c-0.167,0.725-0.271,1.501,0.167,2.155c0.653,0.982,1.576,1.089,2.742,0.321c0.045-0.029,0.097-0.063,0.146-0.097c0.108,0.226,0.299,0.475,0.646,0.645c0.42,0.206,0.84,0.216,1.146,0.224c0.131,0.003,0.31,0.007,0.364,0.031c0.188,0.083,0.299,0.185,0.515,0.389c0.162,0.153,0.333,0.312,0.55,0.476c0.18,0.135,0.39,0.199,0.598,0.199c0.304,0,0.605-0.139,0.801-0.4c0.331-0.442,0.241-1.069-0.201-1.4C13.61,22.183,13.495,22.072,13.384,21.967z"/></g></svg>';
  //       //     div.innerHTML = 'Pemaraf';

  //       //     return div;
  //       //   };

  //       //   documentViewer.addEventListener('annotationsLoaded', () => {
  //       //     const signatureWidgetAnnots = annotationManager
  //       //       .getAnnotationsList()
  //       //       .filter((annot) => annot instanceof Annotations.SignatureWidgetAnnotation);

  //       //     signatureWidgetAnnots.forEach((annot) => {
  //       //       annot.annot
  //       //     });
  //       //   });

  //       instance.UI.setHeaderItems((header) => {
  //         header.push({
  //           type: 'actionButton',
  //           img: 'icon-save',

  //           onClick: async () => {
  //             const doc = documentViewer.getDocument();
  //             const xfdfString = await annotationManager.exportAnnotations();
  //             const data = await doc.getFileData({
  //               // saves the document with annotations in it
  //               xfdfString,
  //             });
  //             const arr = new Uint8Array(data);
  //             const blob = new Blob([arr], { type: 'application/pdf' });
  //             formData.append('fileName', blob, doc.getFilename());
  //             console.log(formData);
  //             const res = await fetch(process.env.REACT_APP_BACKEND + '/api/suratkeluar', {
  //               method: 'POST',
  //               body: formData,
  //             })
  //               .then((response) => {
  //                 console.log(response);
  //               })
  //               .catch((error) => console.log(error));
  //           },
  //         });
  //       });

  //       annotationManager.getAnnotationsList().forEach((annot) => {
  //         if (annot instanceof Annotations.SignatureWidgetAnnotation) {
  //           widgets.push(annot);
  //         }
  //       });
  //       widgets.forEach((annot) => {
  //         const field = annotationManager.getFieldManager().getField(annot.fieldName);
  //         const widgetAnnot = new Annotations.StampAnnotation(field);

  //         console.log(field);

  //         widgetAnnot.PageNumber = annot.PageNumber;
  //         widgetAnnot.X = annot.X;
  //         widgetAnnot.Y = annot.Y;
  //         widgetAnnot.Width = annot.Width;
  //         widgetAnnot.Height = annot.Height;

  //         annotationManager.addAnnotation(widgetAnnot);
  //         annotationManager.drawAnnotationsFromList([widgetAnnot]);
  //       });
  //     });
  //   }, []);

  //   const Paraf = async (instances) => {
  //     const { annotationManager, documentViewer, Annotations, PDFNet } = instance;
  //     cnsole.log('jalan');
  //     await PDFNet.initialize();
  //     const doc = await documentViewer.getDocument().getPDFDoc();
  //     Annotations.SignatureWidgetAnnotation.prototype.createSignHereElement = () => {
  //       const div = document.createElement('div');
  //       div.style.width = '100%';
  //       div.style.height = '100%';
  //       div.style.cursor = 'pointer';

  //       const inlineSvg =
  //         '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 25.588 25.588" style={{"enableBackground":"new 0 0 25.588 25.588","width":"100%","height":"100%","transform":"translateX(-35%)"}} xml:space="preserve"><g><path style={{"fill":"#030104"}} d="M18.724,9.903l3.855,1.416l-3.206,8.729c-0.3,0.821-1.927,3.39-3.06,3.914l-0.275,0.75c-0.07,0.19-0.25,0.309-0.441,0.309c-0.054,0-0.108-0.01-0.162-0.029c-0.243-0.09-0.369-0.359-0.279-0.604l0.26-0.709c-0.575-1.117-0.146-4.361,0.106-5.047L18.724,9.903z M24.303,0.667c-1.06-0.388-2.301,0.414-2.656,1.383l-2.322,6.326l3.854,1.414l2.319-6.325C25.79,2.673,25.365,1.056,24.303,0.667z M17.328,9.576c0.108,0.04,0.219,0.059,0.327,0.059c0.382,0,0.741-0.234,0.882-0.614l2.45-6.608c0.181-0.487-0.068-1.028-0.555-1.208c-0.491-0.178-1.028,0.068-1.209,0.555l-2.45,6.608C16.592,8.855,16.841,9.396,17.328,9.576z M13.384,21.967c-0.253-0.239-0.568-0.537-1.078-0.764c-0.42-0.187-0.829-0.196-1.128-0.203c-0.031,0-0.067-0.001-0.103-0.002c-0.187-0.512-0.566-0.834-1.135-0.96c-0.753-0.159-1.354,0.196-1.771,0.47c0.037-0.21,0.098-0.46,0.143-0.64c0.144-0.58,0.292-1.18,0.182-1.742c-0.087-0.444-0.462-0.774-0.914-0.806c-1.165-0.065-2.117,0.562-2.956,1.129c-0.881,0.595-1.446,0.95-2.008,0.749c-0.686-0.244-0.755-2.101-0.425-3.755c0.295-1.49,0.844-4.264,2.251-5.524c0.474-0.424,1.16-0.883,1.724-0.66c0.663,0.26,1.211,1.352,1.333,2.653c0.051,0.549,0.53,0.952,1.089,0.902c0.55-0.051,0.954-0.539,0.902-1.089c-0.198-2.12-1.192-3.778-2.593-4.329C6.058,7.07,4.724,6.982,3.107,8.429c-1.759,1.575-2.409,4.246-2.88,6.625c-0.236,1.188-0.811,5.13,1.717,6.029c1.54,0.549,2.791-0.298,3.796-0.976c0.184-0.124,0.365-0.246,0.541-0.355c-0.167,0.725-0.271,1.501,0.167,2.155c0.653,0.982,1.576,1.089,2.742,0.321c0.045-0.029,0.097-0.063,0.146-0.097c0.108,0.226,0.299,0.475,0.646,0.645c0.42,0.206,0.84,0.216,1.146,0.224c0.131,0.003,0.31,0.007,0.364,0.031c0.188,0.083,0.299,0.185,0.515,0.389c0.162,0.153,0.333,0.312,0.55,0.476c0.18,0.135,0.39,0.199,0.598,0.199c0.304,0,0.605-0.139,0.801-0.4c0.331-0.442,0.241-1.069-0.201-1.4C13.61,22.183,13.495,22.072,13.384,21.967z"/></g></svg>';
  //       div.innerHTML = 'Pemaraf';

  //       return div;
  //     };
  //   };

  const pemaraf = 'robinson';
  const ttd = 'edwin';

  const formDatas = new FormData();

  const form = useFormik({
    initialValues: {
      judul: '',
      perihalSurat: '',
      fileName: '',
      annotations: [
        {
          type: '',
          annotationField: '',
          userSignature: undefined,
          level: 0,
        },
      ],
    },
    onSubmit: (values) => {
      const exportPDFData = async () => {
        const { annotationManager, documentViewer, Annotations, PDFNet } = instance.Core;
        const doc = documentViewer.getDocument();
        const xfdfString = await annotationManager.exportAnnotations();
        const data = await doc.getFileData({
          // saves the document with annotations in it
          xfdfString,
        });
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });
        formDatas.append('fileName', blob, doc.getFilename());
      };

      exportPDFData()
        .then(() => {
          for (let value in values) {
            console.log(value);
            formDatas.append(value, values[value]);
          }

          formDatas.append('annot', JSON.stringify(values.annotations));
          for (let p of formDatas) {
            console.log(p);
          }
          API.post('/api/suratkeluar', formDatas)
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
                form.resetForm();
                setOpen(false);
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
        })
        .catch((error) => console.log(error));
    },
  });

  //   if (instance) {
  //     const { annotationManager, documentViewer, Annotations, PDFNet } = instance.Core;

  //     const getFieldNameAndValue = (field) => {
  //       // Do something with data
  //       const { name, value } = field;
  //       console.log(`Name: ${name}, Value: ${value}`);

  //       // Check children fields
  //       field.children.forEach(getFieldNameAndValue);
  //     };

  //     annotationManager.addEventListener('annotationSelected', (annotations, action) => {
  //       if (action === 'selected') {
  //         // const fieldManager = annotationManager.getFieldManager();
  //         // fieldManager.forEachField(getFieldNameAndValue);
  //       } else if (action === 'deselected') {
  //         // setAnnotName(null);
  //       }

  //       const fieldManager = annotationManager.getFieldManager();
  //       fieldManager.forEachField(getFieldNameAndValue);

  //       if (annotations === null && action === 'deselected') {
  //         setAnnotName(null);
  //       }
  //     });
  //   }

  const loadField = async () => {
    const list = [];
    const { annotationManager, documentViewer, Annotations, PDFNet } = instance.Core;
    await PDFNet.initialize();
    const doc = await documentViewer.getDocument().getPDFDoc();

    const getFieldNameAndValue = (field) => {
      // Do something with data
      const { name, value } = field;
      list.push({
        fieldName: name,
      });

      // Check children fields
      field.children.forEach(getFieldNameAndValue);
    };

    const fieldManager = annotationManager.getFieldManager();
    fieldManager.forEachField(getFieldNameAndValue);

    setAnnotsList(list);
  };

  const getSignature = () => {
    API.get('/api/suratkeluar/signature')
      .then((response) => setSignature(response.data.data))
      .catch((error) => console.log(error));
  };

  const loadDocumentData = async () => {
    const { annotationManager, documentViewer, Annotations, PDFNet } = instance.Core;
    await PDFNet.initialize();
    const doc = await documentViewer.getDocument().getPDFDoc();

    const imageParaf = await QRCode.toDataURL(pemaraf)
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });
    const imageTtd = await QRCode.toDataURL(ttd)
      .then((url) => {
        return url;
      })
      .catch((err) => {
        console.error(err);
      });

    // documentViewer.getAnnotationsLoadedPromise().then(() => {
    //   const fieldManager = annotationManager.getFieldManager();
    //   const field = fieldManager.getField('ttd');
    //   field.setValue('Robinson Juniardi');
    // });

    // Run PDFNet methods with memory management
    annotationManager.getAnnotationsList().forEach((annot) => {
      console.log([annot.fieldName]);
      setAnnotsList({
        fieldName: annot.fieldName,
      });
      // const stampAnnotPemaraf = new Annotations.StampAnnotation();
      if (annot.fieldName === 'pemaraf') {
        const stampAnnot = new Annotations.StampAnnotation();
        stampAnnot.PageNumber = 1;
        stampAnnot.X = annot.getX();
        stampAnnot.Y = annot.getY();
        stampAnnot.Width = 100;
        stampAnnot.Height = 100;
        const keepAsSVG = false;
        stampAnnot.setImageData(imageParaf, keepAsSVG);
        annotationManager.addAnnotation(stampAnnot);
        annotationManager.redrawAnnotation(stampAnnot);
      }
      if (annot.fieldName === 'ttd') {
        const stampAnnot = new Annotations.StampAnnotation();
        stampAnnot.PageNumber = 1;
        stampAnnot.X = annot.getX();
        stampAnnot.Y = annot.getY();
        stampAnnot.Width = 100;
        stampAnnot.Height = 100;
        const keepAsSVG = false;
        stampAnnot.setImageData(imageTtd, keepAsSVG);
        annotationManager.addAnnotation(stampAnnot);
        annotationManager.redrawAnnotation(stampAnnot);
      }
    });

    // const doc = await documentViewer.getDocument().getPDFDoc();
    // const foundCertificationField = await doc.getField('pemaraf');
    // const certificationSigField = await PDFNet.DigitalSignatureField.createFromField(foundCertificationField);
    // console.log(certificationSigField);
  };

  useEffect(() => {
    getSignature();
  }, []);

  return (
    <>
      {/* <pre>{annotName !== null ? annotName : ''}</pre> */}

      <FormikProvider value={form}>
        <form autoComplete="off" onSubmit={form.handleSubmit}>
          <Stack direction="column" spacing={1}>
            <TextField variant="standard" label="Judul / Redaksi" name="judul" onChange={form.handleChange} />
            <TextField variant="standard" label="Perihal" name="perihalSurat" onChange={form.handleChange} />
          </Stack>

          <FieldArray
            name="annotations"
            render={(helpers) => (
              <>
                {form.values.annotations.map((annot, index) => (
                  <Stack key={index} alignItems="center" spacing={1} direction={'row'}>
                    <Autocomplete
                      fullWidth
                      options={annotsList.length > 0 ? annotsList : []}
                      getOptionLabel={(option) => option?.fieldName}
                      onChange={(e, v) => {
                        const props = { ...form.values };
                        props.annotations[index].annotationField = v?.fieldName;
                        form.setValues(props);
                      }}
                      isOptionEqualToValue={(option, value) => option?.fieldName === value?.fieldName}
                      renderInput={(props) => <TextField label="Pilih Field" {...props} variant="standard" />}
                    />
                    <Autocomplete
                      fullWidth
                      options={[
                        {
                          type: 'Paraf',
                          value: 'Pemaraf',
                          prefix: 'Pemaraf',
                        },
                        {
                          type: 'Tanda Tangan',
                          value: 'Penanda Tangan',
                          prefix: 'Penanda Tangan',
                        },
                      ]}
                      getOptionLabel={(option) => option?.type}
                      onChange={(e, v) => {
                        const props = { ...form.values };
                        props.annotations[index].type = v?.value;
                        form.setValues(props);
                        API.get('/api/users/list', {
                          params: {
                            atribut: v?.prefix,
                          },
                        })
                          .then((response) => {
                            setUsers(response.data.data);
                            setUsersAttr(response.data.data);
                          })
                          .catch((error) => console.log(error));
                      }}
                      isOptionEqualToValue={(option, value) => option?.value === value?.value}
                      renderInput={(props) => <TextField label="Pilih Tipe Signature" {...props} variant="standard" />}
                    />

                    {users !== null && (
                      <Autocomplete
                        fullWidth
                        onChange={(e, v) => {
                          const props = { ...form.values };
                          props.annotations[index].userSignature = v?.id;
                          form.setValues(props);
                        }}
                        groupBy={(option) => option.role_name}
                        options={users}
                        getOptionLabel={(option) => option.nama}
                        isOptionEqualToValue={(options, values) => options.nama === values.nama}
                        renderInput={(props) => <TextField {...props} label="Pilih Users" variant="standard" />}
                      />
                    )}

                    <TextField
                      fullWidth
                      type="number"
                      label="Level Eksekusi"
                      name={`annotations[${index}].level`}
                      variant="standard"
                      value={form.values.annotations[index].level}
                      onChange={form.handleChange}
                    />

                    <strong>
                      <Tooltip title="Hapus baris">
                        <IconButton size="small" onClick={() => helpers.remove(index)} color="error">
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    </strong>
                  </Stack>
                ))}
                <Button
                  disabled={form.values.annotations.length === 3}
                  sx={{ marginTop: 2 }}
                  variant="contained"
                  color="primary"
                  startIcon={<Icon.AddOutlined />}
                  onClick={() =>
                    helpers.push({
                      type: '',
                      annotationField: '',
                      userSignature: undefined,
                      level: 0,
                    })
                  }
                >
                  Tambah Field
                </Button>
              </>
            )}
          />
          <Divider sx={{ marginTop: 2 }} orientation="horizontal" />
          <Stack direction={'row'} spacing={1} marginTop={2}>
            <Button
              startIcon={<Icon.RefreshOutlined />}
              variant="contained"
              color="primary"
              onClick={() => loadField()}
            >
              Load Anotasi
            </Button>
            <Button startIcon={<Icon.SaveOutlined />} variant="contained" color="success" type="submit">
              Simpan Konfigurasi
            </Button>
          </Stack>
        </form>
      </FormikProvider>
    </>
  );
};

export default PDFViewer;
