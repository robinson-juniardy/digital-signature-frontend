import Routes from './routes/Routes';
import { SnackbarProvider } from 'notistack';
import WebViewerContext from './context/webviewer';
import React, { useState } from 'react';
import AuthProvider from './provider/AuthProvider';
import NotificationProvider from './hook/useDocNotification';

function App() {
  const [instance, setInstance] = useState();
  return (
    <WebViewerContext.Provider value={{ instance, setInstance }}>
      <div className="App">
        <SnackbarProvider maxSnack={10}>
          <AuthProvider>
            {/* <NotificationProvider> */}
            <Routes />
            {/* </NotificationProvider> */}
          </AuthProvider>
        </SnackbarProvider>
      </div>
    </WebViewerContext.Provider>
  );
}

export default App;
