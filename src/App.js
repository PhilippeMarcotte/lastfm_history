import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import Album from "./Album.js";
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  const [n_albums, setNbrAlbums] = React.useState(5);
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

  return (
    <div>
      <Box>
        <Typography variant="body2" color="textSecondary" component="p">
          Violett Pi
        </Typography>
        <Paper className={classes.control}>
            <Slider style={{width: 300}}
              defaultValue={2}
              onChange={handleChange}
              aria-labelledby="continuous-slider"
              min={0}
              max={10}
            />
        </Paper>
      </Box>
      <Paper className={classes.control}>
              <Slider style={{width: 300}}
                defaultValue={5}
                onChange={handleNbrAlbums}
                aria-labelledby="continuous-slider"
                min={0}
                max={21}
              />
      </Paper>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container align="left" spacing={spacing}>
            {albums.map((album, i) => (
              <Grid key={i} item>
                {album}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
