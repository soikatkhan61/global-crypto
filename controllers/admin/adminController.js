const User = require("../../models/User")
const Package = require('../../models/Package')
exports.adminDashboardGetController =async (req,res,next) =>{
    try {
        res.render("admin/dashboard",)
    } catch (error) {
        next(error)
    }
   
}

exports.packageAnalysticGetController =async (req,res,next) =>{
    try {
        let pkg = await Package.find()
        res.render("admin/pages/package/analystic",{pkg})
    } catch (error) {
        next(error)
    }
   
}