import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    cover: {
      height: 300,
      width: 240,
    },
    text: {
      paddingLeft: 10,
    }
  }));


function Album() {
  const classes = useStyles();
  return (
    <Box className={classes.cover}>
      <img width="240" height="240" src={process.env.PUBLIC_URL + "/album.jpg"}/>
      <Box className={classes.text}>
        <Typography gutterBottom variant="h5" component="h2">
          Violett Pi
        </Typography>
        <Typography style={{marginTop: -10}} variant="body2" color="textSecondary" component="p">
          Violett Pi
        </Typography>
      </Box>
    </Box>
  );
}

export default Album;