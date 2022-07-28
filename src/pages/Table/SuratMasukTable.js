/* eslint-disable prefer-template */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import PropTypes from 'prop-types';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import AuthContext from '../../context/auth';

import { Badge } from 'primereact/badge';

import API from '../../hook/API';
import { AppBar, Box, Button, IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { DetailsOutlined } from '@mui/icons-material';

const SuratMasukTable = React.memo(({ open, setOpen, setFilename, setRows }) => {
  const { currentUser } = React.useContext(AuthContext);
  const [data, setdata] = React.useState([]);
  const [expandedRows, setExpandedRows] = React.useState(null);
  const [filters2, setFilters2] = React.useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    judul: { value: null, matchMode: FilterMatchMode.CONTAINS },
    perihal_surat: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status_dokumen: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const expandAll = () => {
    let _expandedRows = {};
    data.forEach((p) => (expandedRows[`${p.id_surat}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const StatusEksekusi = ['Masuk Ke KA.OPD', 'Di Proses', 'Diposisi', 'Selesai Di Proses', 'Disposisi Selesai'];

  const getData = () => {
    API.get(
      currentUser.role === 'ka_opd'
        ? `/api/suratmasuk/suratmasuk-dan-disposisi`
        : `/api/suratmasuk/suratmasuk-dan-disposisi/${currentUser.id}`
    )
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const FilenameTemplate = (row) => {
    return (
      <a href={`${process.env.REACT_APP_BACKEND}/uploads/${row.filename}`} target="blank">
        Lihat File
      </a>
    );
  };

  const statusItemTemplate = (option) => {
    if (option === 'Masuk Ke KA.OPD') {
      return <Badge value={option} style={{ backgroundColor: '#CA82FF' }}></Badge>;
    }
    if (option === 'Di Proses') {
      return <Badge value={option} severity="warning"></Badge>;
    }
    if (option === 'Diposisi') {
      return <Badge value={option} severity="info"></Badge>;
    }
    if (option === 'Selesai Di Proses') {
      return <Badge value={option} severity="danger"></Badge>;
    }
    if (option === 'Disposisi Selesai') {
      return <Badge value={option} severity="success"></Badge>;
    }
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={StatusEksekusi}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Filter Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  const rowExpansionTemplate = (datax) => {
    return (
      <div className="orders-subtable">
        {datax.disposisi_id !== null && (
          <>
            <h5>Timeline Tracking Dokumen {datax.perihal_surat}</h5>
            <DataTable value={datax.detail}>
              <Column field="nama_disposisi" header="Posisi Dokumen"></Column>
              <Column field="jabatan_diposisi" header="Jabatan"></Column>
              <Column field="nama_pendisposisi" header="Disposisi Dari"></Column>
              <Column field="jabatan_disposisi_by" header="Jabatan Pendisposisi"></Column>
              <Column
                field="status"
                header="Status"
                body={(row) => {
                  if (row.status === 0) {
                    return <Badge value={'Belum Di Proses'} severity="danger"></Badge>;
                  }
                  if (row.status === 1) {
                    return <Badge value={'Di Proses'} severity="warning"></Badge>;
                  }
                  if (row.status === 2) {
                    return <Badge value={'Disposisi'} severity="info"></Badge>;
                  }
                  if (row.status === 3) {
                    return <Badge value={'Selesai'} severity="success"></Badge>;
                  }
                }}
              ></Column>
              <Column
                field="disposisi_time"
                header="Tanggal"
                body={(row) => {
                  if (row.jabatan_disposisi_by === 'KA.OPD') {
                    return `${row.disposisi_time.split('T')[0]} : ${row.disposisi_time.split('T')[1].split('.')[0]}`;
                  } else {
                    return `${row.modified_time.split('T')[0]} : ${row.modified_time.split('T')[1].split('.')[0]}`;
                  }
                }}
              ></Column>
              {/* <Column field="nama_eksekutor" header="Eksekutor" sortable></Column> */}
              {/* <Column field="status_jabatan" header="Jabatan" sortable></Column>
          <Column
            body={(option) => {
              if (option.eksekusi === 'Di Proses') {
                return <Badge value={option.eksekusi} severity="warning"></Badge>;
              }
              if (option.eksekusi === 'Menunggu Paraf') {
                return <Badge value={option.eksekusi} severity="info"></Badge>;
              }
              if (option.eksekusi === 'Selesai') {
                return <Badge value={option.eksekusi} severity="success"></Badge>;
              }
            }}
            field="eksekusi"
            header="Status Eksekusi"
          ></Column> */}
            </DataTable>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <DataTable
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id_surat"
          resizableColumns
          header="List Surat Masuk"
          filterDisplay="row"
          filters={filters2}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          value={data}
          footer="Berisikan Status Surat Masuk Beserta Detailnya"
          showGridlines
          responsiveLayout="scroll"
        >
          <Column expander style={{ width: '3em' }} />
          <Column field="jenis_surat" header="Urgensi"></Column>
          <Column filter filterPlaceholder="Search by perihal" field="perihal_surat" header="Perihal"></Column>
          <Column
            sortable
            field="tanggal_terimasurat"
            header="Tanggal Surat Masuk"
            body={(row) => {
              return `${row.tanggal_terimasurat.split('T')[0]}`;
            }}
          ></Column>
          <Column field="filename" body={FilenameTemplate} header="File"></Column>
          <Column
            showFilterMenu={false}
            filter
            body={(option) => {
              if (option.status_dokumen === 'Masuk Ke KA.OPD') {
                return <Badge value={option.status_dokumen} style={{ backgroundColor: '#CA82FF' }}></Badge>;
              }
              if (option.status_dokumen === 'Di Proses') {
                return <Badge value={option.status_dokumen} severity="warning"></Badge>;
              }
              if (option.status_dokumen === 'Diposisi') {
                return <Badge value={option.status_dokumen} severity="info"></Badge>;
              }
              if (option.status_dokumen === 'Selesai Di Proses') {
                return <Badge value={option.status_dokumen} severity="danger"></Badge>;
              }
              if (option.status_dokumen === 'Disposisi Selesai') {
                return <Badge value={option.status_dokumen} severity="success"></Badge>;
              }
              if (option.status_dokumen === 'Disposisi Proses') {
                return <Badge value={option.status_dokumen} severity="danger"></Badge>;
              }
            }}
            filterElement={statusRowFilterTemplate}
            field="status_dokumen"
            header="Status Dokumen"
          ></Column>
          <Column
            header="Actions"
            body={(row) => {
              return (
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={() => {
                      setFilename(row.filename);
                      setRows(row);
                      setOpen(true);
                    }}
                    startIcon={<DetailsOutlined />}
                    variant="contained"
                    color="primary"
                  >
                    Cek
                  </Button>
                </Stack>
              );
            }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
});

export default SuratMasukTable;
