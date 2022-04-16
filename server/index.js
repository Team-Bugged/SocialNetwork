const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");
const bcrypt = require('bcrypt');

const saltRounds = 10;
const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
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
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(err)
            console.log(err);
        password = hash;
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
    });
    
})

app.post("/login", (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let session = driver.session();

    session.run('MATCH (u:User {username: $usernameP}) RETURN u',{
        usernameP: username,
    })
    .then((result)=>{
        if(result.records.length>0){
            let props =  result.records[0]._fields[0].properties;
            bcrypt.compare(password, props.password, function(err, result) {
                if(result){
                    const TOKEN = jwt.sign(username, process.env.SECRET_KEY);
                    res.json({token: TOKEN}); 
                }
                else{
                    res.status(401);
                    res.send({message: "Unauthorized access"});
                }
            });
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

app.get("/getUserDetails",authenticate, (req, res)=> {
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

app.post("/sendsConnection", authenticate, (req, res)=>{
    
    
    let session = driver.session();
    session.run("MATCH (a:User),(b:User) WHERE a.username = $usernameP AND b.username = $connectToP CREATE (a)-[r:SendsConnection]->(b) RETURN type(r)",{
        usernameP: req.username,
        connectToP: req.body.connectTo,
    })
    .then((result)=>{
        console.log(result);
        // res.send(result);
        res.status(200);
        res.send({message:"Success"})
        session.close()
    })
    .catch((err)=>{
        console.log(err);
        // res.send(err);
        res.status(500)
        session.close()
        res.send({message:"Error"});
    })

})

app.post("/acceptConnection", authenticate, (req, res)=>{
    
    let acceptConnectionFrom = req.body.acceptConnectionFrom;
    let session = driver.session();

    session.run('MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP CREATE (a)-[c:Connection]->(b) CREATE (a)<-[r:Connection]-(b) RETURN c, r',{
        usernameP: req.username,
        acceptConnectionFromP: acceptConnectionFrom,
    })
    .then((result)=>{
        console.log(result);
        res.status(200);
        res.send({message:"Success"})
        session.close()
    })
    .catch((err)=>{
        console.log(err);
        res.status(500)
        session.close()
        res.send({message:"Error"});
    })

    let session1 = driver.session();
    session1.run('MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP DELETE s',{
        usernameP: req.username,
        acceptConnectionFromP: acceptConnectionFrom,
    })
    .then((result)=>{
        console.log(result);
        session1.close()
    })
    .catch((err)=>{
        console.log(err);
        session1.close();
    })

})

app.get("/close", (req, res)=>{
    driver.close();
})


app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})