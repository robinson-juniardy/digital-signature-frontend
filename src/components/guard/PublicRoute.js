/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
import React from 'react';
import AuthContext from '../../context/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = (props) => {
  const { currentUser } = React.useContext(AuthContext);
  console.log(currentUser);
  if (currentUser !== null) {
    const roles = currentUser.role;
    if (roles === 'admin') {
      return <Navigate to="/admin/home" />;
    }
    if (roles === 'operator') {
      return <Navigate to="/operator/home" />;
      //   navigate('/operator/home', { replace: true });
    }
    if (roles === 'ka_opd') {
      return <Navigate to="/opd/home" />;
      //   navigate('/opd/home', { replace: true });
    }
    if (roles === 'eselon_3') {
      return <Navigate to="/es/home" />;
      //   navigate('/es/home', { replace: true });
    }
    if (roles === 'eselon_4') {
      return <Navigate to="/es/home" />;
      //   navigate('/es/home', { replace: true });
    }
    if (roles === 'staff') {
      return <Navigate to="/staff/home" />;
      //   navigate('/es/home', { replace: true });
    }
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
