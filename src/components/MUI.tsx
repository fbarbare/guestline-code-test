import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import createTheme from '@material-ui/core/styles/createTheme';

const MUI: React.FC = ({ children }) => {
  const htmlFontSize = window.getComputedStyle(window.document.body.parentElement!).fontSize;

  const theme = createTheme({
    palette: {
      primary: {
        main: '#31249f'
      },
      secondary: {
        main: '#E22566'
      },
      error: {
        main: '#ca1b57'
      },
      background: {
        default: '#F9F9FD'
      }
    },

    typography: {
      htmlFontSize: parseFloat(htmlFontSize),
      fontFamily: 'DM Sans, sans-serif'
    },

    shape: {
      borderRadius: 8
    },

    overrides: {
      MuiButton: {
        label: {
          textTransform: 'initial',
          fontSize: '1rem',
          lineHeight: '20px'
        },
        sizeLarge: {
          padding: '16px'
        }
      },

      MuiCard: {
        root: {
          borderRadius: '20px'
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MUI;
