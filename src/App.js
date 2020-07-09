import React from 'react';
import AlbumPage from "./components/Albums/AlbumPage.js";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  const theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
      });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>      
      <AlbumPage/>
    </MuiThemeProvider>
  )
}

export default App;
