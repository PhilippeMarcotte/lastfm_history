import React, { useState, useEffect, useRef } from 'react';
import Album from './Album.js';
import { Box, Grid, Typography, Slider, List, ListItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';
import InfiniteScroll from "react-infinite-scroll-component";

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

function loadItems(prevArray = [], startCursor = 0) {
  return new Promise(resolve => {
    fetch('/api/albums/order="date"&asc=false&offset=' + startCursor + '&count=40').then(res => res.json()).then(data => {
      let newArray = prevArray;
      console.log(data)
      newArray = newArray.concat(data);
      console.log(newArray);
      resolve(newArray);
    });
  });
}


function AlbumGrid({ latestUpdate })
{ 
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [albumsJson, setAlbums] = useState([]);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current)
    {
      fetch('/api/albums').then(res => res.json()).then(data => {
        setAlbums(data);
      });
      console.log(latestUpdate);
      firstUpdate.current = false;
    }
  }, [latestUpdate]);

  function handleLoadMore() {
    setLoading(true);
    loadItems(albumsJson, albumsJson.length).then(newArray => {
      setLoading(false);
      console.log(newArray);
      if (newArray.length === albumsJson.length)
      {
        setHasNextPage(false);
      }
      setAlbums(newArray);
      console.log(albumsJson.length - (albumsJson.length % 5))
    });
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage: hasNextPage,
    onLoadMore: handleLoadMore,
    scrollContainer:"window",
  });

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= 1.08 * e.target.clientHeight;
    console.log(bottom);
    if (bottom && hasNextPage) { handleLoadMore() }
  }
  const classes = useStyles();

  return(
    <Box onScroll={handleScroll} style={{"height": "100vh", "overflow-y": "scroll", top: 0, bottom: 0}}>
      <Box margin="3vh 0.5vw 0vh 0.5vw">
        <Box display="flex" style={{justifyContent: "center"}}>
          <Box width="75%">
              <Grid container className={classes.root} spacing={2} justify="center">
              
              
              {albumsJson.slice(0, albumsJson.length - (albumsJson.length % 6) - 6).map((album, i) => (
                  <Grid key={i} item>
                  <Album album={album} />
                  </Grid>
              ))}
            </Grid>
            <Box height="8vh"></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AlbumGrid;
