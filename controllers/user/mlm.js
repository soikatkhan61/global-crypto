const User = require('../../models/User')
const db = require("../../config/db.config")

exports.getReferGetController =async (req,res,next) =>{
   try {
    db.query("select username,email,mlm.* ,mlm.id as mlm_id from users join mlm on mlm.refBy = users.username where mlm.user_id=?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            return res.render("user/pages/get_refered",{title:"Get Refered",userProfile:data,customError:""})
        }
    })
   } catch (error) {
        next(error)
   }
}

exports.getReferPostController =async (req,res,next) =>{
   let {refer_name} = req.body
   refer_name = refer_name.trim()
   try {
    db.query("select username,email,mlm.* ,mlm.id as mlm_id from users join mlm on mlm.refBy = users.username where mlm.user_id=?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data.length>0){
                if(data[0].user_id  ||  refer_name === req.user.username){
                    return  res.render("user/pages/get_refered",{title:"Get Refered",userProfile:data[0],customError:"You cant refer yourself"})
                }
            }else{

                db.query("select * from users where username=?",[refer_name],(e,findRefer)=>{
                    if(e){
                        return next(e)
                    }else{
                        if(findRefer.length>0){
                            db.query("insert into mlm values(?,?,?,?,?,?)",[null,req.user.id,1,refer_name,null,null],(e,data)=>{
                                if(e){
                                    return next
                                }else{
                                    res.redirect("/user/get-refered")
                                }
                            })
                        }else{
                            return res.status(404).send("Refer Name is incorrect or may he/she deleted him/her account")
                        }
                    }
                })
            }
        }
    })

   } catch (error) {
    next(error)
   }

   
}


exports.dashboardGetController = async (req,res,next) =>{
    res.render("user/dashboard",{title: "Dashboard", userProfile:""})
}

