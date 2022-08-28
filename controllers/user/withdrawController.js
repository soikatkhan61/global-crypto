const db = require("../../config/db.config")

exports.renderWithdraw = (req,res,next) =>{
    db.query("select balance from users where id = ?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data.length > 0){
                res.render("user/pages/withdraw",{title:"Withdraw Money",balanceInfo:data[0],error:false,value:""})
            }else{
                res.status(404).send("Users not found!")
            }
        }
    })   
}

exports.withdrawPostController = (req,res,next) =>{
    let {amount,payment_number,payment_method} = req.body
    db.query("select * from pkg_subscriber where approval_status = 1 and user_id=?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data.length>0){
                db.query("select balance from users where id=?",[req.user.id],(e,data)=>{
                    if(e){
                        return next(e)
                    }else{
                        if(data.length>0){
                            if(amount>data[0].balance){
                                res.render("user/pages/withdraw",{title:"Withdraw Money",balanceInfo:data[0],error:true,value:amount})
                            }else{
                                db.query("update users set balance=balance - ? where id = ?",[amount,req.user.id],(e,data)=>{
                                    if(e){
                                        return next(e)
                                    }else{
                                        if(data.changedRows == 1){
                                            db.query("insert into withdraw values (?,?,?,?,?,?,?,?,?)",[null,req.user.id,amount,payment_method,payment_number,null,"pending",null,null], function(err, results) {
                                                if(err){
                                                    return next(err)
                                                }else{
                                                    return res.redirect("/user/withdraw/history")
                                                }
                                            })
                                        }else{
                                            res.status(500).send("something went wrong")
                                        }
                                    }
                                })
                                
                            }
                        }
                    }
                })
            }else{
                res.status(404).send("You need to buy any package first! then you can able to withdraw money!")
            }
        }
    })
}

exports.renderWithdrawHistory = (req,res,next) =>{
    db.query("select * from withdraw where user_id = ?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            res.render("user/pages/withdraw-history",{title:"Withdraw History",history:data})
        }
    })   
}