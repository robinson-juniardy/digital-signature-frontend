/* eslint-disable prefer-template */
import WebViewerContext from '../context/webviewer';
import { useEffect, useRef, useContext } from 'react';
import WebViewer from '@pdftron/webviewer';

export default function WebViewerComponent() {
  const { setInstance } = useContext(WebViewerContext);

  const viewer = useRef(null);
  const formData = new FormData();

  useEffect(() => {
    WebViewer(
      {
        path: '/lib',
        enableFilePicker: true,
        fullAPI: true,

        //   initialDoc: '/files/pdftron_about.pdf',
      },
      viewer.current
    ).then((instance) => {
      setInstance(instance);
      instance.UI.setHeaderItems((header) => {
        header.push({
          type: 'actionButton',
          img: 'icon-save',

          onClick: async () => {
            const doc = instance.Core.documentViewer.getDocument();
            const xfdfString = await instance.Core.annotationManager.exportAnnotations();
            const data = await doc.getFileData({
              // saves the document with annotations in it
              xfdfString,
            });
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: 'application/pdf' });
            formData.append('fileName', blob, doc.getFilename());
            console.log(formData);
            const res = await fetch(process.env.REACT_APP_BACKEND + '/api/suratkeluar', {
              method: 'POST',
              body: formData,
            })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => console.log(error));
          },
        });
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} style={{ height: '100vh' }}></div>
    </div>
  );
}
