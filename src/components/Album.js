import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import {isMobile} from 'react-device-detect';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import LazyLoad from 'react-lazy-load';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  image: {
    width:"100%",
    maxWidth: 214,
    height: "auto",
    [theme.breakpoints.down('sm')]: {
      width: 158
    }
  },
  text: {
    maxWidth: 214,
  }
}));


const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const OverflowTip = props => {
  // Create Ref
  const textElementRef = useRef(null);

  const compareSize = () => {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setHover(compare);
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  // remove resize listener again on "componentWillUnmount"
  useEffect(() => () => {
    window.removeEventListener('resize', compareSize);
  }, []);

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(!open);
  };

  if (isMobile && hoverStatus)
  {
    const children = props.children(textElementRef, handleTooltipOpen)
    return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={props.title}
          style={{fontSize: '2em'}}
        >
          {children}
        </Tooltip>
      </ClickAwayListener>
    );
  }
  else
  {
    const children = props.children(textElementRef, null)
    return (
      <Tooltip
        title={props.title}
        interactive
        disableHoverListener={!hoverStatus}
        style={{fontSize: '2em'}}
      >
        {children}
      </Tooltip>
    );
  }
};

function FormattedTime(props)
{
  var date = new Date(props.time * 1000)
  var formattedTime = date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()
  return (<Typography variant="body2" color="textSecondary" component="p" style={{fontSize: "0.5vm"}}>
            {formattedTime}
          </Typography>)
}

function Album(props)
{
  const classes = useStyles();
  const isDownSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
  return (
    <Box>
      <LazyLoad height={isDownSm ? 158 : 214} offsetBottom={300} offsetTop={300}>
        <img  src={props.album.spotify_art ? props.album.spotify_art : props.album.lastfm_art} className={classes.image} alt=""/>
      </LazyLoad>
      <Box>
        <OverflowTip title={props.album.name}>
          {(ref, onClick) =>
            <Typography gutterBottom variant="h5" component="h2" style={{fontSize: "1vm"}} noWrap={true} ref={ref} onClick={onClick}>
              {props.album.name}
            </Typography>
          }
        </OverflowTip>
        <OverflowTip title={props.album.artist}>
          {(ref, onClick) =>
            <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: "0.5vm", marginTop:"-0.5rem"}} noWrap={true} ref={ref} onClick={onClick}>
              {props.album.artist}
            </Typography>
          }
        </OverflowTip>
        <FormattedTime time={props.album.date}/>
      </Box>
    </Box>
  );
}

export default Album;