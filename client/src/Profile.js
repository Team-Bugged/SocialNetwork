import { useEffect, useState } from "react"
import { ProfileCard } from "./components/ProfileCard";
import { getProfile } from "./ServerConnection";

export const Profile = (props)=>{

    const [profileData, setProfileData] = useState();
    // const [dp, setDp] = useState();

    useEffect(()=>{
        getProfile().then((response)=>{
            setProfileData(response.data);
            // setDp()
        })
    }, [])
    const handleDpChange = (event)=>{
        console.log(event.target.files[0]);
    }

    // useEffect(()=>{
    //     if(profileData.dp)
    // },[dp])
    return (
        <>
            
            {profileData?<div>
                <ProfileCard connections = {props.connections} profileData = {profileData}/>
            </div>:"EMPTY"}
        </>
    )
}