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
    console.log(authHeader)
    const token = authHeader  && authHeader.split(' ')[1];
    console.log(token);

    if(!token)  
        return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err)
            res.send(err);

        req.username = user;
        next();
    })
}

const driver = neo4j.driver(process.env.URI, neo4j.auth.basic(process.env.DB_USER, process.env.PASSWORD));
const session = driver.session();

app.get("/", (req, res)=>{
        res.send("Hello world");
})

app.post("/register", async (req, res) =>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    console.log("register hit");
    let hash = await bcrypt.hash(password, saltRounds);

    // Store hash in your password DB.
    if(!hash)
        console.log(hashError);
    password = hash;
    
    console.log("hash generated");
        var readQuery = 'MATCH (u:User {username: $usernameP}) RETURN u';
        var result = await session.readTransaction(tx =>
            tx.run(readQuery, {usernameP: username})
        );
        console.log("results for already match are: ", result);
        //if already present conflict status 409
        if(result.records.length>0){
            res.status(409);
            res.send({meassage: "username already exists"});
            return;
        }
        
        var writeQuery = 'CREATE (:User {username: $usernameP, email: $emailP, password: $passwordP})';
        result = await session.writeTransaction(tx => {
            tx.run(writeQuery, {
                usernameP: username,
                emailP: email,
                passwordP: password
            })
        });

        console.log(result)    
        res.status(200);
        res.send({"message": "Successfully Registered"});
    
})

app.post("/login", async (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    
    
    let readQuery = 'MATCH (u:User {username: $usernameP}) RETURN u';
    let result = await session.readTransaction(tx =>
        tx.run(readQuery, {
            usernameP: username
        })
    )
  
    console.log(result.records);
    console.log(result.records[0]._fields);
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

app.get("/getUserDetails",authenticate, async (req, res)=> {
    

    let readQuery = 'MATCH (u:User {username: $usernameP}) RETURN u';
    let result = await session.readTransaction(tx => 
        tx.run(readQuery, {
            usernameP :req.username
        }))

    console.log(result);
    console.log(result.records);
    if(neo4j.records.length>0)
    {
        console.log(result);
        res.status(200);
        res.send(result.records[0]._fields[0].properties);
    }
    else{
        console.log(err);
        res.send({message: err});
    }
})

app.post("/sendsConnection", authenticate, (req, res)=>{
    
    
    session.writeTransaction("MATCH (a:User),(b:User) WHERE a.username = $usernameP AND b.username = $connectToP CREATE (a)-[r:SendsConnection]->(b) RETURN type(r)",{
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
        res.send({message:"Error"});
    })

})

app.post("/acceptConnection", authenticate, (req, res)=>{
    
    let acceptConnectionFrom = req.body.acceptConnectionFrom;
    

    session.writeTransaction('MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP CREATE (a)-[c:Connection]->(b) CREATE (a)<-[r:Connection]-(b) RETURN c, r',{
        usernameP: req.username,
        acceptConnectionFromP: acceptConnectionFrom,
    })
    .then((result)=>{
        console.log(result);
        res.status(200);
        res.send({message:"Success"})
    })
    .catch((err)=>{
        console.log(err);
        res.status(500)
        res.send({message:"Error"});
    })

    session.writeTransaction('MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP DELETE s',{
        usernameP: req.username,
        acceptConnectionFromP: acceptConnectionFrom,
    })
    .then((result)=>{
        console.log(result);
    })
    .catch((err)=>{
        console.log(err);
    })

})

app.get("/getConnections", authenticate, (req, res)=>{
    
    
    session.readTransaction("MATCH (u:User {username: $usernameP})-[c:Connection]->(n:User) RETURN n", {
        usernameP: req.username,
    })
    .then((result)=>{
        res.status(200);
        let usernames = [];
        result.records.map((record)=>{
            usernames.push(record._fields[0].properties.username);
        })
        res.send(usernames);
    })
})

app.post("/getUserData", authenticate, (req, res)=>{
    

    session.readTransaction("MATCH (u:User{username: $usernameP})-[Connection]->(v:User{username: $currentUser}) RETURN u",{
        usernameP: req.body.Username, 
        currentUser: req.username,
    })
    .then((result)=>{
        if(result.records.length>0){
            let data = result.records[0]._fields[0].properties;
            data["degree"] = 1;
            delete data.password;
            res.send(data);
        }
        else{
            session.readTransaction("MATCH (u:User{username: $usernameP})-[Connection*..2]->(v:User{username: $currentUser}) RETURN u", {
                usernameP: req.body.Username,
                currentUser: req.username,
            })
            .then((result)=>{
                if(result.records.length>0){
                    let data = result.records[0]._fields[0].properties;
                    data["degree"] = 2;
                    delete data.password;
                    res.send(data);
                }
                else{
                    session.readTransaction("MATCH (u:User {username: $usernameP}) RETURN u", {
                        usernameP: req.body.Username
                    })
                    .then((result)=>{
                        if(result.records.length>0){
                            delete result.records[0]._fields[0].properties.password;   
                            res.send(result.records[0]._fields[0].properties)
                        }
                        else{
                            res.status(404);
                            res.send({message: "User Not found"});
                        }
                    })
                }
            })
        }
    })
    
    
})

app.get("/close", (req, res)=>{
    driver.close();
})


app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})