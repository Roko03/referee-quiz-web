'use client';

import { createTheme } from '@mui/material/styles';

// Define the theme with custom colors matching the Lovable project
const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: 'hsl(220, 26%, 6%)', // --background
          paper: 'hsl(220, 24%, 9%)', // --card
        },
        primary: {
          main: 'hsl(142, 76%, 45%)', // --primary (green)
          light: 'hsl(142, 76%, 56%)',
          dark: 'hsl(142, 76%, 36%)',
          contrastText: 'hsl(220, 26%, 6%)', // --primary-foreground
        },
        secondary: {
          main: 'hsl(220, 20%, 14%)', // --secondary
          contrastText: 'hsl(0, 0%, 98%)', // --secondary-foreground
        },
        error: {
          main: 'hsl(0, 72%, 51%)', // --destructive
          contrastText: 'hsl(0, 0%, 98%)',
        },
        warning: {
          main: 'hsl(38, 92%, 50%)', // --warning
          contrastText: 'hsl(220, 26%, 6%)',
        },
        success: {
          main: 'hsl(142, 76%, 45%)', // --success
          contrastText: 'hsl(220, 26%, 6%)',
        },
        text: {
          primary: 'hsl(0, 0%, 98%)', // --foreground
          secondary: 'hsl(220, 10%, 60%)', // --muted-foreground
        },
        divider: 'hsl(220, 20%, 18%)', // --border
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  typography: {
    fontFamily: 'inter, system-ui, avenir, helvetica, arial, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12, // --radius: 0.75rem
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.75rem',
          fontWeight: 600,
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          backgroundImage: 'none',
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
