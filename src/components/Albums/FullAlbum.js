import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Dialog, AppBar, Toolbar, IconButton, makeStyles } from '@material-ui/core';
import { Zoom, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background: "#303030"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullAlbum({ album, show, onClose })
{
  const classes = useStyles();
  const [removed, setRemoved] = useState(true);
  function handleClose(event)
  {
    onClose(event);
  }
  if (show && removed)
    setRemoved(false);
  if (!removed)
    return (
      <Dialog fullScreen open={show} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ style: { background: "#303030"} }}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <img  src={album.spotify_art ? album.spotify_art : album.lastfm_art} alt="" style={{height: 300, width: 300}}/>
    </Dialog>
    );
  else
    return null;
}

export default FullAlbum;