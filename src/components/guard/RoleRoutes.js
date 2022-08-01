/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
import React from 'react';
import AuthContext from '../../context/auth';
import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = (props) => {
  const { currentUser } = React.useContext(AuthContext);
  if (currentUser !== null) {
    const roles = currentUser.role_id;

    if (roles === 5) {
      return <Navigate to="/admin/home" />;
    } else if (roles === 6) {
      return <Navigate to="/operator/home" />;
    } else {
      return <Navigate to="/main/home" />;
    }
  } else {
    return <Outlet />;
  }
};

export default RoleRoute;
