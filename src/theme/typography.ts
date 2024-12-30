import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: '2.5rem',
  },
  h2: {
    fontWeight: 700,
    lineHeight: 1.3,
    fontSize: '2rem',
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.375,
    fontSize: '1.75rem',
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.375,
    fontSize: '1.5rem',
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.375,
    fontSize: '1.25rem',
  },
  h6: {
    fontWeight: 600,
    lineHeight: 1.375,
    fontSize: '1.125rem',
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: '1rem',
  },
  subtitle2: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: '0.875rem',
  },
  body1: {
    lineHeight: 1.5,
    fontSize: '1rem',
  },
  body2: {
    lineHeight: 1.5,
    fontSize: '0.875rem',
  },
  button: {
    fontWeight: 600,
    lineHeight: 1.71429,
    fontSize: '0.875rem',
    textTransform: 'capitalize',
  },
  caption: {
    lineHeight: 1.5,
    fontSize: '0.75rem',
  },
  overline: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
} as const;

export default typography;
