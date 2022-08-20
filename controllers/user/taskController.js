const User = require("../../models/User");
const Task = require("../../models/Task");
const moment = require("moment");
const db = require("../../config/db.config");

exports.taskGetController = async (req, res, next) => {
  try {
    db.query(
      `SELECT users.*,users.id as userId, task.*
    FROM users 
    JOIN task 
    ON task.user_id =users.id where task.user_id=?`,
      [req.user.id],
      (e, data) => {
        if (e) {
          return next(e);
        } else {
          if (data.length>0) {
            let hours = moment().diff(moment(data[0].updatedAt), "hours");
            console.log(hours);
            if (parseInt(hours) >= 24) {
              console.log("24 hoice")
              db.query(
                "update task set remain_task = 10 where user_id=?",
                [req.user.id],
                (e, data) => {
                  if (e) {
                    return next(e);
                  }
                }
              );
            }
          }
          res.render("pages/task", { flashMessage: "", task:data });
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.createTaskController = async (req, res, next) => {
  console.log("i am here")
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
  try {
    db.query("select * from task where user_id = ?",[req.user.id],(e,data)=>{
      if(e){
        return next(e)
      }else{
        if(data.length > 0 && data[0].remain_task > 0){
          db.query("update task set remain_task = remain_task -1,updatedAt=? where user_id = ?",[new Date,req.user.id],(e,data)=>{
            if(e){
              return next(e)
            }else{
              return res.redirect("/task");
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
