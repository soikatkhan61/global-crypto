const User = require('../../models/User')
const Task = require('../../models/Task')
const moment = require('moment')


exports.packageGetController =async (req,res,next) =>{
    res.render("pages/package")
}

exports.packageBuyPostController =async (req,res,next) =>{

    res.render("pages/package")
   
}


exports.dashboardGetController = async (req,res,next) =>{
    res.render("user/dashboard",{title: "Dashboard", userProfile:""})
}

