/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState({});
  const navigate = useNavigate();

  useEffect(() => {
    checkCurrentUsers();
  }, []);

  const checkCurrentUsers = () => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    const nama = localStorage.getItem('nama');
    const jabatan = localStorage.getItem('jabatan');
    const nip = localStorage.getItem('nip');
    const disposision_level = localStorage.getItem('disposision_level');
    const atribut = localStorage.getItem('atribut');
    if (id) {
      setCurrentUser({
        role,
        id,
        nama,
        jabatan,
        nip,
        disposision_level,
        atribut,
      });
    } else {
      setCurrentUser(null);
    }
  };

  return <AuthContext.Provider value={{ setCurrentUser, currentUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
