const User = require('../models/User')
const  jwt = require('jsonwebtoken')
const  config = require('config')

exports.bindUserWithRequest = () =>{
    return async (req,res,next) =>{
        if(!req.session.isLoggedIn){
            return next()
        }

        try{
            let user = await User.findById(req.session.user._id)
            req.user = user
            next()
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

exports.isUnAuthenticated = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/')
    }

    next()
}

exports.checkAdmin = async(req,res,next) => {
    
    if(req.user != undefined){
        try{
            let user = await User.findById(req.session.user._id)
            if(user.userType == "admin"){
                return next()
            }else{
                res.send("you are not admin")
            }
            
        }catch(e){
            console.log(e)
            next(e)
        }
    }
}