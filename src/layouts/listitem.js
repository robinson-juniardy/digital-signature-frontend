/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { createStyles, makeStyles, Tooltip } from '@mui/material';
import AuthContext from '../context/auth';

// const navigate = useNavigate();

const roleMenu = [
  {
    role: 'eselon_3',
    children: [
      {
        title: 'Home',
        path: '/es/home',
        icon: <Icons.HomeOutlined />,
      },
      // {
      //   title: 'Disposisi Selesai',
      //   path: '/es/arsip/disposisi/selesai',
      //   icon: <AssignmentIcon />,
      // },
    ],
  },
  {
    role: 'staff',
    children: [
      {
        title: 'Home',
        path: '/staff/home',
        icon: <Icons.HomeOutlined />,
      },
      {
        title: 'Surat',
        path: '/staff/surat',
        icon: <Icons.InboxOutlined />,
      },
      // {
      //   title: 'Disposisi Selesai',
      //   path: '/es/arsip/disposisi/selesai',
      //   icon: <AssignmentIcon />,
      // },
    ],
  },
  {
    role: 'admin',
    children: [
      {
        title: 'Home',
        path: '/admin/home',
        icon: <Icons.HomeOutlined />,
      },
      {
        title: 'Surat Masuk',
        path: '/admin/suratmasuk',
        icon: <Icons.InboxOutlined />,
      },
      {
        title: 'Surat Keluar',
        path: '/admin/suratkeluar',
        icon: <Icons.OutboxOutlined />,
      },
      {
        title: 'Users Management',
        path: '/admin/data-management',
        icon: <Icons.AccountBoxOutlined />,
      },
    ],
  },
  {
    role: 'operator',
    children: [
      {
        title: 'Home',
        path: '/operator/home',
        icon: <Icons.HomeOutlined />,
      },
      {
        title: 'Surat Masuk',
        path: '/operator/suratmasuk',
        icon: <Icons.InboxOutlined />,
      },
      {
        title: 'Surat Keluar',
        path: '/operator/suratkeluar',
        icon: <Icons.OutboxOutlined />,
      },
    ],
  },
  {
    role: 'eselon_4',
    children: [
      {
        title: 'Home',
        path: '/es/home',
        icon: <Icons.HomeOutlined />,
      },
      {
        title: 'Surat',
        path: '/es/surat',
        icon: <Icons.InboxOutlined />,
      },
    ],
  },
  {
    role: 'ka_opd',
    children: [
      {
        title: 'Home',
        path: '/opd/home',
        icon: <Icons.HomeOutlined />,
      },
      {
        title: 'Surat',
        path: '/opd/surat',
        icon: <Icons.InboxOutlined />,
      },
    ],
  },
];

const ListItemsRole = () => {
  const { currentUser } = React.useContext(AuthContext);
  const roleItem = roleMenu.filter((menu) => menu.role === currentUser.role);
  return (
    <>
      {roleItem[0].children.map((item, index) => (
        <Tooltip placement="right-start" key={index} title={item.title}>
          <NavLink
            to={item.path}
            style={{
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </NavLink>
        </Tooltip>
      ))}

      <Tooltip placement="right-start" title="Logout">
        <ListItemButton
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          <ListItemIcon>
            <Icons.Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Tooltip>
    </>
  );
};

export const mainListItems = (
  <ListItemsRole />
  // <React.Fragment>
  //   <NavLink
  //     to="/operator/home"
  //     style={{
  //       textDecoration: 'none',
  //       color: 'black',
  //     }}
  //   >
  //     <ListItemButton>
  //       <ListItemIcon>
  //         <DashboardIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Dashboard" />
  //     </ListItemButton>
  //   </NavLink>

  //   <NavLink
  //     to="/operator/suratmasuk"
  //     style={{
  //       color: 'black',
  //       textDecoration: 'none',
  //     }}
  //     //   style={({ isActive }) => {
  //     //     isActive ? {  } : undefined;
  //     //   }}
  //   >
  //     <ListItemButton>
  //       <ListItemIcon>
  //         <Icons.Mail />
  //       </ListItemIcon>
  //       <ListItemText primary="Surat Masuk" />
  //     </ListItemButton>
  //   </NavLink>

  //   <NavLink
  //     to={'/operator/suratkeluar'}
  //     style={{
  //       color: 'black',
  //       textDecoration: 'none',
  //     }}
  //   >
  //     <ListItemButton>
  //       <ListItemIcon>
  //         <Icons.SendAndArchive />
  //       </ListItemIcon>
  //       <ListItemText primary="Surat Keluar" />
  //     </ListItemButton>
  //   </NavLink>

  //   {/* <ListItemButton>
  //     <ListItemIcon>
  //       <BarChartIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Reports" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <LayersIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Integrations" />
  //   </ListItemButton> */}
  // </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment></React.Fragment>
  // <React.Fragment>
  //   <ListSubheader component="div" inset>
  //     Arsip
  //   </ListSubheader>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Surat" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Disposisi Selesai" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Disposisi Proses" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Disposisi > 7 Hari" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Disposisi > 7 Hari" />
  //   </ListItemButton>
  // </React.Fragment>
);
