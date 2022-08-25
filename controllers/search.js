const db = require("../config/db.config")
exports.searchResult = (req,res,next) =>{
    let username = req.query.username
    console.log(username)
    db.query("select username,createdAt from users where username like ? LIMIT 20",[ `${"%" + username + "%"}`],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data){
                res.render("pages/search",{flashMessage:'',searchData:data})
            }
        }
    })
}