import { useEffect, useState } from "react"
import { getProfile } from "./ServerConnection";

export const Profile = ()=>{

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
                {profileData.username}
                <br/>
                {profileData.email}
                {profileData.dp?<img src={profileData.dp}/>:
                <div>
                    <input type = "file" onChange={handleDpChange}/>
                    {/* <button onClick={handleDpSubmit}/> */}
                </div>
                    }
            </div>:"EMPTY"}
        </>
    )
}