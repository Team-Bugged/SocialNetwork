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
import shadows from "@mui/material/styles/shadows";
import { Profile } from "./Profile";
import { GetSuggestions } from "./getSuggestions";


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
    <Box height='100%' >
        
    <Navbar/>
    <Box sx={{m:2,display:'flex'}}>
        <Profile/>
        
    <Box>
        <h1>Incoming Connections: </h1>
    <Box 
      sx={{
          p:2,
          backgroundColor: 'white',
          
        borderRadius:7,
        display: 'flex',
        width: 870,
        minHeight: 508,
        flexWrap: 'wrap',
        // justifyContent:'center',
        '& > :not(style)': {
          m: 1,
          mb:2,
        //   border:1,
        //   borderColor:'primary.dark',
          borderRadius:5,          
          width: 180,
          height: 250,
          
        },
        '& > :hover':{
            cursor:'pointer',
            backgroundColor:'secondary.main',
            boxShadow:6,
        }
      }}
    >
      {/* <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/>
      <SuggestionCard/> */}
      
      
      
    </Box>
    <h1>Suggested Connections: </h1>
    <Box 
      sx={{
          p:2,
          backgroundColor: 'white',
          
          borderRadius:7,
          display: 'flex',
          width: 870,
        minHeight: 508,
        flexWrap: 'wrap',
        justifyContent:'space-between',
        '& > :not(style)': {
            m: 1,
            mb:2,
            //   border:1,
            //   borderColor:'primary.dark',
            borderRadius:5,          
          width: 180,
          height: 250,
          
        },
        '& > :hover':{
            cursor:'pointer',
            backgroundColor:'secondary.main',
            boxShadow:6,
        }
    }}
    >
    <GetSuggestions/>
      
    </Box>
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