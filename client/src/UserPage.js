import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "./ServerConnection";

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

    return (<>
            here is the data 
            <br/> Email: {connectionData.email} 
            <br/> UserName: {connectionData.username}
            <br/> Degree: {connectionData.degree}
        </>)
}