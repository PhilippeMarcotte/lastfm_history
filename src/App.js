import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Album from "./components/Album.js";
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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

function App() {
  const [spacing, setSpacing] = React.useState(2);
  const [n_albums, setNbrAlbums] = React.useState(50);
  const [albumsJson, setAlbums] = useState([]);

  useEffect(() => {
    fetch('/api/albums').then(res => res.json()).then(data => {
      setAlbums(a => a.concat(data));
    });
  }, []);

  const classes = useStyles();

  const handleChange = (event, value) => {
    setSpacing(Number(value));
  };

  const handleNbrAlbums = (event, value) => {
    setNbrAlbums(Number(value));
  };

  var albums = [];
  for (var i = 0; i < n_albums; i++)
  {
    albums.push(<Album/>);
  }
  console.log({albumsJson})
  return (
      <div>
        <Box margin="3vh 0.5vw 0vh 0.5vw">
          <Box>
            <Typography variant="body2" component="p">
                Spacing
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Slider style={{width: 300}}
                defaultValue={2}
                onChange={handleChange}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={10}
              />
              <Typography variant="body2" component="label" style={{marginLeft: "10px"}}>
                {spacing}
              </Typography>
            </Box>
            <Typography variant="body2" component="p">
                Number of albums
            </Typography>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Slider style={{width: 300}}
                defaultValue={50}
                onChange={handleNbrAlbums}
                aria-labelledby="continuous-slider"
                min={0}
                max={100}
              />
              <Typography variant="body2" component="label" style={{marginLeft: "10px"}}>
                {n_albums}
              </Typography>
            </Box>
          </Box>        
          <Box display="flex" style={{justifyContent: "center"}}>
            <Box width="75%">
              <Grid container className={classes.root} spacing={spacing} justify="center" >
                {albumsJson.map((album, i) => (
                  <Grid key={i} item>
                    <Album album={album} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </div>
  );
}

export default App;
