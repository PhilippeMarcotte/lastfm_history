import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, Dialog, AppBar, Toolbar, IconButton, makeStyles } from '@material-ui/core';
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
  root: {
    "&last-child": {
      borderBottom: "none"
    }
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
      backgroundColor: "#303030",
      "&:last-child td": {
        borderBottom: 0,
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
  image: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(50),
  }
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
    if (!removed)
      fetch("/api/songs/artist=" + album.artist + "&album=" + album.name).then(res => res.json()).then(data => {
        setSongs(data);
      })
  }, [album, removed])
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
      <Box display="flex" justifyContent="center">
        <Box style={{display: "flex", width: "65%", paddingTop: 3*8, paddingBottom: 3*8}}>
          <img  src={album.spotify_art ? album.spotify_art : album.lastfm_art} alt="" style={{height: 300, width: 300}}/>
          <div style={{paddingTop: 20}}>
            <Typography>{album.name}</Typography>
          </div>
        </Box>
      </Box>
      <Box>
        <Box display="flex" style={{justifyContent: "center"}}>
          <Box width="75%">
            <TableContainer component={Paper} elevation={false}>
              <Table size="small" aria-label="simple table">
                {/* <TableHead>
                  <StyledTableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="center">Song</StyledTableCell>
                    <StyledTableCell align="center">Last Listen</StyledTableCell>
                    <StyledTableCell align="center">Listen Count</StyledTableCell>
                  </StyledTableRow>
                </TableHead> */}
                <TableBody>
                  {songs.map((song, i) => (
                    <StyledTableRow key={i}>
                      <TableCell align="center">
                        {song.album_order}
                      </TableCell>
                      <TableCell align="center">
                        {song.name}
                      </TableCell>
                      <TableCell align="center">
                        {formatTime(song.date)}
                      </TableCell>
                      <TableCell align="center">
                        {song.count}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Dialog>
    );
  else
    return null;
}

export default FullAlbum;