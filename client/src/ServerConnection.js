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
    response = await axios.post(`${URL}/login`,{
        username: username,
        password: password,
    })
    return response;
}