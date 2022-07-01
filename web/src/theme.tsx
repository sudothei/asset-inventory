import { createTheme } from '@mui/material/styles';

const theme = createTheme({
palette: {
    mode: 'dark',
    primary: {
      main: '#9a9a9a',
    },
    secondary: {
      main: '#f5a000',
    },
    warning: {
      main: '#ff1744',
    },
    error: {
      main: '#ff0000',
    },
  },
});

export default theme
