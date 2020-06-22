import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const OverflowTip = props => {
  // Create Ref
  const textElementRef = useRef();

  const compareSize = () => {
    // if (textElementRef.current !== undefined)
    // {
      const compare =
        textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setHover(compare);
    // }
  };

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, []);

  // remove resize listener again on "componentWillUnmount"
  useEffect(() => () => {
    window.removeEventListener('resize', compareSize);
  }, []);

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false);

  return (
    <Tooltip
      title={props.value}
      interactive
      disableHoverListener={!hoverStatus}
      style={{fontSize: '2em'}}
    >
      <Typography gutterBottom variant="h5" component="h2" style={{fontSize: "1vm", width:"214px"}} noWrap={true} ref={textElementRef}>
        {props.value}
      </Typography>
    </Tooltip>
  );
};

function FormattedTime(props)
{
  var date = new Date(props.time * 1000)
  var formattedTime = monthNames[date.getMonth()] + ", " + date.getFullYear()
  return (<Typography variant="body2" color="textSecondary" component="p" style={{fontSize: "0.5vm"}}>
            {formattedTime}
          </Typography>)
}

function Album(props) 
{
  const imageStyle = {
    minWidth: "125px",
    width:"100%",
    maxWidth: "214px",
    height: "auto"
  };

  return (
    <Box>
      <img  src={props.album.lastfm_art} style={imageStyle} />
      <Box>
        <OverflowTip value={props.album.name}/>
        <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: "0.5vm", marginTop:"-0.5rem"}}>
          {props.album.artist}
        </Typography>
        <FormattedTime time={props.album.date}/>
      </Box>
    </Box>
  );
}

export default Album;