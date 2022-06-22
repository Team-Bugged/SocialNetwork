import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    background: {
      default: "#f3f2ef",
    },
    primary: {
      main: '#0a66c2',
    },
    secondary:{
      main:'#f3f2ef'
    }
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
  <ThemeProvider theme={theme}  >
    <CssBaseline/>
    <App />
  </ThemeProvider>
  </BrowserRouter>
);
