import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpacityIcon from '@mui/icons-material/Opacity';

interface DeviceDataProps {
  data?: {
    temperature?: number;
    pressure?: number;
    humidity?: number;
  };
  hasData: boolean;
}

const DeviceData = ({ data, hasData }: DeviceDataProps) => (
  <>
    {hasData && (
      <Typography style={{ paddingTop: '10px' }} component="div">
        <Typography variant="h6" component="div">
          <DeviceThermostatIcon />
          <span className="value">{data?.temperature}</span> <span>&deg;C</span>
        </Typography>
        <Typography variant="h6" component="div">
          <CloudUploadIcon />
          <span className="value">{data?.pressure}</span> hPa
        </Typography>
        <Typography variant="h6" component="div">
          <OpacityIcon />
          <span className="value">{data?.humidity}</span>%
        </Typography>
      </Typography>
    )}
  </>
);

export default DeviceData;