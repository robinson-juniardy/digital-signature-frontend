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
    const role_id = localStorage.getItem('role_id');
    const id = localStorage.getItem('id');
    const nama = localStorage.getItem('nama');
    const jabatan = localStorage.getItem('jabatan');
    const nip = localStorage.getItem('nip');
    const disposision_level = localStorage.getItem('disposision_level');
    const atribut = localStorage.getItem('atribut');
    const paraf = localStorage.getItem('paraf');
    const ttd = localStorage.getItem('ttd');
    if (id) {
      setCurrentUser({
        role_id,
        role,
        id,
        nama,
        jabatan,
        nip,
        disposision_level,
        atribut,
        paraf,
        ttd,
      });
    } else {
      setCurrentUser(null);
    }
  };

  return <AuthContext.Provider value={{ setCurrentUser, currentUser }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
