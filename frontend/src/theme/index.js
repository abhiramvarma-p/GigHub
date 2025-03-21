import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D3250',
      light: '#424769',
      dark: '#1B1F3B',
    },
    secondary: {
      main: '#676FA3',
      light: '#7C85B3',
      dark: '#515A94',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3250',
      secondary: '#676FA3',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    h1: {
      fontFamily: "'Clash Display', sans-serif",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "'Clash Display', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Clash Display', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Clash Display', sans-serif",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
    },
    button: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C85B3',
      light: '#9299C4',
      dark: '#676FA3',
    },
    secondary: {
      main: '#424769',
      light: '#515A94',
      dark: '#2D3250',
    },
    background: {
      default: '#13141C',
      paper: '#1B1F3B',
    },
    text: {
      primary: '#F5F5F7',
      secondary: '#9299C4',
    },
  },
  components: {
    ...lightTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
}); 