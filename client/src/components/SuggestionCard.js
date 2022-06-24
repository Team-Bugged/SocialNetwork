import { Avatar, Card, Button,CardContent, Typography } from "@mui/material"
import { sendsConnection } from "../ServerConnection";
import {useState} from "react"

export const SuggestionCard=(props)=>{

    const [buttonName, setButtonName] = useState("connect");

    const sendConnectionTo = "";
    console.log(props.userData);

    const handleAddConnection =(event)=>{
            sendsConnection(event.target.value);
            setButtonName("Connection Sent")
            props.handleSendConnection(event.target.value);
    console.log(props.userData);
    }
    
    return(
        <Card  elevation={3} align="center">
            <Avatar
                 sx={{ mt:2,width: 96, height: 96 }}
                 alt="Remy Sharp"
                 src="https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small/beautiful-woman-avatar-character-icon-free-vector.jpg"                  
            />
            <CardContent value= {props.userData.username} onClick = {props.handleProfileOnClick}>
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
            <Button value={props.userData.username} variant="outlined" onClick={handleAddConnection}>
                {buttonName}
            </Button>
           
        </Card>
    )
}