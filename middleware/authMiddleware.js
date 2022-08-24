const  jwt = require('jsonwebtoken')
const  config = require('config')
const db = require("../config/db.config")


exports.bindUserWithRequest = () =>{
    
    return async (req,res,next) =>{
        
        if(!req.session.isLoggedIn){
            return next()
        }

        try{
            let user
            jwt.verify(req.session.token, process.env.JWT_SECRET_KEY, function(err, decoded) {
                db.query("select * from users where id=?",[decoded.id],(e,data)=>{
                    if(e){
                        next()
                    }
                    else if(data.length > 0){
                        user = data[0]
                        req.user = user
                        next()
                    }
                })
            });
           
        }catch(e){
            console.log(e)
            next(e)
        }

    }
}


exports.isAuthenticated = (req,res,next) =>{
    
    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login')
    }
    next()
}

exports.isVerified = (req,res,next) =>{
    if(req.session.user.verfication_id == 0){
        return res.redirect('/auth/verify')
    }
    next()
}

exports.isUnAuthenticated = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/')
    }

    next()
}

exports.checkAdmin = async(req,res,next) => {
    
    if(req.user != undefined){
        try{
            db.query("select * from users where id=? LIMIT 1",[req.user.id],(e,user)=>{
                if(user.length >0){
                    if(user[0].userType === "admin"){
                        return next()
                    }else{
                        res.send("you are not admin")
                    }
                }
            })
            
            
        }catch(e){
            console.log(e)
            next(e)
        }
    }
}