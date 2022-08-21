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
              console.log("24 hoice")
              db.query(
                "update task set remain_task = 10, todays_comission = 0 where user_id=?",
                [req.user.id],
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
          db.query("insert into task values(?,?,?,?,?,?,?);",[null,req.user.id,2,10,0,null,null],(e,data)=>{
            if(e){
              return next(e)
            }else{
              console.log("data created")
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
		return parseInt(Math.ceil((parseInt(percentage) / 100) * parseInt(totalValue)));
	}
  try {
    db.query("select * from task where user_id = ?",[req.user.id],(e,data)=>{
      if(e){
        return next(e)
      }else{
        if(data.length > 0 && data[0].remain_task > 0){
          db.query(`select pkg_subscriber.user_id,packages.package_comission,users.balance from pkg_subscriber
          join packages on pkg_subscriber.pkg_id = packages.id
          join users on  users.id = pkg_subscriber.user_id
          WHERE pkg_subscriber.user_id = ? limit 1`,[req.user.id],(e,pkg_data)=>{
            if(e){
              return next(e)
            }else{
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
