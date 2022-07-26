/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable prefer-arrow-callback */
import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import WebViewerComponent from '../../components/WebViewer';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import useInstance from '../../hook/useInstance';
import WebViewer from '@pdftron/webviewer';
import { Autocomplete, Container, Grid, Stack, TextField } from '@mui/material';
import { ArchiveOutlined, Check, Filter, Filter1, SwitchAccount, ViewAgenda } from '@mui/icons-material';
import API from '../../hook/API';
import useAuth from '../../hook/useAuth';
import AuthContext from '../../context/auth';
import Iconify from '../../components/Iconify';
import { useSnackbar } from 'notistack';
import background from '../../assets/image/bg1.png';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DisposisiComponent = ({ open, setOpen, filename, rows }) => {
  const [suratmasuk, setSuratmasuk] = useState([]);
  const [listDisposisi, setlistDisposisi] = useState(null);
  const [disposisiValue, setDisposisiValue] = useState(null);
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  console.log(rows);

  const instance = useInstance();
  const url = `${process.env.REACT_APP_BACKEND}/uploads/${filename}`;

  const load = () => {
    instance.UI.loadDocument(url);
  };

  const getUsers = () => {
    API.get('api/users/list')
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleProses = async () => {
    await API.post('/api/suratmasuk/proses', {
      status: 1,
      user_role: currentUser.role,
      disposisi_id: rows.disposisi_id,
      id_surat: rows.id_surat,
      created_by: currentUser.nip,
    })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Data Berhasil Di Proses', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          setOpen(false);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Proses', {
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
        enqueueSnackbar('Data Gagal Di Proses', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const handleSelesai = () => {
    API.post('/api/suratmasuk/selesai', {
      status: 3,
      id_surat: rows.id_surat,
      created_by: currentUser.nip,
      user_role: currentUser.role,
      disposisi_id: rows.disposisi_id,
    })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Data Berhasil Di Proses', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          // setOpen(false);
          // handleArsipkan();
          API.post('/api/suratmasuk/arsip', {
            jenis_arsip: 'suratmasuk',
            id_surat: rows.id_surat,
            created_by: currentUser.nip,
          })
            .then((res) => {
              if (res.data.status === 1) {
                enqueueSnackbar('Data Berhasil Di Arsipkan', {
                  variant: 'success',
                  autoHideDuration: 3000,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                });
                // handleSelesai();
                setOpen(false);
              } else {
                console.log(res.data.message);
                enqueueSnackbar('Data Gagal Di Arsipkan', {
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
              enqueueSnackbar('Data Gagal Di Arsipkan', {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
              });
            });
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Proses', {
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
        enqueueSnackbar('Data Gagal Di Proses', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const handleArsipkan = () => {
    API.post('/api/suratmasuk/arsip', {
      jenis_arsip: 'suratmasuk',
      id_surat: rows.id_surat,
      created_by: currentUser.nip,
    })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Data Berhasil Di Arsipkan', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          handleSelesai();
          setOpen(false);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Arsipkan', {
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
        enqueueSnackbar('Data Gagal Di Arsipkan', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const handleDisposisi = () => {
    API.post('api/suratmasuk/disposisi', {
      idSurat: rows.id_surat,
      disposisiUser: parseInt(disposisiValue),
      role: currentUser.role,
      disposisi_id: rows.disposisi_id,
      status: 0,
      disposisiBy: currentUser.id,
    })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Berhasil Mendisposisikan Dokumen', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          setDisposisiValue(null);
          setUsers([]);
          setOpen(false);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Gagal Mendisposisikan Dokumen', {
            variant: 'Error',
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
        enqueueSnackbar('Gagal Mendisposisikan Dokumen', {
          variant: 'Error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  return (
    <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(false)}>
            <Iconify icon="eva:close-square-outline" width={24} height={24} />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Detail Dokumen Surat Masuk
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <Container maxWidth="lg"> */}
      {rows !== null && (
        <Grid
          style={{
            backgroundImage: `url(${background})`,
          }}
          padding={5}
          container
          spacing={1}
        >
          <Grid item xs={12} md={8} lg={6}>
            <Stack direction="column" spacing={1}>
              <Stack direction={'row'} spacing={1}>
                <Button
                  sx={{ width: '20%' }}
                  startIcon={<Filter1 />}
                  color="primary"
                  variant="contained"
                  onClick={load}
                >
                  Lihat Dokumen
                </Button>
                {currentUser.role === 'ka_opd' ? (
                  rows.status_dokumen2 === 3 || rows.status_dokumen2 === 5 ? null : (
                    <>
                      {rows.status_dokumen2 !== 2 && (
                        <>
                          {rows.status_dokumen2 === 1 ? (
                            <Button
                              onClick={handleSelesai}
                              sx={{ width: '20%' }}
                              startIcon={<Check />}
                              color="warning"
                              variant="contained"
                            >
                              Selesai
                            </Button>
                          ) : (
                            <Button
                              onClick={handleProses}
                              sx={{ width: '20%' }}
                              startIcon={<Check />}
                              color="warning"
                              variant="contained"
                            >
                              Proses
                            </Button>
                          )}
                          {rows.status_dokumen2 !== 1 && (
                            <Button
                              sx={{ width: '20%' }}
                              onClick={getUsers}
                              startIcon={<SwitchAccount />}
                              color="inherit"
                              variant="contained"
                            >
                              Disposisi
                            </Button>
                          )}

                          {rows.status_dokumen2 !== 1 && (
                            <Button
                              onClick={handleArsipkan}
                              sx={{ width: '20%' }}
                              startIcon={<ArchiveOutlined />}
                              color="success"
                              variant="contained"
                            >
                              Arsipkan
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )
                ) : rows.status_dokumen2 === 5 ? null : (
                  <>
                    {rows.status_dokumen2 === 4 ? (
                      <Button
                        onClick={handleSelesai}
                        sx={{ width: '20%' }}
                        startIcon={<Check />}
                        color="warning"
                        variant="contained"
                      >
                        Selesai
                      </Button>
                    ) : (
                      <Button
                        onClick={handleProses}
                        sx={{ width: '20%' }}
                        startIcon={<Check />}
                        color="warning"
                        variant="contained"
                      >
                        Proses
                      </Button>
                    )}

                    {rows.status_dokumen2 !== 4 && currentUser.role !== 'staff' && (
                      <Button
                        sx={{ width: '20%' }}
                        onClick={getUsers}
                        startIcon={<SwitchAccount />}
                        color="inherit"
                        variant="contained"
                      >
                        Disposisi
                      </Button>
                    )}

                    {rows.status_dokumen2 !== 4 && currentUser.role !== 'staff' && (
                      <Button
                        onClick={handleArsipkan}
                        sx={{ width: '20%' }}
                        startIcon={<ArchiveOutlined />}
                        color="success"
                        variant="contained"
                      >
                        Arsipkan
                      </Button>
                    )}
                  </>
                )}
              </Stack>
              <Stack sx={{ width: '50%' }} direction="column" spacing={1}>
                <Autocomplete
                  options={users.filter((item) => item.disposision_level === currentUser.disposision_level - 1)}
                  getOptionLabel={(option) => option.nama}
                  onChange={(e, v) => {
                    setDisposisiValue(v?.id);
                  }}
                  isOptionEqualToValue={(option, value) => option.nama === value.nama}
                  renderInput={(props) => <TextField {...props} variant="standard" label="User Untuk Disposisi" />}
                />
                <Button onClick={handleDisposisi} variant="contained" color="primary" startIcon={<SwitchAccount />}>
                  Disposisikan
                </Button>
              </Stack>
              <WebViewerComponent />
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* </Container> */}
    </Dialog>
  );
};

export default DisposisiComponent;
