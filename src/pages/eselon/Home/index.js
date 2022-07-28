/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-arrow-callback */
import {
  AppBar,
  Autocomplete,
  Badge,
  Button,
  Card,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Tab,
  Tabs,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { FormikProvider, useFormik } from 'formik';
import React, { forwardRef, useState, useEffect, useLayoutEffect, useContext } from 'react';
import API from '../../../hook/API';
import Iconify from '../../../components/Iconify';
import { useSnackbar } from 'notistack';
import DataTable from 'react-data-table-component';
import Sign from '../dokumen/Sign';
import WebViewerComponent from '../../../components/WebViewer';
import DisposisiComponent from '../../Disposisi/Disposisi';
import {
  AssignmentLate,
  AssignmentLateOutlined,
  AssignmentReturn,
  AssignmentReturnOutlined,
  CompareArrowsOutlined,
  EmailOutlined,
  FileCopy,
  FilePresent,
  ForwardToInboxOutlined,
  MailLock,
  SpaceBar,
  Task,
} from '@mui/icons-material';
// import { NotificationContext } from '../../../hook/useDocNotification';
import AuthContext from '../../../context/auth';
import { Link } from 'react-router-dom';
import ClockWidget from '../../../components/widgets/Clock';
import CalendarWidget from '../../../components/widgets/Calendar';
// import Charts from './Charts';
import PrimeCharts from '../../../components/dataComponent/PrimeCharts';
import SuratMasukTable from '../../Table/SuratMasukTable';
import SuratKeluarTable from '../../Table/SuratKeluarTable';
import ArsipTable from '../../Table/ArsipTable';
import Signatures from '../../Signatures/Signatures';
import Dashboard from './Dashboard';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function OpdHome() {
  const [open, setOpen] = useState(false);
  const [disposisiOpen, setDisposisiOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [notification, setNotification] = useState({});
  const [document, setDocument] = useState([]);
  const [filename, setfilename] = useState(null);
  const [rows, setRows] = useState(null);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <DisposisiComponent rows={rows} filename={filename} open={disposisiOpen} setOpen={setDisposisiOpen} />
      <Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(false)}>
              <Iconify icon="eva:close-square-outline" width={24} height={24} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Document Sign
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Card sx={{ p: 3, mt: 10 }}>
            <Grid container spacing={2}>
              <Grid marginTop={7} item xs={12} md={8} lg={8}>
                <Signatures filename={filename} rowdata={rows} />
              </Grid>
              {/* <Grid marginTop={7} item xs={12} md={8} lg={4}>
                <Sign />
              </Grid> */}
            </Grid>
          </Card>
        </Container>
      </Dialog>

      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          <Dashboard />
          <br />
          <PrimeCharts />
        </Grid>
      </Grid>
    </>
  );
}
