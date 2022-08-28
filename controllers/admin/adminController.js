const User = require("../../models/User")
const Package = require('../../models/Package')
const db = require("../../config/db.config")
exports.adminDashboardGetController =async (req,res,next) =>{

    try {
        db.query("select username,email,createdAt,isVerified from users ORDER by id DESC limit 5;select * from packages;select count(id) as totalUser from users;select count(approval_status) as totalPkgSell from pkg_subscriber where approval_status=1",(e,data)=>{
            if(e){
                return next(e)
            }else{
                res.render("admin/dashboard",{recentUser:data[0],pkg:data[1],totalUser:data[2],totalPkgSell:data[3]})
            }
        })
        
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