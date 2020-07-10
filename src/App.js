import React from 'react';
import AlbumPage from "./components/Albums/AlbumPage.js";
import Routes from "./components/Routes";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from "react-router-dom";

function App() {
  const theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
      });

  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>      
        <AlbumPage/>
        <Routes/>
      </MuiThemeProvider>
    </BrowserRouter>
  )
}

export default App;
