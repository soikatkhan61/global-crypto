const db = require("../../../config/db.config")

exports.renderWithdrawRequest = (req,res,next) =>{
    try {
        db.query("select users.id,users.username,users.email,withdraw.* from withdraw join users on withdraw.user_id = users.id where statuss='pending';",(e,data)=>{
            if(e){
                return next(e)
            }else{
                res.render("admin/pages/withdraw/withdraw-request",{title:"Withdraw Request",history:data})
            }
        }) 
    } catch (error) {
        next(error)
    }
       
}

exports.renderWithdrawForm = (req,res,next) =>{
    let payment_id = req.query.payment_id
    try {
        db.query("select * from withdraw where id =? and statuss='pending'",[payment_id],(e,data)=>{
            res.render("admin/pages/withdraw/withdrawApprove",{title:"Withdraw Approve",w_req:data})
        })
    } catch (error) {
        next(error)
    }
}
 
exports.withdrawApproveController = (req,res,next) =>{
    let {p_id,tx_id} = req.body
    try {
        db.query("select * from withdraw where id =? and statuss='pending'",[p_id],(e,data)=>{
            if(e){
                return next(e)
            }else{
                console.log(data.length)
                if(data.length>0){
                    db.query("update withdraw set statuss='paid',tx_id=? where id=?",[tx_id,p_id],(e,data)=>{
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
    } catch (error) {
        next(error)
    }
     
}

exports.renderUserWithdrawHistory = (req,res,next) =>{
    let id = req.query.id
    try {
        db.query("select * from withdraw where user_id =?  order by id desc LIMIT 20",[id],(e,data)=>{
            if(e){
                return next(e)
            }else{
                if(data){
                   res.render('admin/pages/withdraw/user-withdraw-history',{data})
                }else{
                    res.status(404).send("No withdraw is complete from this id")
                }
            }
        }) 
    } catch (error) {
        next(error)
    }
     
}

