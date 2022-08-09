const User = require("../models/User")

exports.pg =async (req,res,next) =>{
    res.render("pages/invoice",{flashMessage:"",order:""})
}
