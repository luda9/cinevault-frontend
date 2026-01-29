import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { WatchlistProvider } from './context/WatchlistContext'

import App from './App';
import theme from './theme/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
