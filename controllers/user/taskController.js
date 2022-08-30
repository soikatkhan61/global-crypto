const User = require("../../models/User");
const Task = require("../../models/Task");
const moment = require("moment");
const db = require("../../config/db.config");

exports.taskGetController = async (req, res, next) => {
  try {
    db.query(
      `SELECT users.balance,users.id as userId, task.*
      FROM users 
      JOIN task 
      ON task.user_id =users.id where task.user_id=?`,
      [req.user.id],
      (e, task) => {
        if (e) {
          return next(e);
        } else {
          if (task.length>0) {
            let hours = moment().diff(moment(task[0].updatedAt), "hours");
            console.log(hours);
            if (parseInt(hours) >= 24) {
              db.query(
                "update task set remain_task = 10, todays_comission = 0,yesterday = ?,updatedAt=? where user_id=?",
                [task[0].todays_comission,new Date,req.user.id],
                (e, data) => {
                  if (e) {
                    return next(e);
                  }
                }
              );
            }
          }
          res.render("pages/task", { flashMessage: "", task:task });
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.createTaskController = async (req, res, next) => {
  try {
    db.query("select * from task where user_id = ?",[req.user.id],(e,data)=>{
      if(e){
        return next(e)
      }else{
        if(data.length==0){
          db.query("insert into task values(?,?,?,?,?,?,?,?);",[null,req.user.id,2,10,0,0,null,null],(e,data)=>{
            if(e){
              return next(e)
            }else{
              if(data.insertId){
                return res.redirect('/task')
              }
            }
          })
        }else{
          return res.redirect("/task")
        }
      }
    })
  } catch (e) {
    next(e);
  }
};

exports.taskPostController = async (req, res, next) => {
  function percentage(percentage, totalValue) {
    percentage = parseFloat(percentage)/10
		return parseFloat((percentage/ 100) * parseFloat(totalValue));
	}
  try {
    db.query("select * from task where user_id = ?",[req.user.id],(e,data)=>{
      if(e){
        return next(e)
      }else{
        if(data.length > 0 && data[0].remain_task > 0){
          db.query(`select pkg_subscriber.user_id,pkg_subscriber.approval_status,packages.package_comission,users.balance,users.pending_balance from pkg_subscriber
          join packages on pkg_subscriber.pkg_id = packages.id
          join users on  users.id = pkg_subscriber.user_id
          WHERE pkg_subscriber.user_id = ? and pkg_subscriber.approval_status = 1  limit 1`,[req.user.id],(e,pkg_data)=>{
            if(e){
              return next(e)
            }else{
              if(pkg_data.length == 0){
                console.log("pkg kena nai")
                let commission = percentage(2.0,req.user.pending_balance)
                console.log(commission)
                db.query("update task set remain_task = remain_task -1, todays_comission = todays_comission + ?, updatedAt=? where user_id = ?",[commission,new Date,req.user.id],(e,data)=>{
                  if(e){
                    return next(e)
                  }else{
                    db.query("update users set balance = balance + ? where id=?",[commission,req.user.id],(e,updataBalance)=>{
                      if(e){
                        return next(e)
                      }else{
                        return res.redirect("/task");
                      }
                    })
                  }
                })
              }else{
                console.log("pkg kena ache")
                let commission = percentage(pkg_data[0].package_comission,pkg_data[0].balance)
                db.query("update task set remain_task = remain_task -1, todays_comission = todays_comission + ?, updatedAt=? where user_id = ?",[commission,new Date,req.user.id],(e,data)=>{
                  if(e){
                    return next(e)
                  }else{
                    db.query("update users set balance = balance + ? where id=?",[commission,req.user.id],(e,updataBalance)=>{
                      if(e){
                        return next(e)
                      }else{
                        return res.redirect("/task");
                      }
                    })
                  }
                })
              }
              
            }
          })
        }else{
          return res.redirect("/task");
        }
      }
    })
    
  } catch (error) {
    next(error);
  }
};

exports.dashboardGetController = async (req, res, next) => {
  res.render("user/dashboard", { title: "Dashboard", userProfile: "" });
};
