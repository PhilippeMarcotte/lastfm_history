import React from 'react';
import Album from './Album.js';
import { Box, Grid } from '@material-ui/core'

function AlbumGrid({albums, NbrPerRow})
{
  return (
    <Box>
      <Grid container style={{flexGrow: 0}} spacing={2} justify="center" alignItems="center" alignContent="center">
      {albums.slice(0, albums.length > NbrPerRow ? albums.length - (albums.length % NbrPerRow) - NbrPerRow : albums.length).map((album, i) => (
        <Grid key={i} item xs={6} sm={2}>
          <Album album={album} />
        </Grid>
      ))}
      </Grid>
      <Box height="8vh"></Box>
    </Box>
  )
};

export default AlbumGrid;
