import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface LogoProps extends BoxProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 40, ...props }) => {
  return (
    <Box
      component="img"
      src="/src/assets/logo.svg"
      alt="Algo360"
      sx={{
        width: size,
        height: size,
        ...props.sx
      }}
      {...props}
    />
  );
};

export default Logo;
