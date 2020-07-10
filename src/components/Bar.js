import 'date-fns';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Refresh from '@material-ui/icons/Refresh';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { InputBase, MenuItem, Select, Grid, Popover } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  popover:{
    width: 400
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'block',
  },
  search: {
    position: "relative",
    [theme.breakpoints.up('md')]: {
      position: "absolute",
      left: "45%",
    },
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "auto",
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
    width: '12ch',
    '&:focus': {
      width: '24ch',
    },
    [theme.breakpoints.down('sm')]: {
      width: '8ch',
      '&:focus': {
        width: '20ch'
      },
    },
  },
  select: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  sortIcon: {
    height: 1,
    width: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  selectInput: {
    minWidth: '8ch'
  },
  dateGrid: {
    margin: theme.spacing(2),
  },
  popoverTitle: {
    margin: theme.spacing(2)
  }
}));

function HideOnScroll(props) {
  const { children, target } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({target: target});

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Bar(props)
{
  const sm = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [ascIcon, setAscIcon] = useState(<ArrowUpward/>);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const orderSelect = (
    <div>
      <Select
      value={props.orderValue}
      onChange={props.onOrderChange}
      className={classes.selectInput}
      >
      {props.orders.map((name, i) => (
        <MenuItem value={name} key={i}>{name}</MenuItem>
      ))}
      </Select>
      <IconButton onClick={props.onAscChange} className={classes.sortIcon}>
        {ascIcon}
      </IconButton>
    </div>
  );

  const modeSelect = (
    <div>
      <ToggleButtonGroup value={props.mode} exclusive onChange={props.onModeChange}>
        <ToggleButton value={props.modes[1]}>
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value={props.modes[0]}>
          <ViewModuleIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );

  var popover = (
  <Popover 
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    id={id}
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
  >
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="center" spacing={1} alignItems="center" class={classes.dateGrid}>
        <Typography>
          Dates
        </Typography>
        <Grid item>
          <KeyboardDatePicker
          margin="normal"
          label="De"
          format="dd/MM/yyyy"
          value={props.from}
          onChange={props.onFromChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          textFieldStyle={{width: 150}}
          style={{width: 150}}
          />
        </Grid>
        <Grid item>
          <KeyboardDatePicker
            margin="normal"
            label="À"
            format="dd/MM/yyyy"
            value={props.to}
            onChange={props.onToChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            textFieldStyle={{width: 150}}
            style={{width: 150}}
          />
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  </Popover>);
  if (sm)
  {
    popover = (            
    <Popover 
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      className={classes.popover}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="center" spacing={2} alignItems="center" class={classes.dateGrid}>
          <Typography>
            Dates
          </Typography>
          <Grid item>
            <KeyboardDatePicker
            margin="normal"
            label="De"
            format="dd/MM/yyyy"
            value={props.from}
            onChange={props.onFromChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            textFieldStyle={{width: 200}}
            style={{width: 200}}
            />
          </Grid>
          <Grid item>
            <KeyboardDatePicker
              margin="normal"
              label="À"
              format="dd/MM/yyyy"
              value={props.to}
              onChange={props.onToChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              textFieldStyle={{width: 200}}
              style={{width: 200}}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <div style={{display: "flex"}}>
      <Grid container spacing={4} class={classes.popoverTitle} style={{display: "inline-flex", justifyContent: "space-around", flexGrow: 1}} alignItems="center">
        <Grid item style={{marginRight: 10}}>
          <div>
          <Typography>
            Order
          </Typography>
          {orderSelect}
          </div>
        </Grid>
        <Grid item>
          <Typography>
            Mode
          </Typography>
          {modeSelect}
        </Grid>
      </Grid>
      </div>
    </Popover>);
  }

  useEffect(() => {
    if (props.asc)
      setAscIcon(<ArrowUpward/>);
    else
      setAscIcon(<ArrowDownward/>);
  }, [props.asc]);

  return (
    <div className={classes.root}>
      <HideOnScroll target={props.scrollTarget}>
      <AppBar style={{ background: "#303030" }}>
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
            {props.title}
          </Typography>
          <div style={{flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div className={classes.search}>
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
                value={props.search}
                onChange={props.onSearchChange}
              />
            </div>
          </div>
          <div className={classes.select}>
              {orderSelect}
          </div>
          <div className={classes.select}>
            {modeSelect}
          </div>
          <IconButton aria-describedby={id} variant="contained" onClick={handleClick}>
              <FilterListIcon/>
          </IconButton>
          {popover}
          <IconButton onClick={props.refresh}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>
      </HideOnScroll>
      <Toolbar />
    </div>
  );
}

export default Bar;
