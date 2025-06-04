import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DeviceData from './components/DeviceData';
import Charts from './components/Charts';
import { Box, Grid, Typography, Button, Divider } from '@mui/material';

const DEVICE_TILE_LIMIT = 5;

type DeviceDataType = {
  temperature: number;
  pressure: number;
  humidity: number;
};

type Device = {
  id: number;
  data: DeviceDataType | null;
};

const devices: Device[] = [
  { id: 0, data: null },
  { id: 1, data: null },
  { id: 2, data: null },
  { id: 3, data: { temperature: 23.5, pressure: 1013.25, humidity: 45 } },
  { id: 4, data: { temperature: 24.5, pressure: 990.4, humidity: 40.3 } },
];



const App = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  return (
    <>
      <Navbar />
      {/* Блок з даними і графіком */}
      <Box sx={{ display: 'flex', p: 2 }}>
        {/* Лівий блок - копія вибраного кафелька (без кнопки DETAILS) */}
        {selectedDevice && (
          <Box sx={{ mr: 4 }}>
            <Box
              sx={{
                width: 200,
                height: 150,
                bgcolor: '#424242',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1,
                textAlign: 'left',
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Device No. {selectedDevice.id}</Typography>
                <Box sx={{ borderBottom: '1px solid #fff', mb: 1 }} />
                {selectedDevice.data ? (
                  <DeviceData data={selectedDevice.data} hasData />
                ) : (
                  <Typography variant="body1">No data</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
        {/* Правий блок з графіком */}
        <Box sx={{ display: 'flex', flex: 1, color: 'white'}}>
          <Box sx={{ width: '100%' }}>
            <Charts
              selectedDevice={
                selectedDevice && selectedDevice.data
                  ? { id: selectedDevice.id, data: selectedDevice.data }
                  : undefined
              }
            />
          </Box>
        </Box>
      </Box>
      
      {/* Горизонтальний розділювач */}
      <Divider sx={{ bgcolor: 'white', height: '2px', my: 2 }} />

      {/* Кафельки для кожного пристрою */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        {devices.slice(0, DEVICE_TILE_LIMIT).map((device) => (

          <Grid item key={device.id}>
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: '#424242',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1,
                textAlign: 'left',
                borderRadius: 2,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedDeviceId(device.id)}
            >
              <Box>
                <Typography variant="h6">Device No. {device.id}</Typography>
                <Box sx={{ borderBottom: '1px solid #fff', mb: 1 }} />
                {device.data ? (
                  <DeviceData data={device.data} hasData />
                ) : (
                  <Typography variant="body1">No data</Typography>
                )}
              </Box>
              <Box>
                <Button variant="text" sx={{ color: '#1976d2', alignSelf: 'flex-end' }}>
                  DETAILS
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default App;