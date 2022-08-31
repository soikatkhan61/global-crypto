const db = require("../../config/db.config")
exports.dashboardGetController = async (req, res, next) => {
    try {
        db.query("select users.username, user_id,ref_by_id ,mlm.createdAt from mlm join users on users.id = mlm.user_id where ref_by_id = ? ORDER by mlm.id DESC",[req.user.id],(e,data)=>{
            if(e){
                next(e)
            }else{
                if(data){
                    res.render("user/dashboard", { title: "Dashboard", userProfile: "",recentUser:data });
                }else{
                    res.render("user/dashboard", { title: "Dashboard", userProfile: "",recentUser:'' });
                }
            }
        })
    } catch (error) {
        next(e)
    }
   
  };

  exports.renderUserSearch = async(req,res,next) =>{
    res.render("user/pages/search-user",{title:'Search User'})
  }
  