import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserData } from "./ServerConnection";

export const UserPage = ()=>{
    const params = useParams();
    const [connectionData, setConnectionData] = useState({});

    useEffect(()=>{
        getUserData(params.username)
        .then((response)=>{
            setConnectionData(response);
        })
    }, [])

    return (<>
        {/* {setConnectionData} */}
        </>)
}