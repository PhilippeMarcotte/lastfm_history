import React, { useState, useEffect, useReducer, useRef } from 'react';
import AlbumGrid from './AlbumGrid.js';
import AlbumTable from './AlbumTable.js';
import { Box, Grid } from '@material-ui/core'
import Bar from '../Bar.js'
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';

const MODE = {
  GRID: "grid",
  TABLE: "table"
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(8),
  },
}));

function ScrollTop(props) {
  const { children, target } = props;
  const [atTop, setAtTop] = useState(true);
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: target,
    disableHysteresis: false,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    console.log(anchor);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Slide appear={false} direction="up" in={!trigger} mountOnEnter unmountOnExit>
        <div onClick={handleClick} role="presentation" className={classes.root}>
          {children}
        </div>
    </Slide>
  );
}

function AlbumPage(props) 
{
  const [albumsJson, setAlbums] = useState([]);
  const [api_query, setQuery] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      order: "Date",
      asc: false,
      offset: 0,
      query: "",
      from: new Date(0),
      to: new Date()
    }
  );
  const [mode, setMode] = useState(MODE.GRID);
  const [loading, setLoading] = useState(false);
  function execute_query()
  {
    var prefix = "/api/albums/"
    if (api_query.query)
      prefix = "/api/albums/search/query=" + api_query.query + "&";

    var query = prefix + "dateFrom=" + Math.round(api_query.from.getTime() / 1000)
                       + "&dateTo="+ Math.round(api_query.to.getTime() / 1000)
                       + "&order=" + api_query.order.replace("Album", "Name") 
                       + "&asc=" + api_query.asc 
                       + "&count=50" 
                       + "&offset=" + api_query.offset;
    setLoading(true);
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
    fetch("/api/update").then(res => res.json()).then(() => {
      setQuery({offset: 0, query: ""});
    })
  }

  useEffect(() => {
    execute_query();
  }, [api_query])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= 1.08 * e.target.clientHeight;
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
    setQuery({asc: !api_query.asc, offset: 0});
  }

  function onFromChange(date)
  {
    setQuery({from: new Date(date)});
  }

  function onToChange(date)
  {
    setQuery({to: new Date(date)});
  }

  const [scrollTarget, setScrollTarget] = useState(undefined);
  function onModeChange(event, value)
  {
    if (value)
      setMode(value);
    setQuery({offset: 0, query: ""});
    scrollTarget.scrollTop = 0;
  }

  function display()
  {
    if (mode === MODE.GRID)
      return (<AlbumGrid albums={albumsJson} NbrPerRow={6}/>);
    else if (mode === MODE.TABLE)
      return (<AlbumTable albums={albumsJson}/>);
  }

  return(
    <div onScroll={handleScroll} style={{"height": "100vh", overflowY: "scroll", top: 0, bottom: 0}} ref={scrollable => { if (scrollable) setScrollTarget(scrollable); }}>
      <div id="back-to-top-anchor"></div>
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
          onToChange={onToChange}
          modes={[MODE.GRID, MODE.TABLE]}
          mode={mode}
          onModeChange={onModeChange}
          scrollTarget={scrollTarget}
          />
      <Box my={2} /*style={{"height": "100vh", overflowY: "scroll", top: 0, bottom: 0}}*/>
        <Box margin="3vh 0.5vw 0vh 0.5vw">
          <Box display="flex" style={{justifyContent: "center"}}>
            <Box width="75%">
              {display()}
            </Box>
            <ScrollTop target={scrollTarget}>
            <Fab>
              <NavigationIcon/>
            </Fab>
            </ScrollTop>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default AlbumPage;
