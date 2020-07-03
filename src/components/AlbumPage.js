import React, { useState, useEffect, useReducer } from 'react';
import Album from './Album.js';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, Slider, List, ListItem } from '@material-ui/core'
import Bar from './Bar.js'

function AlbumPage() 
{
  const [albumsJson, setAlbums] = useState([]);
  const [api_query, setQuery] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      order: "Date",
      asc: false,
      offset: 0,
      query: "",
      from: 0,
      to: -1
    }
  );

  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  function execute_query()
  {
    setLoading(true);
    var prefix = "/api/albums/"
    if (api_query.query)
      prefix = "/api/albums/search/query=" + api_query.query + "&";
    
    var query = prefix + "dateFrom=" + api_query.from 
                       + "&dateTo="+ api_query.to 
                       + "&order=" + api_query.order.replace("Album", "Name") 
                       + "&asc=" + api_query.asc 
                       + "&count=50" 
                       + "&offset=" + api_query.offset;
    fetch(query).then(res => res.json()).then(data => {
      if (data.length > 0)
      {
        if (api_query.offset > 0)
          setAlbums(albumsJson.concat(data));
        else
          setAlbums(data)
      }
      setLoading(false);
    });
  }
  
  function refresh(){
    fetch("/api/update").then(res => res.json()).then(data => {
      setQuery({offset: 0, query: ""});
    })
  }

  useEffect(() => {
    execute_query();
  }, [api_query])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= 1.08 * e.target.clientHeight;
    console.log(bottom);
    if (bottom) 
      setQuery({offset: albumsJson.length})
  }

  function onSearchChange(event)
  {
    setQuery({offset: 0, query: event.target.value});
  }

  function onOrderChange(event)
  {
    var order = event.target.value
    var asc = true
    if (order === "Date")
      asc = false
    setQuery({offset: 0, order: order, asc: asc});
  }

  function onAscChange(event)
  {
    setQuery({asc: !api_query.asc});
  }

  function onFromChange(date)
  {
    var date = new Date(date);
    setQuery({from: Math.round(date.getTime() / 1000)});
  }

  function onToChange(date)
  {
    var date = new Date(date);
    setQuery({to: Math.round(date.getTime() / 1000)});
  }

  return(
    <div>
      <Bar title="Albums" 
           refresh={refresh} 
           search={api_query.query} 
           onSearchChange={onSearchChange} 
           orderValue={api_query.order} 
           onOrderChange={onOrderChange}
           orders={["Date", "Album", "Artist"]}
           asc={api_query.asc}
           onAscChange={onAscChange}
           from={api_query.from}
           onFromChange={onFromChange}
           to={api_query.to}
           onToChange={onToChange}/>
      <Box onScroll={handleScroll} style={{"height": "100%", overflowY: "scroll", top: 0, bottom: 0}}>
        <Box margin="3vh 0.5vw 0vh 0.5vw" style={{"height": "100%"}}>
          <Box display="flex" style={{justifyContent: "center", "height": "100%"}}>
            <Box width="75%" style={{"height": "100%"}}>
                <Grid container style={{flexGrow: 0, "height": "100%"}} spacing={2} justify="center">
                  {albumsJson.slice(0, albumsJson.length > 6 ? albumsJson.length - (albumsJson.length % 6) - 6 : albumsJson.length).map((album, i) => (
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
    </div>
  );
}

export default AlbumPage;
