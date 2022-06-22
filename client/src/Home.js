import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getConnections, sendsConnection } from "./ServerConnection"; 
import { DisplayConnections } from "./DisplayConnections";
import {Navbar} from "./components/Navbar";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ProfileCard } from "./components/ProfileCard";
import { Card, Typography } from "@mui/material";
import { SuggestionCard } from "./components/SuggestionCard";


export const Home = ()=>{
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [inputBox, setInputBox] = useState(false);
    const [input, setInput] = useState("");

    const handleAddConnections = ()=>{
        setInputBox(!inputBox);
    }

    const handleInputChange = (input)=>{
        console.log(input.target.value);
        setInput(input.target.value);
    }

    const handleAddConnectionsSubmit =()=>{
        sendsConnection(input);
    }

    let text = "home";
    useEffect(()=>{
        if(cookies.get("token")==undefined){
            navigate("/");
            text = "token not set";
        }
        else{
            getConnections(cookies.get("token"))
            .then((response)=>{
                setConnections(response.data)
            })
        }
    }, [])

    return (
    <Box height='100%' backgroundColor="#dce6f1" >
    <Navbar/>
    <Box sx={{m:2,display:'flex'}}>
        <ProfileCard/>
        
    <Box 
      sx={{
        p:2,
        // backgroundColor: 'primary.dark',
        borderRadius:7,
        display: 'flex',
        width: 1000,
        height: 508,
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1.5,
          mb:2,
          border:1,
          borderColor:'primary.dark',
          borderRadius:5,          
          width: 180,
          height: 250,
          
        },
      }}
    >
      
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      
      
      
    </Box>

    </Box>
    






    {connections.length>0? connections.map((con)=>{
        return <DisplayConnections key = {con} connections={con} />
    }) : "No connections"}
    <div>
        <button onClick={handleAddConnections}>Add Connections</button>
    </div>
    {inputBox?<>
        <input onChange={handleInputChange}/>
        <button onClick={handleAddConnectionsSubmit}>Submit</button>
        </>:
        <></>}
    </Box>)
}