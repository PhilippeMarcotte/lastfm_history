import React, { useState, useEffect } from 'react';
import AlbumGrid from "./components/AlbumGrid.js";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Box, TextField, Select, InputLabel, MenuItem, FormControl, makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CssBaseline from '@material-ui/core/CssBaseline';
import Refresh from '@material-ui/icons/Refresh';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('');

  const [latestUpdate, setLatestUpdate] = useState(Date.now());
  function updateDB()
  {
    fetch("/api/update")
    setLatestUpdate(Date.now())
  }

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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Albums
          </Typography>
          <IconButton onClick={updateDB}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex" justifyContent="center" marginTop="0.5vh" marginBottom="0.5vh">
        <FormControl>
            <TextField label="Search"></TextField>
        </FormControl>
        <FormControl style={{"minWidth": "120px", marginLeft: "1vw"}}>
          <InputLabel id="demo-simple-select-label">Order</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={order}
            onChange={handleChange}
          >
            <MenuItem value={"Date"} selected={true}>Date</MenuItem>
            <MenuItem value={"Album"}>Album</MenuItem>
            <MenuItem value={"Artist"}>Artist</MenuItem>
            <MenuItem value={"Song"}>Song</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <AlbumGrid latestUpdate={latestUpdate}/>
    </MuiThemeProvider>
  )
}

export default App;
