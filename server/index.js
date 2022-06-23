const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");
const bcrypt = require('bcrypt');
const axios = require('axios');

const saltRounds = 10;
const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) res.send(err);

    req.username = user;
    next();
  });
};

const driver = neo4j.driver(
  process.env.URI,
  neo4j.auth.basic(process.env.DB_USER, process.env.PASSWORD)
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", async (req, res) =>{
  
    const session = driver.session();

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let about = req.body.about;
    // console.log("register hit");
    let hash = await bcrypt.hash(password, saltRounds);

    // Store hash in your password DB.
    if(!hash)
        console.log(hashError);
    password = hash;
    
    // console.log("hash generated");
        var readQuery = 'MATCH (u:User {username: $usernameP}) RETURN u';
        var result = await session.readTransaction(tx =>
            tx.run(readQuery, {usernameP: username})
        );
        // console.log("results for already match are: ", result);
        //if already present conflict status 409
        if(result.records.length>0){
            res.status(409);
            res.send({meassage: "username already exists"});
            return;
        }
        else{
            const params = {
                access_key: process.env.POSITIONSTACK_API_KEY,
                query: req.body.location
              }
              console.log(params.query)
              let latitude, longitude;
              let response = await axios.get('http://api.positionstack.com/v1/forward', {params});

              // console.log(response.data.data[0]);
              latitude= response.data.data[0].latitude;
              longitude=response.data.data[0].longitude;    
              
            var writeQuery = 'CREATE (:User {username: $usernameP, email: $emailP, password: $passwordP, about: $aboutP, longitude: $longitudeP, latitude: $latitudeP})';
            result = await session.writeTransaction(tx => {
                tx.run(writeQuery, {
                    usernameP: username,
                    emailP: email,
                    passwordP: password,
                    aboutP: about, 
                    latitudeP: latitude,
                    longitudeP: longitude, 
                })
            });

            // console.log(result)    
            res.status(200);
            res.send({"message": "Successfully Registered"});
        }
        
        
    session.close();
})

app.post("/login", async (req, res) => {
  const session = driver.session();
  let username = req.body.username;
  let password = req.body.password;

  let readQuery = "MATCH (u:User {username: $usernameP}) RETURN u";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: username,
    })
  );

  // console.log(result.records);
  // console.log(result.records[0]._fields);
  if (result.records.length > 0) {
    let props = result.records[0]._fields[0].properties;
    bcrypt.compare(password, props.password, function (err, result) {
      if (result) {
        const TOKEN = jwt.sign(username, process.env.SECRET_KEY);
        res.json({ token: TOKEN });
      } else {
        res.status(401);
        res.send({ message: "Unauthorized access" });
      }
    });
  } else {
    res.status(404);
    res.send({ message: "Username not found do register" });
  }
  session.close();
});

app.get("/getUserDetails", authenticate, async (req, res) => {
  const session = driver.session();
  let readQuery = "MATCH (u:User {username: $usernameP}) RETURN u";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: req.username,
    })
  );

  if (result.records.length > 0) {
    // console.log(result);
    res.status(200);
    let data = result.records[0]._fields[0].properties;
    delete data.password;
    res.send(data);
  } else {
    console.log(err);
    res.send({ message: err });
  }
  session.close();
});

app.post("/sendsConnection", authenticate, async (req, res) => {
  const session = driver.session();
  var writeQuery =
    "MATCH (a:User),(b:User) WHERE a.username = $usernameP AND b.username = $connectToP CREATE (a)-[r:SendsConnection]->(b) RETURN type(r)";
  var result = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {
      usernameP: req.username,
      connectToP: req.body.connectTo,
    })
  );

  // console.log(result);
  // res.send(result);
  res.status(200);
  res.send({ message: "Success" });
session.close();
  // .catch((err)=>{
  //     console.log(err);
  //     // res.send(err);
  //     res.status(500)
  //     res.send({message:"Error"});
  // })
});

app.get("/getIncomingConnections", authenticate, async (req, res) => {
  const session = driver.session();
  let readQuery =
    "MATCH (u:User{username:$usernameP})<-[s:SendsConnection]-(v:User) RETURN v;";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: req.username,
    })
  );

  res.status(200);
  let incomingConnections = [];
  result.records.map((record) => {
    incomingConnections.push(record._fields[0].properties);
  });
  res.send(incomingConnections);
  session.close();
});

app.post("/acceptConnection", authenticate, async (req, res) => {
  const session = driver.session();
  let acceptConnectionFrom = req.body.acceptConnectionFrom;

  let writeQuery =
    "MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP CREATE (a)-[c:Connection]->(b) CREATE (a)<-[r:Connection]-(b) RETURN c, r";
  let result = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {
      usernameP: req.username,
      acceptConnectionFromP: acceptConnectionFrom,
    })
  );

  // console.log(result);
  res.status(200);
  res.send({ message: "Success" });

  // .catch((err)=>{
  //     console.log(err);
  //     res.status(500)
  //     res.send({message:"Error"});
  // })

  writeQuery =
    "MATCH (a:User)<-[s:SendsConnection]-(b:User) WHERE a.username = $usernameP AND b.username= $acceptConnectionFromP DELETE s";
  result = await session.writeTransaction((tx) =>
    tx.run(writeQuery, {
      usernameP: req.username,
      acceptConnectionFromP: acceptConnectionFrom,
    })
  );

  // console.log(result);
session.close();
  // .catch((err)=>{
  //     console.log(err);
  // })
});

app.get("/getConnections", authenticate, async (req, res) => {
  const session = driver.session();
  let readQuery =
    "MATCH (u:User {username: $usernameP})-[c:Connection]->(n:User) RETURN n";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: req.username,
    })
  );

  res.status(200);
  let usernames = [];
  result.records.map((record) => {
    usernames.push(record._fields[0].properties.username);
  });
  res.send(usernames);
  session.close();
});

app.post("/getUserData", authenticate, async (req, res) => {
  const session = driver.session();
  let readQuery =
    "MATCH (u:User{username: $usernameP})-[Connection]->(v:User{username: $currentUser}) RETURN u";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: req.body.Username,
      currentUser: req.username,
    })
  );
  // .then((result)=>{
  // console.log(result.records.length);
  if (result.records.length > 0) {
    let data = result.records[0]._fields[0].properties;
    data["degree"] = 1;
    delete data.password;
    res.send(data);
  } else {
    readQuery =
      "MATCH (u:User{username: $usernameP})-[c1:Connection]->(w:User)-[c2:Connection]->(v:User{username: $currentUser}) RETURN u";
    result = await session.readTransaction((tx) =>
      tx.run(readQuery, {
        usernameP: req.body.Username,
        currentUser: req.username,
      })
    );
    // .then((result)=>{
    if (result.records.length > 0) {
      let data = result.records[0]._fields[0].properties;
      data["degree"] = 2;
      delete data.password;
      res.send(data);
    } else {
      readQuery =
        "MATCH (u:User{username: $usernameP})-[c1:Connection]->(w:User)-[c2:Connection]->(x:User)-[c3:Connection]->(v:User{username: $currentUser}) RETURN u";
      result = await session.readTransaction((tx) =>
        tx.run(readQuery, {
          usernameP: req.body.Username,
          currentUser: req.username,
        })
      );
      // .then((result)=>{
      if (result.records.length > 0) {
        let data = result.records[0]._fields[0].properties;
        data["degree"] = 3;
        delete data.password;
        res.send(data);
      } else {
        res.status(404);
        res.send({ message: "User Not found" });
      }
      // })
    }
    // })
  }
  // })
  session.close();
});

app.get("/getSuggestions", authenticate, async (req, res) => {
  const session = driver.session();
  let readQuery =
    "MATCH (u:User{username: $usernameP })-[c1:Connection]->(v:User)-[c2:Connection]->(w: User) RETURN w;";
  let result = await session.readTransaction((tx) =>
    tx.run(readQuery, {
      usernameP: req.username,
    })
  );

  let suggestions = [];
  result.records.map((record) => {
    if (record._fields[0].properties.username != req.username)
      suggestions.push(record._fields[0].properties);
  });

  console.log(suggestions);

  readQuery = "MATCH (u:User{username: $usernameP })-[c1:SendsConnection]->(v:User) RETURN v;";
  result = await session.readTransaction((tx)=>
    tx.run(readQuery, {
      usernameP: req.username,
    }))

  let alreadySentRequest = [];
    result.records.map((record) => {
        alreadySentRequest.push(record._fields[0].properties);
    });

  readQuery = "MATCH (u:User{username: $usernameP})-[c1:Connection]->(v:User)-[c2:Connection]->(w:User) RETURN w"
  result = await session.readTransaction((tx)=>
    tx.run(readQuery, {
      usernameP: req.username,
    }))
  
  result.records.map((record) => {
      alreadySentRequest.push(record._fields[0].properties);
  });

  console.log(alreadySentRequest);
  
  let sug = [];
  for(let j=0; j<suggestions.length; ++j){
    let bool = false;
    for(let i=0; i<alreadySentRequest.length; ++i){
      // console.log(alreadySentRequest[i].username);
      if(alreadySentRequest[i].username === suggestions[j].username){
        bool =true;
      }
    }
    if(!bool){
      sug.push(suggestions[j]);
    }
  }

  // console.log(result);
  res.status(200);

  readQuery = 'MATCH (u:User{username: $usernameP}) RETURN u;';
  result = await session.readTransaction((tx) => 
    tx.run(readQuery, {
      usernameP: req.username,
    })
  );
  
  // console.log(suggestions);
  // console.log(result);
  sug.map((node)=>{
    node.distance = distance(result.records[0]._fields[0].properties.latitude, result.records[0]._fields[0].properties.longitude,
      node.latitude, node.longitude);
  })
  
  sug.sort((a,b)=>{
      return a.distance > b.distance? 1: a.distance===b.distance?0:-1; 
  })
  console.log(sug);


  res.send(sug);
  session.close();
});

function distance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;    // Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p)/2 + 
			c(lat1 * p) * c(lat2 * p) * 
			(1 - c((lon2 - lon1) * p))/2;
  
	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

app.get("/close", (req, res) => {
  driver.close();
});

app.listen(PORT, () => {
  console.log("app listening at port " + PORT);
});
