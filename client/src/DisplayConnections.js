import { useNavigate } from "react-router-dom"

export const DisplayConnections = ({connections})=>{
    
    const navigate = useNavigate();

    const handleConnectionClick = ()=>{
        navigate(`/user/${connections}`);
    }

    return <div onClick={handleConnectionClick}>{connections}</div>
}