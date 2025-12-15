import * as React from 'react';
import Switch, { switchClasses } from '@mui/joy/Switch';
import { Typography } from '@mui/joy';

const MySwitch = ({ checked, onChange }) => {
  return (
    <Switch checked = {checked} onChange={onChange} 
      slotProps={{
        track: {
          children: (
            <React.Fragment>
              <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                On
              </Typography>
              <Typography component="span" level="inherit" sx={{ mr: '8px' }}>
                Off
              </Typography>
            </React.Fragment>
          ),
        },
      }}
      sx={{
        '--Switch-thumbSize': '27px',
        '--Switch-trackWidth': '64px',
        '--Switch-trackHeight': '31px',
      }}
    />
  );
}
export default MySwitch;