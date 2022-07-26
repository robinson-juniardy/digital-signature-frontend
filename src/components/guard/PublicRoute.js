/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
import React from 'react';
import AuthContext from '../../context/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = (props) => {
  const { currentUser } = React.useContext(AuthContext);
  console.log(currentUser);
  if (currentUser !== null) {
    const roles = currentUser.role_id;

    if (roles === 5) {
      return <Navigate to="/admin/home" />;
    }
    if (roles === 6) {
      return <Navigate to="/operator/home" />;
    }
    if (roles !== 5 || roles !== 6) {
      return <Navigate to="/main/home" />;
    }
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
