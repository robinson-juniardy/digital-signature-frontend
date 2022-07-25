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
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import PropTypes from 'prop-types';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import AuthContext from '../../context/auth';

import { Badge } from 'primereact/badge';

import API from '../../hook/API';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';

const ArsipTable = React.memo(() => {
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
    API.get(`/api/suratmasuk/arsip/${currentUser.nip}`)
      .then((response) => {
        setdata(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 5000);

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
        <DataTable value={datax.detail}>
          <Column field="atribut" header="Atribut" sortable></Column>
          <Column field="level_eksekusi" header="Level Eksekutor" sortable></Column>
          <Column field="nama_eksekutor" header="Eksekutor" sortable></Column>
          <Column field="status_jabatan" header="Jabatan" sortable></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div>
      <div className="card">
        <DataTable
          //   expandedRows={expandedRows}
          //   onRowToggle={(e) => setExpandedRows(e.data)}
          //   rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id_surat"
          resizableColumns
          header="List Arsip Anda"
          filterDisplay="row"
          filters={filters2}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          value={data}
          footer="Berisikan Arsip Anda"
          showGridlines
          responsiveLayout="scroll"
        >
          {/* <Column expander style={{ width: '3em' }} /> */}
          <Column filter filterPlaceholder="Search by perihal" field="perihal_surat" header="Perihal"></Column>
          <Column
            field="tanggal_arsip"
            header="Di Arsipkan Pada"
            body={(row) => {
              return `${row.tanggal_arsip.split('T')[0]}`;
            }}
          ></Column>
          <Column field="filename" body={FilenameTemplate} header="File"></Column>
        </DataTable>
      </div>
    </div>
  );
});

export default ArsipTable;
