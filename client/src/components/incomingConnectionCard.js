import { Avatar, Card, Button,CardContent, Typography } from "@mui/material"
import { acceptConnection } from "../ServerConnection";

export const IncomingConnectionCard=(props)=>{
    const handleAcceptConnection = (event) => {
    console.log(event.target.value);
    acceptConnection(event.target.value);
    console.log("Accept");
  };
    console.log(props.userData);
    return(
        <Card  elevation={3} align="center">
            <Avatar
                 sx={{ mt:2,width: 96, height: 96 }}
                 alt="Remy Sharp"
                 src="https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small/beautiful-woman-avatar-character-icon-free-vector.jpg"                  
            />
            <CardContent>
                <Typography>
                    {props.userData.username}
                </Typography>
                <Typography sx={{fontSize: 13 }} color="text.secondary" >
                    {props.userData.about}
                </Typography>
                <Typography sx={{fontSize: 10}} color="text.secondary" >
                    7 Mutual Connections
                </Typography>
            </CardContent>
            <Button variant="outlined" value={props.userData.username} onClick={handleAcceptConnection}>
                Connect
            </Button>
           
        </Card>
    )
}