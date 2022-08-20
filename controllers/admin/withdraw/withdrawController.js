const db = require("../../../config/db.config")

exports.renderWithdrawRequest = (req,res,next) =>{
    db.query("select users.username,users.email,withdraw.* from withdraw join users on withdraw.user_id = users.id where statuss='pending';",(e,data)=>{
        if(e){
            return next(e)
        }else{
            res.render("admin/pages/withdraw/withdraw-request",{title:"Withdraw Request",history:data})
        }
    })    
}

exports.withdrawApproveController = (req,res,next) =>{
    
    let id = req.params.id
    db.query("select * from withdraw where id =? and statuss='pending'",[id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            console.log(data.length)
            if(data.length>0){
                db.query("update withdraw set statuss='paid' where id=?",[id],(e,data)=>{
                    if(e){
                        return next(e)
                    }else{
                        res.redirect("/admin/withdraw-request")
                    }
                })
            }else{
                res.status(404).send("Request already approve or invalid withdraw request")
            }
           
        }
    })   
}

