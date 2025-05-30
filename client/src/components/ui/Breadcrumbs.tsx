import { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  const theme = useTheme();

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return isLast ? (
          <Typography
            key={index}
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            component={RouterLink}
            to={item.href || '#'}
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: theme.palette.primary.main
              }
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};
