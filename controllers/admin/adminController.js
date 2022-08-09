const User = require("../../models/User")

exports.adminDashboardGetController =async (req,res,next) =>{
    try {
        let userProfile = await User.findById({_id:req.user._id})
        res.render("admin/dashboard",{userProfile})
    } catch (error) {
        next(error)
    }
   
}

exports.packageGetController =async (req,res,next) =>{
    res.render("pages/about")
}