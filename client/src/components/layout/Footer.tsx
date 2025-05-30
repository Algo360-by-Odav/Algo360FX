import { FC } from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

export const Footer: FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Algo360FX. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/terms" color="inherit" underline="hover">
              Terms
            </Link>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
