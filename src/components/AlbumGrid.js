import React, { useState, useEffect } from 'react';
import Album from './Album.js';
import { Box, Grid, Typography, Slider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  Slider:  {
    width: 300,
  }
}));


function AlbumGrid({ latestUpdate })
{ 
  const [albumsJson, setAlbums] = useState([]);

  useEffect(() => {
    fetch('/api/albums').then(res => res.json()).then(data => {
      setAlbums(data);
    });
    console.log(latestUpdate);
  }, [latestUpdate]);

  const classes = useStyles();

  return(
    <Box>
      <Box margin="3vh 0.5vw 0vh 0.5vw">
        <Box display="flex" style={{justifyContent: "center"}}>
          <Box width="75%">
              <Grid container className={classes.root} spacing={2} justify="center" >
                {albumsJson.map((album, i) => (
                    <Grid key={i} item>
                    <Album album={album} />
                    </Grid>
                ))}
              </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AlbumGrid;
