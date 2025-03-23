import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A35C7A',
      light: '#C890A7',
      dark: '#8B4E68',
      contrastText: '#FEF6EB',
    },
    secondary: {
      main: '#C890A7',
      light: '#D4A7BB',
      dark: '#A35C7A',
      contrastText: '#212121',
    },
    background: {
      default: '#FEF6EB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#A35C7A',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontFamily: 'Futura',
        },
        contained: {
          backgroundColor: '#A35C7A',
          color: '#FEF6EB',
          '&:hover': {
            backgroundColor: '#C890A7',
          },
        },
        outlined: {
          borderColor: '#A35C7A',
          color: '#A35C7A',
          '&:hover': {
            borderColor: '#C890A7',
            backgroundColor: 'rgba(163, 92, 122, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121',
          color: '#FEF6EB',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(163, 92, 122, 0.1)',
          '&:hover': {
            borderColor: '#A35C7A',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(163, 92, 122, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#A35C7A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A35C7A',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(163, 92, 122, 0.1)',
          color: '#A35C7A',
          '&:hover': {
            backgroundColor: 'rgba(163, 92, 122, 0.2)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Futura';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
        }
        @font-face {
          font-family: 'Futura';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
        }
      `,
    },
  },
  typography: {
    fontFamily: [
      'Futura',
      'Futura-Medium',
      'Futura PT',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    h2: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    h3: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    h4: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    h5: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    h6: {
      fontFamily: 'Futura',
      color: '#212121',
    },
    subtitle1: {
      fontFamily: 'Futura',
    },
    subtitle2: {
      fontFamily: 'Futura',
    },
    body1: {
      fontFamily: 'Futura',
    },
    body2: {
      fontFamily: 'Futura',
    },
    button: {
      fontFamily: 'Futura',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme; 