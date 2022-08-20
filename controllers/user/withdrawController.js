const db = require("../../config/db.config")

exports.renderWithdraw = (req,res,next) =>{
    db.query("select balance from users where id = ?",[req.user.id],(e,data)=>{
        if(e){
            return next(e)
        }else{
            if(data.length > 0){
                res.render("user/pages/withdraw",{title:"Withdraw Money",balanceInfo:data[0]})
            }else{
                res.status(404).send("Users not found!")
            }
        }
    })   
}

exports.withdrawPostController = (req,res,next) =>{
    let {amount,payment_number,payment_method} = req.body
    
    db.query("insert into withdraw values (?,?,?,?,?,?,?,?)",[null,req.user.id,amount,payment_method,payment_number,"pending",null,null],(e,data)=>{
        if(e){
            return next(e)
        }else{
            console.log("withdraw reqested is complete")
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