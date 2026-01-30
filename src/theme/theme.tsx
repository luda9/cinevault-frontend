import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#E50914',
      light: '#FF4C4C',
      dark: '#B20710',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#B3B3B3',
    },

    background: {
      default: '#0B0B0D',
      paper: '#1C1C1E',
    },

    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      disabled: '#6E6E6E',
    },

    divider: 'rgba(255,255,255,0.08)',
  },

  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,

    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 24,
          paddingRight: 24,
        },
        containedPrimary: {
          backgroundColor: '#E50914',
          '&:hover': {
            backgroundColor: '#B20710',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.05)',
        },
        notchedOutline: {
          borderColor: 'rgba(255,255,255,0.1)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B0D',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
