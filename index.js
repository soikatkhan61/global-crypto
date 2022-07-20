const express = require("express")


//import code
const {homePageGetController} = require("./controllers/myController")

//import route
const setRoutes = require("./routes/routes")

const app = express()

//setup view engine
app.set('view engine' ,'ejs')
app.set('views','views')

//set the routes from routes directory

setRoutes(app)

app.listen(3000,()=>{
    console.log("app listen on port 3000")
})