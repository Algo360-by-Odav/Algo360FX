import { FC, ReactNode } from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardProps as MuiCardProps, useTheme } from '@mui/material';

interface CardProps extends Omit<MuiCardProps, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  noPadding?: boolean;
  children: ReactNode;
}

export const Card: FC<CardProps> = ({
  title,
  subtitle,
  action,
  noPadding,
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        ...sx
      }}
      {...props}
    >
      {(title || subtitle || action) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={action}
          sx={{
            pb: noPadding ? 0 : undefined
          }}
        />
      )}
      <CardContent
        sx={{
          flex: 1,
          p: noPadding ? '0 !important' : undefined,
          '&:last-child': {
            pb: noPadding ? '0 !important' : undefined
          }
        }}
      >
        {children}
      </CardContent>
    </MuiCard>
  );
};
