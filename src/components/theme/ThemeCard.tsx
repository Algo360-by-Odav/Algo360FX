import React from 'react';
import {
  Box,
  Card,
  CardProps,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { cssStyles } from '../../theme/utils';

interface ThemeCardProps extends CardProps {
  title?: string;
  bgImage?: string;
  bgColor?: string;
  blur?: number;
  opacity?: number;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  title,
  bgImage,
  bgColor,
  blur = 6,
  opacity = 0.8,
  children,
  ...other
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...other.sx,
      }}
      {...other}
    >
      {bgImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...cssStyles.bgImage({
              url: bgImage,
              color: bgColor || alpha(theme.palette.grey[900], 0.8),
            }),
          }}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          p: 3,
          ...(bgImage && {
            ...cssStyles.bgBlur({
              blur,
              opacity,
              color: theme.palette.background.paper,
            }),
          }),
        }}
      >
        {title && (
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: bgImage ? theme.palette.common.white : 'text.primary',
            }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Card>
  );
};

export default ThemeCard;
