import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Dialog, AppBar, Toolbar, IconButton, makeStyles } from '@material-ui/core';
import { Zoom, Slide } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#212121",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function formatTime(unixTime)
{
  var date = new Date(unixTime * 1000);
  return date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear();
}

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
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("/api/songs/artist=" + album.artist + "&album=" + album.name).then(res => res.json()).then(data => {
      setSongs(data);
    })
  }, [album])
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
      <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <StyledTableRow>
          <StyledTableCell align="center">#</StyledTableCell>
            <StyledTableCell align="center">Song</StyledTableCell>
            <StyledTableCell align="center">Last Listen</StyledTableCell>
            <StyledTableCell align="center">Listen Count</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {songs.map((song, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="center">
                {song.album_order}
              </StyledTableCell>
              <StyledTableCell align="center">
                {song.name}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formatTime(song.date)}
              </StyledTableCell>
              <StyledTableCell align="center">
                {song.count}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Dialog>
    );
  else
    return null;
}

export default FullAlbum;