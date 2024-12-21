import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';
import { textGradients } from '../../theme/utils';

interface GradientTextProps extends TypographyProps {
  variant?: TypographyProps['variant'];
  gradient?: keyof typeof textGradients;
}

const GradientText: React.FC<GradientTextProps> = ({
  variant = 'h3',
  gradient = 'primary',
  component = 'div',
  children,
  ...other
}) => {
  return (
    <Typography
      variant={variant}
      component={component}
      sx={{
        ...textGradients[gradient],
        display: 'inline-block',
      }}
      {...other}
    >
      {children}
    </Typography>
  );
};

export default GradientText;
