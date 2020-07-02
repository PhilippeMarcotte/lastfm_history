import React, { useState, useEffect } from 'react';
import AlbumGrid from "./components/AlbumPage.js";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Box, TextField, Select, InputLabel, MenuItem, FormControl, makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from '@material-ui/core/CssBaseline';
import Refresh from '@material-ui/icons/Refresh';
import Typography from "@material-ui/core/Typography";
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

function App() {
  const [order, setOrder] = React.useState('Date');

  const theme = createMuiTheme({
        palette: {
          type: 'dark',
        },
        overrides: {
          MuiSlider: {
            thumb:{
              color: "cyan"
            },
            track: {
              color: 'cyan'
            },
            rail: {
              color: 'black'
            }
          }
        }
      });
  
  const handleChange = (event) => {
    setOrder(event.target.value);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>      
      <AlbumGrid/>
    </MuiThemeProvider>
  )
}

export default App;
