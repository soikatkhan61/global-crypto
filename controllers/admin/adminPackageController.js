const User = require('../../models/User')
const Task = require('../../models/Task')
const Package = require('../../models/Package')
const moment = require('moment')


exports.adminPackageGetController =async (req,res,next) =>{
    let pkg = await Package.find()
    res.render("admin/pages/package/package",{pkg})
}

exports.packageEditGetController =async (req,res,next) =>{
    try {
        let package_name = req.query.package

        let pkg = await Package.findOne({package_name})
        let pkgs = await Package.find()

        if(!pkg || !pkgs){
            return res.render("pages/error/500",{flashMessage:""})
        }
        res.render("admin/pages/package/edit-package",{pkg,pkgs})
    } catch (error) {
        next(error)
    }
}

exports.packageEditPostController =async (req,res,next) =>{
    try {
       
        let {package_name,price,package_comission} = req.body
        console.log(package_name)
        try {
            let pkg = await Package.findOne({package_name})
            console.log(pkg)
            if(!pkg){
                return res.render("pages/error/500",{flashMessage:""})
            }

            await Package.findOneAndUpdate({package_name:package_name.trim()},{$set:{package_name,price,package_comission}})
            res.redirect("/admin/packages")
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
}


exports.dashboardGetController = async (req,res,next) =>{
    res.render("user/dashboard",{title: "Dashboard", userProfile:""})
}

