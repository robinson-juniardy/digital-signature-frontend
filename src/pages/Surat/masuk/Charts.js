import { Stack } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const Charts = () => {
  const state = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };

  return (
    <div className="row">
      <div className="mixed-chart">
        <Stack direction="row" padding={2} spacing={1}>
          <Chart options={state.options} series={state.series} type="bar" width="500" />
          <Chart options={{}} series={[44, 55, 41, 17, 15]} type="donut" width="433" />
        </Stack>
      </div>
    </div>
  );
};

export default Charts;
