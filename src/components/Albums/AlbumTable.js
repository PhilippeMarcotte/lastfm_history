import React from 'react';
import Album from './Album.js';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';

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

function AlbumTable({albums})
{
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center"></StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Artist</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {albums.map((album, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="center">
                <img src={album.spotify_art ? album.spotify_art : album.lastfm_art} height="50"></img>
              </StyledTableCell>
              <StyledTableCell align="center">
                {album.name}
              </StyledTableCell>
              <StyledTableCell align="center">
                {album.artist}
              </StyledTableCell>
              <StyledTableCell align="center">
                {formatTime(album.date)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default AlbumTable;
