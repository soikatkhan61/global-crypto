const authRoute = require("./auth")
const mvc = require("./mvc")
const pg = require("./pg")

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
        path: "/pg",
        handler: pg
    },
    {
        path: "/",
        handler: (req,res)=>{
            res.render("pages/home",{flashMessage:""});
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