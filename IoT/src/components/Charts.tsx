//import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';


interface DeviceData {
  temperature: number;
  pressure: number;
  humidity: number;
  
}

interface ChartsProps {
  selectedDevice: { id: number; data: DeviceData } | undefined | null;
}

const Charts = ({ selectedDevice }: ChartsProps) => {
  if (!selectedDevice || !selectedDevice.data) {
    return (
      <Box sx={{ minWidth: 700, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#222', borderRadius: 2 }}>
        <Typography color="white">No data to display</Typography>
      </Box>
    );
  }
  

  // Przykładowe dane historyczne (możesz podmienić na dane z backendu)
    const baseData = selectedDevice.data;
  const chartData = [
    { temperature: baseData.temperature, pressure: baseData.pressure/10, humidity: baseData.humidity },
    { temperature: baseData.temperature, pressure: baseData.pressure/10, humidity: baseData.humidity },
  ];
  const xLabels = ['8.05.2024, 21:37:40', '8.05.2024, 21:41:02'];

  return (
      <LineChart
      xAxis={[
          {
            scaleType: 'point',
            data: xLabels,
            
            label: 'Time',
            //tickMinStep: 1,
            tickLabelStyle: { fill: 'white', fontSize: 14 },
            labelStyle: { fill: 'white', fontWeight: 'bold' },
          },
        ]}
        yAxis={[
          {
            min: 20,
            max: 120,
            tickMinStep: 20,
            tickLabelStyle: { fill: 'white' },
            labelStyle: { fill: 'white' },
          },
        ]}
          sx={{
                
                ".MuiChartsLegend-root": { color: "white" },
                ".MuiChartsLegend-label": { color: "white !important" },
                ".MuiChartsAxis-root line": { stroke: "white" },
                ".MuiChartsAxis-tickLabel": { fill: "white" },
                ".MuiChartsAxis-label": { fill: "white" },
                ".MuiChartsGrid-line": { stroke: "white" },
                backgroundColor: '#222'
            }}
        series={[
          { data: chartData.map((d) => d.pressure), label: 'Pressure x10 [hPa]', color: '#00e5ff' },
          { data: chartData.map((d) => d.humidity), label: 'Humidity [%]', color: '#00ff90' },
          { data: chartData.map((d) => d.temperature), label: 'Temperature [°C]', color: '#d500f9' },
        ]}
        width={900}
        height={300}
        
    slotProps={{
            legend: {
                labelStyle: { color: "white", fill: "white" },
            },
        }}
       
        
      />
    
  );
};

export default Charts;