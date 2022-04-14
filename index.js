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

const authenticate  = (req, res, next)=> {
    const authHeader = req.headers['authorization'];
    const token = authHeader  && authHeader.split(' ')[1];

    if(!token)  
        return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err)
            res.send(err);

        req.username = user;
        next();
    })
}

// app.use(authenticate);


const driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic(process.env.DB_NAME, process.env.DB_PASSWORD)
);

app.get("/", (req, res)=>{
        res.send("Hello world");
})

app.post("/register", (req, res) =>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    let session = driver.session();

    session
    .run('MATCH (u:User {username: $usernameP}) RETURN u', {
        usernameP: username})
    .then((result)=>{
        //if already present conflict status 409
        if(result.records.length>0){
            res.status(409);
            res.send({meassage: "username already exists"});
            return;
        }
        // session.close();
        // session = driver.session();
        session.run('CREATE (:User {username: $usernameP, email: $emailP, password: $passwordP})',{
            usernameP: username,
            emailP: email,
            passwordP: password
        })
        .then(result => {
                console.log(result)    
                res.status(200);
                res.send({"message": "Successfully Registered"});
            })
        .catch(error => {
            console.log(error)
        })
        .then(()=>{
            session.close();
        })
    })
    .catch();
})

app.post("/login", (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    
    let session = driver.session();

    session.run('MATCH (u:User {username: $usernameP}) RETURN u',{
        usernameP: req.username,
    })
    .then((result)=>{
        if(result.records.length>0){
            let props =  result.records[0]._fields[0].properties;
            if(props.password == password){
                const TOKEN = jwt.sign(username, process.env.SECRET_KEY);
                res.json({token: TOKEN});    
            }
            else{
                res.status(401);
                res.send({message: "Unauthorized access"});
            }
            
        }
        else{
            res.status(404);
            res.send({message: "Username not found do register"});
        }
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    })
    .then(()=>{
        session.close();
    })

   
})  

app.get("/getuserdetails",authenticate, (req, res)=> {
    let session = driver.session();

    session.run('MATCH (u:User {username: $usernameP}) RETURN u', {
        usernameP: req.username,
    })
    .then((result)=>{
        console.log(result);
        res.status(200);
        res.send(result.records[0]._fields[0].properties);
    })
    .catch((err)=>{
        console.log(err);
        res.send({message: err});
    })
    .then(()=>{
        session.close();
    })
})

app.get("/close", (req, res)=>{
    driver.close();
})


app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})