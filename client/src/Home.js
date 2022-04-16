import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getConnections, sendsConnection } from "./ServerConnection"; 
import { DisplayConnections } from "./DisplayConnections";

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

    return (<>
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
    </>)
}