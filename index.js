const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

function authenticate (req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader  && authHeader.split(' ')[1];

    if(!token)  
        return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        console.log(user);
        next();
    })
}

app.get("/", authenticate, (req, res)=>{
        res.send("Hello world");
})

app.post("/login", (req, res)=>{
    let userName = req.body.userName;
    let password = req.body.password;
    
    if(password!="123"){

        /*USERNAME & PASSWORD CHECK GOES HERE*/
        res.status(403);
        res.send();
        return;
    }

    const TOKEN = jwt.sign(userName, process.env.SECRET_KEY);
    res.json({token: TOKEN});
})

app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})