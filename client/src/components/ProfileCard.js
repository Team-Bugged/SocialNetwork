import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import  Avatar  from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
// import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import PersonIcon from '@mui/icons-material/Person';




export const ProfileCard=(props)=> {

  let numConnections = props.connections.length + ' Connections ';
  return (
    <Card sx={{ px:2,m:3,borderRadius:8,minWidth: 275}} align="center">
      <CardMedia sx={{mt:2}} align="center">
        <Avatar
         sx={{ width: 76, height: 76 }}
         alt="Remy Sharp"
         src="https://www.pngitem.com/pimgs/m/22-220721_circled-user-male-type-user-colorful-icon-png.png"
          
        />
      </CardMedia>
      <CardContent>
        <Typography sx={{ fontSize:20}}>
          {props.profileData.username}
        </Typography>
        <Typography sx={{ mt:2,fontSize: 15 }} color="text.secondary" gutterBottom>
          {props.profileData.about}
        </Typography>
       
        <hr/>
        <List
      sx={{ mt:2,width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    //   subheader={
    //     <ListSubheader component="div" id="nested-list-subheader">
    //       Connections
    //     </ListSubheader>
    //   }
     >
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon color="primary"/>
        </ListItemIcon>
        <ListItemText primary={numConnections}/>
      </ListItemButton>
      
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary={props.profileData.email} />
      </ListItemButton>   

      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary={props.profileData.about} />
      </ListItemButton>     
    </List>
    </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
