const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");

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


const driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic(process.env.DB_NAME, process.env.DB_PASSWORD)
);

app.get("/", authenticate, (req, res)=>{
        res.send("Hello world");
})

app.post("/register", (req, res) =>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    // let session = driver.session();
    var session = driver.session();

    // the Promise way, where the complete result is collected before we act on it:
    session
    .run('CREATE (:User {username: $usernameP, email: $emailP, password: $passwordP})',{
        usernameP: username,
        emailP: email,
        passwordP: password
    })
    .then(result => {
            console.log(result)    
        // result.records.forEach(record => {
            // console.log(record.get('name'))
        })
    .catch(error => {
        console.log(error)
    })
    .then(() => session.close());
})

app.post("/login", (req, res)=>{
    let username = req.body.username;
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

app.get("/close", (req, res)=>{
    driver.close();
})


app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})