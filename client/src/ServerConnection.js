import Cookies from "universal-cookie"
const axios = require("axios").default;
const URL = "http://localhost:5000";


export const registerUser = async (username, password, email)=>{
    let response;
    response = await axios.post(`${URL}/register`,{
        username: username,
        password: password,
        email: email,
    })
    return response.status;
}

export const loginUser = async (username, password) =>{
    let response;
    const cookie = new Cookies();
    response = await axios.post(`${URL}/login`,{
        headers: {
            authorization: cookie.get("token")
        },
        username: username,
        password: password,
    })
    return response;
}

export const getConnections = async () =>{
    let response;
    const cookie = new Cookies();
    response = await axios.get(`${URL}/getConnections`, {
        headers: {
            authorization: `Bearer ${cookie.get("token")}`
        },
    })

    return response;
}


export const sendsConnection = async (input) =>{
    let response;
    const cookie = new Cookies();
    response = await axios.post(`${URL}/sendsConnection`,{
        connectTo: input,
    }, {
        headers: {
            authorization: `Bearer ${cookie.get("token")}`
        },
    })

    return response;
}

export const getUserData = async (username) => {
    let response;
    const cookie = new Cookies();
    response = await axios.post(`${URL}/getConnectionData`,{
        Username: username,
    },{
        headers: {
            authorization: `Bearer ${cookie.get("token")}`
        },
    })

    return response;
}