import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/auth';
import API from './API';

export const NotificationContext = React.createContext({});

const NotificationProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [notification, setNotification] = useState({});

  const getDokumenTemporary = () => {
    API.get(`/api/suratkeluar/sign-list/${currentUser.id}`).then((response) => {
      const docParaf = response.data.data.filter((item) => item.sign_type === 'prf' && item.status < 1);
      const docTtd = response.data.data.filter((item) => item.sign_type === 'ttd' && item.status === 1);
      setNotification({
        paraf: docParaf.length,
        ttd: docTtd.length,
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser.id) {
        getDokumenTemporary();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <NotificationContext.Provider value={notification}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
