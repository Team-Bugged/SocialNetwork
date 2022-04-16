import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = ()=>{
    const cookies = new Cookies();
    const navigate = useNavigate();

    let text = "home";
    useEffect(()=>{
        if(cookies.get("token")==undefined){
            navigate("/");
            text = "token not set";
        }
    }, [])
    

    return (<>
    <p>{text}</p>
    </>)
}