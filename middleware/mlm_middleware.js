const db = require("../config/db.config")

exports.isRef = async(req,res,next) => {
    if(req.user != undefined){
        try{
            db.query("select * from mlm where user_id=? and isRef=1 LIMIT 1",[req.user.id],(e,isRefered)=>{
               if(e){
                 return next(e)
               }else{
                if(isRefered.length >0){
                    next()  
                }else{
                    return res.redirect("/user/get-refered")
                }
               }
            })
        }catch(e){
            console.log(e)
            next(e)
        }
    }
}