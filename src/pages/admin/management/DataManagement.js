/* eslint-disable no-unneeded-ternary */
/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Autocomplete,
  TextField,
  Stack,
  InputAdornment,
  Card,
  Tooltip,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as Icon from '@mui/icons-material';
import { useFormik, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack';
import API from '../../../hook/API';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DataTableDemo.css';

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

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DataManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [jabatanData, setJabatanData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [editmode, setEditmode] = useState(false);
  const [settingAtribut, setSettingAtribut] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [usersAttr, setUsersAttr] = React.useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [filters1, setFilters1] = useState(null);
  const [filters2, setFilters2] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nama: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nip: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    atribut: { value: null, matchMode: FilterMatchMode.EQUALS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
    role_name: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [selectedRoles, setSelectedRoles] = useState(null);
  const [deleteRolesDialog, setDeleteRolesDialog] = useState(false);

  const AtributKhusus = ['Pemaraf', 'Penanda Tangan'];
  const Jabatan = ['KA.OPD', 'ESELON 3', 'ESELON 4', 'STAFF'];

  const Role = ['admin', 'operator', 'ka_opd', 'eselon_3', 'eselon_4', 'staff'];

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={AtributKhusus}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const jabatanItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };
  const roleItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={AtributKhusus}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Filter Atribut"
        className="p-column-filter"
        showClear
      />
    );
  };

  const JabatanRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={Jabatan}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={jabatanItemTemplate}
        placeholder="Filter Jabatan"
        className="p-column-filter"
        showClear
      />
    );
  };

  const roleRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={Role}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={roleItemTemplate}
        placeholder="Filter Role"
        className="p-column-filter"
        showClear
      />
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const getJabatan = () => {
    API.get('/api/users/jabatan/list')
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

  const getRoles = () => {
    API.get('/api/users/roles')
      .then((response) => {
        setRoles(response.data?.data);
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('Data Role Gagal Di Load', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const rolesCreate = (values) => {
    API.post('/api/users/roles', { ...values })
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
          getRoles();
          formRoles.resetForm();
        } else {
          console.log(response.data.message);
          enqueueSnackbar(response.data.message, {
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
  };

  const rolesUpdate = (values) => {
    API.put('/api/users/roles', { ...values })
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
          getRoles();
        } else {
          console.log(response.data.message);
          enqueueSnackbar(response.data.message, {
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
  };

  const rolesDelete = () => {
    API.delete('/api/users/roles', { data: { id_roles: selectedRoles.id } })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Data Berhasil Di Hapus', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          setDeleteRolesDialog(false);
          setSelectedRoles(null);
          getRoles();
        } else {
          console.log(response.data.message);
          enqueueSnackbar(response.data.message, {
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
        enqueueSnackbar('Data Gagal Di Hapus', {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      });
  };

  const userCreate = (values) => {
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
          form.resetForm();
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
  };

  const userUpdate = (values) => {
    API.post('/api/users/update', { ...values })
      .then((response) => {
        if (response.data.status === 1) {
          enqueueSnackbar('Data Berhasil Di Update', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
          });
          getUsers();
          form.resetForm();
          setEditmode(false);
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Update', {
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
        enqueueSnackbar('Data Gagal Di Update', {
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
        setUsersAttr(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  const form = useFormik({
    initialValues: {
      nip: '',
      password: '',
      nama: '',
      jabatan: null,
      role: null,
      atribut: null,
      pemaraf: false,
      penandatangan: false,
    },
    onSubmit: (values) => (editmode ? userUpdate(values) : userCreate(values)),
  });

  const formRoles = useFormik({
    initialValues: {
      roleId: null,
      roleName: '',
      disposisionLevel: 0,
    },
    enableReinitialize: true,
    onSubmit: (values) => rolesCreate(values),
  });

  const roleOptions = [
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
  ];

  const attrOptions = [
    {
      atribut: 'Pemaraf',
    },
    {
      atribut: 'Penanda Tangan',
    },
  ];

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const textEditorNumber = (options) => {
    return <InputText type="number" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const onRowEditRoles = (e) => {
    rolesUpdate(e.newData);
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <IconButton>
          <Icon.DeleteTwoTone color="action" onClick={() => confirmDeleteRoles(rowData)} />
        </IconButton>
      </>
    );
  }

  const confirmDeleteRoles = (roles) => {
    setSelectedRoles(roles);
    setDeleteRolesDialog(true);
  }

  const hideDeleteProductDialog = () => {
    setDeleteRolesDialog(false);
  }

  const deleteProductDialogFooter = (
    <>
      <Button startIcon={<Icon.Close />} variant="text" color="primary" onClick={hideDeleteProductDialog}>
        NO
      </Button>
      <Button startIcon={<Icon.Check />} variant="text" color="primary" onClick={rolesDelete}>
        YES
      </Button>
    </>
  );

  useEffect(() => {
    getUsers();
    getRoles();
    getJabatan();
  }, []);

  return (
    // <Container maxWidth="lg">
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab icon={<Icon.PersonOutline />} label="Users Management" {...a11yProps(0)} />
          <Tab icon={<Icon.SettingsAccessibility />} label="Role Management" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormikProvider value={form}>
                  <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                    <Stack direction="column" spacing={1}>
                      <TextField
                        disabled={editmode && true}
                        label="Nomor Induk Pegawai"
                        variant="standard"
                        name="nip"
                        value={form.values.nip}
                        onChange={form.handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon.AccountBoxTwoTone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        disabled={editmode && true}
                        type="password"
                        label="Password"
                        variant="standard"
                        name="password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon.LockTwoTone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        value={form.values.password}
                        onChange={form.handleChange}
                      />
                      <TextField
                        label="Nama"
                        variant="standard"
                        name="nama"
                        value={form.values.nama}
                        onChange={form.handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon.AccountBoxTwoTone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Autocomplete
                        options={roleOptions}
                        getOptionLabel={(option) => option.role}
                        value={form.values.role}
                        onChange={(e, v) => form.setFieldValue('role', v)}
                        isOptionEqualToValue={(option, value) => option.role === value.role}
                        renderInput={(props) => <TextField {...props} label="Role User" variant="standard" />}
                      />
                      <Autocomplete
                        options={jabatanData}
                        getOptionLabel={(option) => option.role_name}
                        value={form.values.jabatan}
                        onChange={(e, v) => form.setFieldValue('jabatan', v)}
                        isOptionEqualToValue={(option, value) => option.role_name === value.role_name}
                        renderInput={(props) => <TextField {...props} label="Jabatan" variant="standard" />}
                      />

                      <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Atribut Khusus</FormLabel>
                        <FormGroup>
                          <Stack direction="row" spacing={1}>
                            <FormControlLabel
                              label="Pemaraf"
                              control={
                                <Checkbox name="pemaraf" checked={form.values.pemaraf} onChange={form.handleChange} />
                              }
                            />
                            <FormControlLabel
                              label="Penanda Tangan"
                              control={
                                <Checkbox
                                  name="penandatangan"
                                  checked={form.values.penandatangan}
                                  onChange={form.handleChange}
                                />
                              }
                            />
                          </Stack>
                        </FormGroup>
                      </FormControl>
                      <Stack direction="row" spacing={1}>
                        <Button startIcon={<Icon.SaveTwoTone />} variant="contained" color="primary" type="submit">
                          {editmode ? 'Simpan perubahan' : 'Simpan'}
                        </Button>
                        <Button
                          onClick={() => setEditmode(false)}
                          startIcon={<Icon.Restore />}
                          variant="contained"
                          color="warning"
                          type="reset"
                        >
                          Reset Form
                        </Button>
                      </Stack>
                    </Stack>
                  </form>
                </FormikProvider>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <Card>
                <div className="datatable-crud-demo">
                  <div className="card">
                    <DataTable
                      showGridlines
                      className="p-datatable-customers"
                      dataKey="id"
                      filterDisplay="row"
                      filters={filters2}
                      header={
                        <Typography variant="overline" component="span">
                          User List
                        </Typography>
                      }
                      paginator
                      rows={5}
                      value={users}
                      rowsPerPageOptions={[5, 10, 25]}
                    >
                      {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                      <Column filter filterPlaceholder="Search By Nip" field="nip" header="Nip" sortable></Column>
                      <Column filter filterPlaceholder="Search By Nama" field="nama" header="Nama" sortable></Column>
                      <Column
                        field="role_name"
                        header="Jabatan"
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '12rem' }}
                        showFilterMenu={false}
                        filter
                        filterElement={JabatanRowFilterTemplate}
                      ></Column>
                      <Column
                        field="role"
                        header="Role"
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '12rem' }}
                        showFilterMenu={false}
                        filter
                        filterElement={roleRowFilterTemplate}
                      ></Column>
                      {/* <Column
                        field="atribut"
                        header="Atribut Khusus"
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '12rem' }}
                        showFilterMenu={false}
                        filter
                        filterElement={statusRowFilterTemplate}
                      /> */}
                      <Column
                        align="center"
                        alignHeader="center"
                        field="paraf"
                        header="Paraf"
                        body={(row) => {
                          if (row.paraf === 1) {
                            return <Icon.CheckCircleOutline color="success" />;
                          } else {
                            return <Icon.CancelOutlined color="error" />;
                          }
                        }}
                      />
                      <Column
                        align="center"
                        alignHeader="center"
                        field="tandatangan"
                        header="TTD"
                        body={(row) => {
                          if (row.tandatangan === 1) {
                            return <Icon.CheckCircleOutline color="success" />;
                          } else {
                            return <Icon.CancelOutlined color="error" />;
                          }
                        }}
                      />
                      <Column
                        // header="Actions"
                        body={(row) => {
                          return (
                            <Stack direction="row" spacing={2}>
                              <Tooltip title="Ubah Data">
                                <IconButton
                                  onClick={() => {
                                    setEditmode(true);
                                    form.setValues({
                                      nip: row.nip,
                                      jabatan: jabatanData.find((item) => item.id === row.jabatan),
                                      nama: row.nama,
                                      pemaraf: row.pemaraf === 1 ? true : false,
                                      penandatangan: row.tandatangan === 1 ? true : false,
                                      atribut:
                                        row.atribut !== null
                                          ? attrOptions.find((item) => item.atribut === row.atribut)
                                          : null,
                                      //   password: row.password,
                                      role: roleOptions.find((item) => item.value === row.role),
                                    });
                                  }}
                                >
                                  <Icon.EditTwoTone color="success" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Hapus">
                                <IconButton>
                                  <Icon.DeleteTwoTone color="error" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          );
                        }}
                      ></Column>
                    </DataTable>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <form onSubmit={formRoles.handleSubmit} onReset={formRoles.handleReset}>
                <Stack direction="column" spacing={1}>
                  <TextField
                    label="Role Name"
                    name="roleName"
                    onChange={formRoles.handleChange}
                    value={formRoles.values.roleName}
                    variant="standard"
                    fullWidth
                  />
                  <TextField
                    label="Disposisi Level"
                    type="number"
                    name="disposisionLevel"
                    onChange={formRoles.handleChange}
                    value={formRoles.values.disposisionLevel}
                    variant="standard"
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" type="submit" color="success" startIcon={<Icon.SaveOutlined />}>
                      Simpan
                    </Button>
                    <Button variant="contained" type="reset" color="inherit" startIcon={<Icon.RestoreOutlined />}>
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Card>
                <div className="datatable-crud-demo">
                  <div className="card">
                    <DataTable
                      header={
                        <>
                          <Typography variant="overline" component="span">
                            Role List
                          </Typography>
                        </>
                      }
                      editMode="row"
                      dataKey="id"
                      paginator
                      rows={10}
                      value={roles}
                      onRowEditComplete={onRowEditRoles}
                      rowsPerPageOptions={[10, 25, 50]}
                    >
                      <Column field="role_name" header="Role" editor={(options) => textEditor(options)} sortable></Column>
                      <Column field="disposision_level" header="Level Disposisi" editor={(options) => textEditorNumber(options)} sortable></Column>
                      <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                      <Column body={actionBodyTemplate} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
          <Dialog visible={deleteRolesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
              {selectedRoles && <span>Are you sure you want to delete Role Name : <b>{selectedRoles.role_name}</b> and Disposision Level = <b>{selectedRoles.disposision_level}</b>?</span>}
            </div>
          </Dialog>
        </TabPanel>
      </SwipeableViews>
    </Box>
    // </Container>
  );
};

export default DataManagement;
