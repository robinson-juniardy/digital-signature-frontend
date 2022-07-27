import { Grid } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import DisposisiComponent from '../Disposisi/Disposisi';
import SuratMasukTable from '../Table/SuratMasukTable';

const SuratMasukComponent = () => {
  const [disposisiOpen, setDisposisiOpen] = useState(false);
  const [filename, setfilename] = useState(null);
  const [rows, setRows] = useState(null);

  return (
    <>
      <DisposisiComponent rows={rows} filename={filename} open={disposisiOpen} setOpen={setDisposisiOpen} />
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={12}>
          <h1>Surat Masuk</h1>
          <SuratMasukTable
            open={disposisiOpen}
            setOpen={setDisposisiOpen}
            setFilename={setfilename}
            setRows={setRows}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SuratMasukComponent;
