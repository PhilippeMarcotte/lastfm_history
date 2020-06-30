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
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginRight: theme.spacing(50)
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function App() {
  const classes = useStyles();

  const [order, setOrder] = React.useState('Date');

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
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Material-UI
          </Typography>
          <div className={classes.search} style={{marginLeft: "16"}}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <IconButton onClick={updateDB}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
        
      <AlbumGrid latestUpdate={latestUpdate}/>
    </MuiThemeProvider>
  )
}

export default App;
