const express = require("express")
const mongoose = require("mongoose")


//import code
const {homePageGetController} = require("./controllers/myController")

//import middleware
const setMiddleware = require("./middleware/middleware")
//import route
const setRoutes = require("./routes/routes")

//mongodb+srv://admin:admin@cluster0.ljfyxtq.mongodb.net/test
let MONGODB_URI
if(true){
 MONGODB_URI =`mongodb+srv://admin:admin@cluster0.ljfyxtq.mongodb.net/test`
}else{
 MONGODB_URI = "mongodb://localhost:27017"
}

const app = express()

//setup view engine
app.set('view engine' ,'ejs')
app.set('views','views')

//set the middleware from middleware directory
setMiddleware(app)

//set the routes from routes directory
setRoutes(app)



//create server
const PORT = process.env.PORT || 3000
mongoose.connect(MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("DATABASE CONNECTED")
    app.listen(PORT,()=>{
        console.log("SERVER IS RUNINNG ON PORT "+PORT)
    })
})
.catch(e =>{
    return console.log(e)
})