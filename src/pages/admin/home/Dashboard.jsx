import React, { useState, useEffect, useContext } from 'react';
import API from '../../../hook/API';
import * as Icons from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Card, Divider, Stack, Typography } from '@mui/material';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);

  const getUsers = () => {
    API.get('/api/users/list')
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  const getStatistik = () => {
    API.get('/api/statistik')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getUsers();
    getStatistik();
  }, []);

  return (
    <Grid container spacing={1}>
      <Divider />
      {data !== null && (
        <Grid item xs={8}>
          <Stack direction="column" spacing={2}>
            <Stack alignContent="center" alignItems="center" direction="row" spacing={1}>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.AccountBoxOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {users.length}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Users
                  </Typography>
                </Stack>
              </Card>

              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.InboxTwoTone color="warning" fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.suratmasuk}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Surat Masuk
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 230 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.OutboxOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.suratkeluar}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Surat Keluar
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.CheckBoxOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.selesai}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Surat Masuk Selesai
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 225 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.SwitchAccountOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.disposisi}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Disposisi
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 225 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.SwitchAccessShortcut fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.disposisi_selesai}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Disposisi Selesai
                  </Typography>
                </Stack>
              </Card>
            </Stack>

            <Stack alignContent="center" alignItems="center" direction="row" spacing={1}>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.AutorenewOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.disposisi_proses}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Disposisi Proses
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.BlindsClosedOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.disposisi_belum_proses}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Disposisi OutStanding
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ p: 2, minWidth: 200 }}>
                <Stack alignContent="center" alignItems="center" direction="column" spacing={1}>
                  <Icons.PendingOutlined fontSize="large" />
                  <Typography variant="overline" component="span">
                    {data.belum_diproses}
                  </Typography>

                  <Typography variant="overline" component="span">
                    Surat Masuk Outstanding
                  </Typography>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};

export default Dashboard;
