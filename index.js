const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());


app.get("/", (req, res)=>{
    res.send("Hello world");
})

app.post("/login", (req, res)=>{
    let userName = req.body.userName;
    let password = req.body.password;
})

app.listen(PORT, ()=>{
    console.log("app listening at port " + PORT);
})