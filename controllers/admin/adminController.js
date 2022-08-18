const User = require("../../models/User")
const Package = require('../../models/Package')
const db = require("../../config/db.config")
exports.adminDashboardGetController =async (req,res,next) =>{
    try {
        res.render("admin/dashboard",)
    } catch (error) {
        next(error)
    }
   
}

exports.packageAnalysticGetController =async (req,res,next) =>{
    try {
        db.query("select * from packages",(e,data)=>{
            if(e){
                next(e)
            }
            console.log(data)
            if(data){
                res.render("admin/pages/package/analystic",{pkg:data})
            }else{
                res.status(200).send("no data found")
            }
        })
    } catch (error) {
        next(error)
    }
   
}