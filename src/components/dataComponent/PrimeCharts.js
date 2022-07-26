import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { Grid } from '@mui/material';
import API from '../../hook/API';
import background from '../../assets/image/bg1.png';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const PrimeCharts = React.memo(() => {
  const [data, setData] = useState(null);
  //   const data = [
  //     ['Dokumen', 'Jumlah'],
  //     ['Surat Masuk', 11],
  //     ['Surat Keluar', 2],
  //   ];
  const options = {
    title: 'Interaksi Dokumen',
    is3D: true,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      API.get('/api/statistik')
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => console.log(error));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const datax = [
  //   ['Waktu', 'Surat Masuk', 'Surat Keluar'],
  //   ['Kemarin', data === null ? 0 : data.suratmasuk_kemarin, !data.suratkeluar_kemarin ? 0 : data.suratkeluar_kemarin],
  //   ['Hari Ini', data === null ? 0 : data.suratmasuk_hariini, !data.suratkeluar_hariini ? 0 : data.suratkeluar_hariini],
  // ];

  const optionsx = {
    chart: {
      title: 'Surat',
      subtitle: 'Surat Keluar & Surat Masuk',
    },
  };

  return (
    <Grid
      sx={{
        backgroundImage: `url(${background})`,
      }}
      container
      spacing={1}
    >
      {/* <Grid item xs={12} md={12} lg={12}>
        <Chart chartType="Bar" width="100%" height="400px" data={datax} options={optionsx} />
      </Grid> */}
      <Grid item xs={12} md={8} lg={6}>
        <Chart
          chartType="PieChart"
          data={[
            ['Dokumen', 'Jumlah'],
            ['Surat Masuk', data === null ? 0 : data.suratmasuk],
            ['Surat Keluar', data === null ? 0 : data.suratkeluar],
          ]}
          options={options}
          width={'100%'}
          height={'400px'}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Chart
          chartType="PieChart"
          data={[
            ['Dokumen', 'Jumlah'],
            ['Belum Di Proses', data === null ? 0 : data.belum_diproses],
            ['Proses', data === null ? 0 : data.disposisi_proses],
            ['Selesai', data === null ? 0 : data.selesai],
            ['Disposisi', data === null ? 0 : data.disposisi],
            ['Disposisi Selesai', data === null ? 0 : data.disposisi_selesai],
          ]}
          options={{
            title: 'Surat Masuk',
            is3D: true,
          }}
          width={'100%'}
          height={'400px'}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Chart
          chartType="PieChart"
          data={[
            ['Dokumen', 'Jumlah'],
            ['Belum Di Proses', data === null ? 0 : data.disposisi_belum_proses],
            ['Proses', data === null ? 0 : data.disposisi_proses],
            ['Selesai', data === null ? 0 : data.disposisi_selesai],
          ]}
          options={{
            title: 'Dokumen Disposisi',
            is3D: true,
          }}
          width={'100%'}
          height={'400px'}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Chart
          chartType="PieChart"
          data={[
            ['Dokumen', 'Jumlah'],
            // ['Belum Di Proses', data === null ? 0 : data.disposisi_belum_proses],
            ['Di Kembalikan', data === null ? 0 : data.suratkeluar_dikembalikan],
            ['Di Tandatangani', data === null ? 0 : data.suratkeluar_ttd],
          ]}
          options={{
            title: 'Surat Keluar',
            is3D: true,
          }}
          width={'100%'}
          height={'400px'}
        />
      </Grid>
    </Grid>
  );
});

export default PrimeCharts;
