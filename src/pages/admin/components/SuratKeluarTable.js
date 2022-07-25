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
import API from '../../../hook/API';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const SuratKeluarTable = React.memo(() => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
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

  const header = (
    <div className="table-header-container">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2" />
      <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
    </div>
  );

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
    return <span className={`customer-badge status-${option}`}>{option}</span>;
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
          <Column field="eksekusi" header="Status Eksekusi" sortable></Column>
        </DataTable>
      </div>
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Data Surat Keluar" {...a11yProps(0)} />
          <Tab label="Data Surat Masuk" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
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
                  filterElement={statusRowFilterTemplate}
                  field="status_eksekusi"
                  header="Status"
                ></Column>
              </DataTable>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
});

export default SuratKeluarTable;
