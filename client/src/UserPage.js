import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "./ServerConnection";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import  Avatar  from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import { Box } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DraftsIcon from '@mui/icons-material/Drafts';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LanguageSharpIcon from '@mui/icons-material/LanguageSharp';
import AccessibilityNewSharpIcon from '@mui/icons-material/AccessibilityNewSharp';

export const UserPage = ()=>{
    const params = useParams();
    const [connectionData, setConnectionData] = useState({});

    useEffect(()=>{
        getUserData(params.username)
        .then((response)=>{
            console.log(response);
            setConnectionData(response.data);
        })
    }, [])
    const degree = `${connectionData.degree} Degree`
    return (<>
           
             <Box align="center"  style={{ display:'flex',justifyContent:'space-evenly'}}>
             <Grid  container
    spacing={0}
    align="center"
    // justify="center"
    direction="column"
    justifyContent="center"
    
    sx={{Width:'500'}}
    margin={5}
    paddingTop={6}
    style={{width:500}}
    >
             <Card sx={{ px:2,mr:3,borderRadius:8,Width: '500'}} align="center"  display="inline-block">
      <CardMedia sx={{mt:2}} align="center">
        <Avatar
         sx={{ width: 90, height: 90 }}
         alt="Remy Sharp"
         align="center"
         src="https://www.pngitem.com/pimgs/m/22-220721_circled-user-male-type-user-colorful-icon-png.png"
          
        />
      </CardMedia>
      <CardContent>
        <Typography sx={{ fontSize:20}}>
        {connectionData.username}
        </Typography>
        {/* <Typography sx={{ mt:2,fontSize: 15 }} color="text.secondary" gutterBottom>
          {props.profileData.about}
        </Typography>
        */}
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
        {connectionData.username}
      </ListItemButton>
      
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary={connectionData.email}  />
      </ListItemButton> 

      <ListItemButton>
        <ListItemIcon>
        
          <PersonAddAltIcon color="primary"/>
        </ListItemIcon>
        <ListItemText primary={degree} />
      </ListItemButton>  
      
      <ListItemButton>
        <ListItemIcon>
        
         
        <AccessibilityNewSharpIcon color="primary"/> 
        </ListItemIcon>
        <ListItemText primary={connectionData.about} />
        
      </ListItemButton>
      

      <ListItemButton>
        <ListItemIcon>
        
          <LanguageSharpIcon color="primary"/>
        </ListItemIcon>
        <ListItemText primary={connectionData.longitude} />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
        
          <LanguageSharpIcon color="primary"/>
        </ListItemIcon>
        <ListItemText primary={connectionData.latitude} />
      </ListItemButton>
        
    </List>
    </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
    </Grid>
</Box>

        </>)
}