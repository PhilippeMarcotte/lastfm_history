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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'block',
  },
  search: {
    position: "relative",
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
        width: '20ch',
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
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  popoverTitle: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

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
      <Typography className={classes.popoverTitle}>
        Dates
      </Typography>
      <Grid container justify="center" spacing={2} alignItems="center" class={classes.dateGrid}>
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
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Typography className={classes.popoverTitle}>
          Order
        </Typography>
        <div className={classes.popoverTitle}>
          {orderSelect}
        </div>
        <Typography className={classes.popoverTitle}>
          Dates
        </Typography>
        <Grid container justify="center" spacing={2} alignItems="center" class={classes.dateGrid}>
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
  }

  useEffect(() => {
    if (props.asc)
      setAscIcon(<ArrowUpward/>);
    else
      setAscIcon(<ArrowDownward/>);
  }, [props.asc]);

  return (
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
              <div className={classes.select}>
                {orderSelect}
              </div>
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
      </div>
  );
}

export default Bar;
