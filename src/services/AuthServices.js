/* eslint-disable prefer-promise-reject-errors */
import { useContext } from 'react';
import API from '../hook/API';
import AuthContext from '../context/auth';

export const LoginService = (nip, password) => {
  const { setCurrentUser, currentUser } = useContext(AuthContext);
  return new Promise((resolve, reject) => {});
};
