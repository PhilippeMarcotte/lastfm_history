import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";



function Album() {
  const imageStyle = {
    maxWidth: "100%",
    height: "auto"
  };
  const img = process.env.PUBLIC_URL + "/album.jpg";
  return (
    <Box>
      <img  src={process.env.PUBLIC_URL + "/album.jpg"}/>
      <Box>
        <Typography gutterBottom variant="h5" component="h2" style={{fontSize: "1vm"}}>
          Violett Pi
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: "0.5vm", marginTop:"-0.5rem"}}>
          Violett Pi
        </Typography>
      </Box>
    </Box>
  );
}

export default Album;