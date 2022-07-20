exports.homePageGetController = (req,res,next) =>{
    res.render("pages/auth", {signupMode:false,msg:"Invalid Credential!"})
}

exports.aboutPageGetController = (req,res,next) =>{
    res.render("pages/about")
}