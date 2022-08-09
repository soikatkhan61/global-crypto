const User = require('../../models/User')
const Task = require('../../models/Task')
const moment = require('moment')


exports.adminPackageGetController =async (req,res,next) =>{
    let userProfile = await User.findById({_id:req.user._id})
    res.render("admin/pages/package/package",{userProfile})
}

exports.packageEditPostController =async (req,res,next) =>{
    let userProfile = await User.findById({_id:req.user._id})
    res.render("admin/pages/package/edit-package",{userProfile})
   
}


exports.dashboardGetController = async (req,res,next) =>{
    res.render("user/dashboard",{title: "Dashboard", userProfile:""})
}

