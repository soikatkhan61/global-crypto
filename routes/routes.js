const authRoute = require("./auth")
const mvc = require("./mvc")

const routes = [

    {
        path: "/auth",
        handler: authRoute
    },
    {
        path: "/mvc",
        handler: mvc
    },
    {
        path: "/",
        handler: (req,res)=>{
            res.send("i am main home page")
        }
    }
]


module.exports = app =>{
    routes.forEach(r =>{
        if(r.path === '/'){
            app.get('/',r.handler)
        }else{
            app.use(r.path, r.handler)
        }
    })
}