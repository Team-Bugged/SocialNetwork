import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom"

export const DisplayConnections = ({connections})=>{
    
    const navigate = useNavigate();

    const handleConnectionClick = ()=>{
        navigate(`/user/${connections}`);
    }

    return (
    <>
        <ListItemButton onClick={handleConnectionClick}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary={connections} />
        </ListItemButton>
    </>)
}