//import the modules
//require() function is used to import the modules

const express = require("express")
const mongodb = require('mongodb')
const cors = require("cors")
const jwt = require("jwt-simple")

//create the rest object
let app = express()

//enable the cors policy
app.use(cors())

//set the json as MIME Type
app.use(express.json())


//acreate the client object
let ashokit = mongodb.MongoClient;
//where ashokit is the client object

let server_token = "";

//create the post request
app.post("/login",(req,res)=>{
    console.log("name",req.body.email);
    console.log("password",req.body.password)
    //ashokit.connect("mongodb+srv://varun:<varun>@03reactjs9am.dac9c.mongodb.net/miniproject?retryWrites=true&w=majority",(err,connection)=>{
    ashokit.connect("mongodb+srv://admin:admin@cluster0.1w6x8.mongodb.net/miniproject?retryWrites=true&w=majority/",(err,connection)=>{
            if(err) throw err;
        else{
            let db = connection.db("miniproject");
            db.collection("login_details").find({"email":req.body.email,"password":req.body.password}).toArray((err,array)=>{
                console.log("array..",array)
                if(err) throw err;
                else{
                    if(array.length>0){
                        //converting readable data to unreadable data with custom password
                        let token = jwt.encode({"email":req.body.email,"password":req.body.password},"admin@123")
                        server_token = token
                        res.send({"login":"success","token":token})
                    }
                    else{
                        res.send({"login":"failed"})
                    }
                }
            })
        }
    })
})



//compare the reactJS token with NodeJS token
const middleware = (req,res,next) => {
    let allHeaders = req.headers;
    let react_token = allHeaders.token;
    if(react_token === server_token){
        next();
    }
    else{
        res.send({"message":"unauthorized user"})
    }
}

//create the get request
app.get("/products",[middleware],(req,res)=>{

    ashokit.connect("mongodb+srv://admin:admin@cluster0.1w6x8.mongodb.net/miniproject?retryWrites=true&w=majority",(err,connection)=>{
    if(err) throw err
    else{
        let db = connection.db("miniproject");
        db.collection("products").find().toArray((err,array)=>{
            if(err) throw err
            else{
                res.send(array)
            }
        })
    }
    })
    

})


//assign the port number
app.listen(8080,()=>{
    console.log("server listening the port no : 8080")
})