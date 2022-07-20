
exports.signUpGetController = (req,res,next) =>{
    res.render("pages/auth", {signupMode:true,msg:""})
}

exports.loginGetController = (req,res,next) =>{
    res.render("pages/auth", {signupMode:false,msg:""})
}