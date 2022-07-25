/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import {
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import { filter } from 'lodash';
import { DeleteTwoTone, EditTwoTone, SettingsApplications, Signpost } from '@mui/icons-material';
import Scrollbar from '../../../components/Scrollbar';
import { UserListHead, UserListToolbar } from '../../../components';
import React, { useEffect, useState } from 'react';
import API from '../../../hook/API';
import { useSnackbar } from 'notistack';
import SearchNotFound from '../../../components/SearchNotFound';

const TABLE_HEAD = [
  { id: 'tanggal_upload', label: 'Tanggal Upload', alignRight: false },
  { id: 'judul', label: 'Judul', alignRight: false },
  { id: 'filename', label: 'File', alignRight: false },
  { id: 'perihal', label: 'Perihal', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_data) => _data.perihal_surat.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const SuratKeluarTable = React.memo(({ editProps, setOpenDialog }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('no_loket');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [surat, setSurat] = useState([]);

  const [editableData, setEditableData] = useState(null);

  const getSuratMasuk = () => {
    API.get('/api/suratkeluar')
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
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = surat.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDelete = (row) => {
    API.post('/api/admin/loket/delete', row)
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
        } else {
          console.log(response.data.message);
          enqueueSnackbar('Data Gagal Di Hapus', {
            variant: 'success',
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - surat.length) : 0;

  const filteredUsers = applySortFilter(surat, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    const interval = setInterval(() => {
      getSuratMasuk();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={surat.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { id, judul, tanggal_upload, filename, perihal } = row;
                const isItemSelected = selected.indexOf(id) !== -1;

                return (
                  <TableRow
                    hover
                    key={id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                    </TableCell>
                    {/* <TableCell component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={no_loket} src={avatarUrl} />
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </Stack>
                    </TableCell> */}
                    <TableCell align="left">{tanggal_upload.split('T')[0]}</TableCell>
                    <TableCell align="left">{judul}</TableCell>
                    <TableCell align="left">
                      <a href={`${process.env.REACT_APP_BACKEND}/uploads/${filename}`}>Lihat File</a>
                    </TableCell>
                    <TableCell align="left">{perihal}</TableCell>
                    {/* <TableCell align="left">
                      <Label variant="ghost" color={(status_loket === 'TUTUP' && 'error') || 'success'}>
                        {sentenceCase(status_loket)}
                      </Label>
                    </TableCell> */}
                    {/* <TableCell align="left">{petugas}</TableCell> */}
                    {/* <TableCell align="left">{id_guestbook}</TableCell> */}
                    {/* <TableCell align="left">{no_antrian}</TableCell> */}

                    <TableCell align="right">
                      <strong>
                        <Tooltip sx={{ mt: 2 }} title="Setting File">
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              editProps(row);
                              setOpenDialog(true);
                            }}
                          >
                            <SettingsApplications />
                          </IconButton>
                        </Tooltip>
                      </strong>
                      <strong>
                        <Tooltip sx={{ mt: 2 }} title="hapus data">
                          <IconButton color="error" onClick={() => handleDelete(row)}>
                            <DeleteTwoTone />
                          </IconButton>
                        </Tooltip>
                      </strong>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={surat.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
});

export default SuratKeluarTable;
