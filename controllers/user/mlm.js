
const db = require("../../config/db.config")

exports.getReferGetController =async (req,res,next) =>{
   try {
    db.query("select username,email,mlm.* ,mlm.id as mlm_id from users join mlm on mlm.refBy = users.username where mlm.user_id=?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data.length>0){
                db.query(" select count(ref_by_id) as total_member from mlm WHERE ref_by_id = ?",[data[0].ref_by_id],(e,refTotalMember)=>{
                    if(e){
                        return next(e)
                    }else{
                        return res.render("user/pages/get_refered",{title:"Get Refered",userProfile:data,customError:"",total:refTotalMember})
                    }
                })
            }else{
                return res.render("user/pages/get_refered",{title:"Get Refered",userProfile:data,customError:"",total:''})
            }
            
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
                return  res.render("user/pages/get_refered",{title:"Get Refered",userProfile:data[0],customError:"You already referred someone!"})
            }else{
                if(refer_name === req.user.username){
                    return  res.render("user/pages/get_refered",{title:"Get Refered",userProfile:'',customError:"You cant refer yourself"})
                }
                db.query("select id,username from users where username=?",[refer_name],(e,findRefer)=>{
                    if(e){
                        return next(e)
                    }else{
                        if(findRefer.length>0){
                            db.query("insert into mlm values(?,?,?,?,?,?,?)",[null,req.user.id,1,refer_name,findRefer[0].id,null,null],(e,data)=>{
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

exports.renderMyReferLink = (req,res,next) =>{
    res.render("user/pages/my-link",{title:'My refer link'})
}

exports.myMemberGetController = (req,res,next) =>{
    try {
        db.query("select mlm.user_id,mlm.createdAt,users.username,users.email,users.createdAt as userCreatedAt from mlm join users on users.id = mlm.user_id where ref_by_id = ? limit 50" ,[req.user.id],(e,data)=>{
            if(e){
                return next(e)
            }else{
                res.render("user/pages/my-member",{title:'My Member',member:data})
            }
        })
    } catch (error) {
        next(e)
    }
}