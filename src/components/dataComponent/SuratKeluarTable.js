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
import Button from '@mui/material/Button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import PropTypes from 'prop-types';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

import { Badge } from 'primereact/badge';

import API from '../../hook/API';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { DeleteOutline } from '@mui/icons-material';

const SuratKeluarTable = React.memo(() => {
  const [data, setdata] = React.useState([]);
  const [expandedRows, setExpandedRows] = React.useState(null);
  const [filters2, setFilters2] = React.useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    judul: { value: null, matchMode: FilterMatchMode.CONTAINS },
    perihal: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status_eksekusi: { value: null, matchMode: FilterMatchMode.EQUALS },
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

  const StatusEksekusi = ['Di Paraf', 'Di Tandatangani', 'Dikembalikan', 'Di Proses'];

  const getData = () => {
    API.get('/api/suratkeluar/temp')
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleHapus = (row) => {
    API.post('/api/suratkeluar/hapus-suratkeluar', {
      filename: row.filename,
    })
      .then((response) => {
        if (response.data.status === 1) {
          console.log('data di hapus');
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 1500);

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
    if (option === 'Di Paraf') {
      return <Badge value={option} severity="info"></Badge>;
    } else if (option === 'Di Tandatangani') {
      return <Badge value={option} severity="success"></Badge>;
    } else if (option === 'Di Proses') {
      return <Badge value={option} severity="warning"></Badge>;
    } else if (option === 'Di Kembalikan') {
      return <Badge value={option} severity="danger"></Badge>;
    } else {
      return <Badge value={option} severity="danger"></Badge>;
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
        <h5>Detail Dokumen {datax.judul}</h5>
        {datax.alasan_revisi !== null && (
          <Typography variant="overline" component="span">
            Catatan : {datax?.alasan_revisi}
          </Typography>
        )}
        <DataTable value={datax.detail}>
          <Column field="atribut" header="Atribut" sortable></Column>
          <Column field="level_eksekusi" header="Level Eksekutor" sortable></Column>
          <Column field="nama_eksekutor" header="Eksekutor" sortable></Column>
          <Column field="status_jabatan" header="Jabatan" sortable></Column>
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
          ></Column>
        </DataTable>
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
          header="List Surat Keluar"
          filterDisplay="row"
          filters={filters2}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          value={data}
          footer="Berisikan Status Surat Keluar Beserta Detailnya"
          showGridlines
          responsiveLayout="scroll"
        >
          <Column expander style={{ width: '3em' }} />
          <Column filter filterPlaceholder="Search by judul" field="judul" header="Judul"></Column>
          <Column filter filterPlaceholder="Search by perihal" field="perihal" header="Perihal"></Column>
          <Column field="filename" body={FilenameTemplate} header="File"></Column>
          <Column
            showFilterMenu={false}
            filter
            body={(option) => {
              if (option.status_eksekusi === 'Di Paraf') {
                return <Badge value={option.status_eksekusi} severity="info"></Badge>;
              }
              if (option.status_eksekusi === 'Di Tandatangani') {
                return <Badge value={option.status_eksekusi} severity="success"></Badge>;
              }
              if (option.status_eksekusi === 'Di Proses') {
                return <Badge value={option.status_eksekusi} severity="warning"></Badge>;
              }
              if (option.status_eksekusi === 'Di Kembalikan') {
                return <Badge value={option.status_eksekusi} severity="danger"></Badge>;
              }
            }}
            filterElement={statusRowFilterTemplate}
            field="status_eksekusi"
            header="Status"
          ></Column>
          <Column
            header="Actions"
            body={(row) => {
              return (
                <Button onClick={() => handleHapus(row)} variant="outlined" color="error" startIcon={<DeleteOutline />}>
                  Hapus
                </Button>
              );
            }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
});

export default SuratKeluarTable;
