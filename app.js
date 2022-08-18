require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
require('./config/db.config')

//import code
const {homePageGetController} = require("./controllers/myController")

//import middleware
const setMiddleware = require("./middleware/middleware")
//import route
const setRoutes = require("./routes/routes")

//mongodb+srv://admin:admin@cluster0.ljfyxtq.mongodb.net/test
let MONGODB_URI
if(true){
 MONGODB_URI =`mongodb+srv://treader:admin@cluster0.gneuxuc.mongodb.net/treaders_bd`
}else{
 MONGODB_URI = "mongodb://localhost:27017"
}

const app = express()

//setup view engine
app.set('view engine' ,'ejs')
app.set('views','views')
app.use(express.static(path.join(__dirname, 'public')));

//set the middleware from middleware directory
setMiddleware(app)

//set the routes from routes directory
setRoutes(app)


app.use((req,res,next) =>{
    let error = new Error("404 page not found")
    error.status = 404

    next(error)
})

app.use((error,req,res,next) =>{
    if(error.status == 404){
        return res.render("pages/error/404" ,{title: "Page not found",flashMessage:""})
    }
    console.log(error)
    res.render("pages/error/500",{title: "Internel server errors found",flashMessage:"" })
})




//create server
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("SERVER IS RUNINNG ON PORT "+PORT)
})

