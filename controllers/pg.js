exports.pg = (req,res,next) =>{
    res.render("pages/auth/verify",{flashMessage:""})
}
