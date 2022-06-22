import { Avatar, Card, Button,CardContent, Typography } from "@mui/material"

export const SuggestionCard=()=>{
    return(
        <Card  elevation={3} align="center">
            <Avatar
                 sx={{ mt:2,width: 96, height: 96 }}
                 alt="Remy Sharp"
                 src="https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small/beautiful-woman-avatar-character-icon-free-vector.jpg"                  
            />
            <CardContent>
                <Typography>
                    Vridhi Kamath
                </Typography>
                <Typography sx={{fontSize: 13 }} color="text.secondary" >
                    MERN Developer
                </Typography>
                <Typography sx={{fontSize: 10}} color="text.secondary" >
                    7 Mutual Connections
                </Typography>
            </CardContent>
            <Button variant="outlined">
                Connect
            </Button>
           
        </Card>
    )
}