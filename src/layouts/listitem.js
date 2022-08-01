/* eslint-disable no-else-return */
/* eslint-disable no-empty */
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

const MainMenu = [
  {
    title: 'Home',
    path: '/main/home',
    icon: <Icons.HomeOutlined />,
  },
  {
    title: 'Arsip',
    path: '/main/arsip',
    icon: <Icons.ArchiveOutlined />,
  },
  {
    title: 'Surat Masuk',
    path: '/main/suratmasuk',
    icon: <Icons.InboxOutlined />,
  },
  {
    title: 'Surat Keluar',
    path: '/main/suratkeluar',
    icon: <Icons.OutboxOutlined />,
  },
];

const OperatorMenu = [
  {
    title: 'Home',
    path: '/operator/home',
    icon: <Icons.HomeOutlined />,
  },
  {
    title: 'Arsip',
    path: '/operator/arsip',
    icon: <Icons.ArchiveOutlined />,
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
];

const AdminMenu = [
  {
    title: 'Home',
    path: '/admin/home',
    icon: <Icons.HomeOutlined />,
  },

  {
    title: 'Arsip',
    path: '/admin/arsip',
    icon: <Icons.ArchiveOutlined />,
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
];

// const roleMenu = [
//   {
//     role: 'main',
//     children: [

//       // {
//       //   title: 'Disposisi Selesai',
//       //   path: '/es/arsip/disposisi/selesai',
//       //   icon: <AssignmentIcon />,
//       // },
//     ],
//   },
//   {
//     role: 5,
//     children: [

//     ],
//   },
//   {
//     role: 6,
//     children: [

//     ],
//   },
// ];

const ListItemsRole = () => {
  const { currentUser, setCurrentUser } = React.useContext(AuthContext);
  console.log(currentUser);
  if (currentUser.role_id === 5) {
    return (
      <>
        {AdminMenu.map((item, index) => (
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
              setCurrentUser(null);
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
  } else if (currentUser.role_id === 6) {
    return (
      <>
        {OperatorMenu.map((item, index) => (
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
              setCurrentUser(null);
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
  } else {
    return (
      <>
        {MainMenu.map((item, index) => (
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
              setCurrentUser(null);
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
  }
};

export const mainListItems = <ListItemsRole />;

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
