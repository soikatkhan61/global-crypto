const db = require("../../config/db.config");

exports.profileGetController = async (req, res, next) => {
    try {
        let username = req.params.username
        db.query("select id,username,email,createdAt from users where username = ? LIMIT 1;",[username], (e, data) => {
            if (e) {
              next(e);
            }else{
               
                if(data){
                    if(data.length>0){
                        db.query("SELECT count(user_id) as total_member from mlm WHERE ref_by_id = ?",[data[0].id],(e,countMember)=>{
                            if(e){
                                return next(e)
                            }else{
                                return res.render("pages/profile",{title:`${username} profile`,flashMessage:"",profileInfo:data,countMember}) 
                            }
                        })
                    }else{
                        return res.render("pages/profile",{title:`${username} profile`,flashMessage:"",profileInfo:data,countMember:''}) 
                    }
                  
                }
            }
          });
    } catch (error) {
        next(error)
    }
};