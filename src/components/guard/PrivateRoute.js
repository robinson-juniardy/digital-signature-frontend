import React from 'react';
import AuthContext from '../../context/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = (props) => {
  const { currentUser } = React.useContext(AuthContext);
  return currentUser.id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
