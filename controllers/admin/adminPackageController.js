const moment = require("moment");
const db = require("../../config/db.config");

//package CRUD
exports.adminPackageGetController = async (req, res, next) => {
  db.query("select * from packages", (e, data) => {
    if (e) {
      next(e);
    }
    if (data) {
      res.render("admin/pages/package/package", {
        pkg: data,
      });
    } else {
      res.status(404).send("no data found");
    }
  });
};

exports.packageEditGetController = async (req, res, next) => {
  try {
    let package_name = req.query.package;
    console.log(package_name);
    db.query(
      "select * from packages where package_name=?;select * from packages",
      [package_name],
      (e, data) => {
        if (e) {
          next(e);
        }
        if (!data[0] && !data[1]) {
          return res.render("pages/error/500", {
            flashMessage: "",
          });
        } else {
          res.render("admin/pages/package/edit-package", {
            pkg: data[0],
            pkgs: data[1],
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.packageEditPostController = async (req, res, next) => {
  let { package_name, price, package_comission } = req.body;
  console.log(req.body);
  try {
    db.query(
      "select * from packages where package_name=?;",
      [package_name],
      (e, data) => {
        if (e) {
          console.log(e);
          next(e);
        } else {
          if (!data) {
            return res.render("pages/error/404", {
              flashMessage: "",
            });
          } else {
            console.log(data);
            db.query(
              "update packages set price=? , package_comission =? where package_name=?",
              [price, package_comission, package_name],
              (e, data) => {
                if (e) {
                  console.log(e);
                  next(e);
                } else {
                  res.redirect("/admin/packages/analystic");
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

//package request get and accept
exports.pkgApproveGet = async (req, res, next) => {
  try {
    db.query(
      `SELECT
    users.id as userID, users.username, users.email, packages.package_name, packages.price, packages.package_comission,pkg_payment.id as  pkg_payment_id,pkg_payment.payment_method,pkg_payment.createdAt,pkg_subscriber.approval_status,pkg_subscriber.id as pkg_subb_id ,pkg_payment.transaction_number
  FROM packages
  
  JOIN pkg_payment
    ON packages.id = pkg_payment.pkg_id 

  JOIN users
    ON pkg_payment.user_id = users.id
    
   JOIN pkg_subscriber
    ON pkg_subscriber.user_id = pkg_payment.user_id
    where pkg_subscriber.approval_status = 0
     LIMIT 20`,
      (e, data) => {
        if (e) {
          next(e);
        } else {
          if (data) {
            res.render("admin/pages/package/pkg_buy_req", {
              title: "Pakcage Request",
              pkg: data,
            });
          }
        }
      }
    );
  } catch (error) {
    next(e);
  }
};

// exports.pkgApprovPostConrtoller = async (req, res, next) => {
//   //utilities function
//   function percentage(percentage, totalValue) {
//     return parseInt(Math.ceil((percentage / 100) * totalValue));
//   }

//   let payment_id = req.params.payment_id;
//   let ref_id = req.query.ref_id;
//   let pkg_subb_id = req.query.pkg_sub_id;

//   function approve_package_requrest() {
//     db.query(
//       "update pkg_subscriber set approval_status=1 where id=? LIMIT 1",
//       [pkg_subb_id],
//       (e, data) => {
//         if (e) {
//           return false;
//         } else {
//           return res.redirect("/admin/packages/approve");
//         }
//       }
//     );
//   }

//   try {
//     db.query(
//       "select pkg_payment.*,packages.price from packages join pkg_payment on pkg_payment.pkg_id = packages.id where pkg_payment.id= ? LIMIT 1",
//       [payment_id],
//       (e, pkg_payment) => {
//         if (e) {
//           return next(e);
//         } else {
//           if (pkg_payment.length > 0) {
//             //find first level from pkg_payment
//             db.query(
//               "select user_id,ref_by_id from mlm where user_id=?",
//               [pkg_payment[0].user_id],
//               (e, ref_user) => {
//                 if (e) {
//                   return next(e);
//                 } else {
//                   if (ref_user.length > 0) {
//                     console.log("Found 1st level " + ref_user[0].ref_by_id);

//                     let bonus = percentage(parseInt(pkg_payment[0].price), 15);
//                     //give bonus to first level
//                     console.log("Bonus: " + bonus);
//                     db.query(
//                       "update users set balance = balance + ? where id = ?",
//                       [bonus, ref_user[0].ref_by_id],
//                       (e, updateFirstLevel) => {
//                         if (e) {
//                           return next(e);
//                         } else {
//                           console.log(updateFirstLevel);
//                           if (updateFirstLevel.changedRows == 1) {
//                             console.log(
//                               "bonus gived to " +
//                                 ref_user[0].ref_by_id +
//                                 " TK" +
//                                 bonus
//                             );
//                             //find second level
//                             db.query(
//                               "select user_id,ref_by_id from mlm where user_id=?",
//                               [ref_user[0].ref_by_id],
//                               (e, secondRefUser) => {
//                                 if (e) {
//                                   return next(e);
//                                 } else {
//                                   if (secondRefUser.length > 0) {
//                                     console.log(
//                                       "Found second level " +
//                                         secondRefUser[0].ref_by_id
//                                     );

//                                     let bonusSecond = percentage(
//                                       parseInt(pkg_payment[0].price),
//                                       10
//                                     );
//                                     //give bonus to second level
//                                     db.query(
//                                       "update users set balance = balance + ? where id = ?",
//                                       [bonusSecond, secondRefUser[0].ref_by_id],
//                                       (e, updateSecondLevel) => {
//                                         if (e) {
//                                           return next(e);
//                                         } else {
//                                           if (
//                                             updateSecondLevel.changedRows == 1
//                                           ) {
//                                             console.log(
//                                               "bonus gived to " +
//                                                 secondRefUser[0].ref_by_id +
//                                                 " TK" +
//                                                 bonusSecond
//                                             );

//                                             //find third level
//                                             db.query(
//                                               "select user_id,ref_by_id from mlm where user_id=?",
//                                               [secondRefUser[0].ref_by_id],
//                                               (e, thirdUser) => {
//                                                 if (e) {
//                                                   return next(e);
//                                                 } else {
//                                                   if (thirdUser.length > 0) {
//                                                     console.log(
//                                                       "Found third level " +
//                                                         thirdUser[0].ref_by_id
//                                                     );

//                                                     let bonusThird = percentage(
//                                                       parseInt(
//                                                         pkg_payment[0].price
//                                                       ),
//                                                       3
//                                                     );
//                                                     //give bonus to third level

//                                                     db.query(
//                                                       "update users set balance = balance + ? where id = ?",
//                                                       [
//                                                         bonusThird,
//                                                         thirdUser[0].ref_by_id,
//                                                       ],
//                                                       (e, updateThird) => {
//                                                         if (e) {
//                                                         } else {
//                                                           if (
//                                                             updateThird.changedRows ==
//                                                             1
//                                                           ) {
//                                                             console.log(
//                                                               "bonus gived to " +
//                                                                 thirdUser[0]
//                                                                   .ref_by_id +
//                                                                 " TK" +
//                                                                 bonusThird
//                                                             );
//                                                           }
//                                                           approve_package_requrest();
//                                                         }
//                                                       }
//                                                     );
//                                                   } else {
//                                                     console.log(
//                                                       "Not Found third level "
//                                                     );
//                                                     approve_package_requrest();
//                                                   }
//                                                 }
//                                               }
//                                             );
//                                           }
//                                         }
//                                       }
//                                     );
//                                   } else {
//                                     approve_package_requrest();
//                                   }
//                                 }
//                               }
//                             );
//                           } else {
//                             approve_package_requrest();
//                           }
//                         }
//                       }
//                     );
//                   } else {
//                     console.log("Not Found 1st level");
//                     approve_package_requrest();
//                   }
//                 }
//               }
//             );
//           } else {
//             res
//               .status(404)
//               .send("Requested package payment info cannot found!");
//           }
//         }
//       }
//     );
//   } catch (error) {
//     next(e);
//   }
// };

exports.viewUplineGetController = async (req, res, next) => {
  function percentage(percentage, totalValue) {
    return parseInt((percentage / 100) * totalValue);
  }

  let payment_id = req.query.payment_id;

  try {
    db.query(
      "select pkg_payment.user_id,pkg_payment.pkg_sub_id, packages.price,packages.package_name from packages join pkg_payment on pkg_payment.pkg_id = packages.id where pkg_payment.id= ? LIMIT 1",
      [payment_id],
      (e, payment_info) => {
        if (e) {
          return next(e);
        } else {
          if (payment_info.length > 0) {
            db.query("select id,username,balance,isVerified from users where id = ?",[payment_info[0].user_id],(e,pkg_buyer)=>{
              if(e){
                return next(e)
              }else{
                if(pkg_buyer.length>0){
                  //calculate the bonus
                let bonus = {
                  level1: percentage(10,payment_info[0].price),
                  level2: percentage(6,payment_info[0].price),
                  level3: percentage(3,payment_info[0].price),
                  payment_id:req.query.payment_id,
                  pkg_info : payment_info[0],
                  pkg_buyer
                }
                  db.query(
                    "select user_id,ref_by_id,users.id as userID,users.username,users.balance,users.isVerified from mlm join users on mlm.ref_by_id = users.id where user_id=?",
                    [payment_info[0].user_id],
                    (e, level1) => {
                      if (e) {
                        return next(e);
                      } else {
                        if (level1.length > 0) {
                          db.query(
                            "select user_id,ref_by_id,users.id as userID,users.username,users.balance,users.isVerified from mlm join users on mlm.ref_by_id = users.id where user_id=?",
                            [level1[0].ref_by_id],
                            (e, level2) => {
                              if (e) {
                                return next(e);
                              } else {
                                if (level2.length > 0) {
                                  db.query(
                                    "select user_id,ref_by_id,users.id as userID,users.username,users.balance,users.isVerified from mlm join users on mlm.ref_by_id = users.id where user_id=?",
                                    [level2[0].ref_by_id],
                                    (e, level3) => {
                                      if (e) {
                                        return next(e);
                                      } else {
                                        if (level3.length > 0) {
                                          res.render(
                                            "admin/pages/package/view-up-line",
                                            {
                                              level1,
                                              level2,
                                              level3,
                                              bonus
                                            }
                                          );
                                        } else {
                                          res.render(
                                            "admin/pages/package/view-up-line",
                                            {
                                              level1,
                                              level2,
                                              level3: "",
                                              bonus
                                            }
                                          );
                                        }
                                      }
                                    }
                                  );
                                } else {
                                  res.render("admin/pages/package/view-up-line", {
                                    level1,
                                    level2: "",
                                    level3: "",
                                    bonus
                                  });
                                }
                              }
                            }
                          );
                        } else {
                          console.log("No any upline");
                        }
                      }
                    }
                  );
                }else{
                  return res.status(404).send("Package buyer users not found!")
                }
              }
            })   
            console.log(payment_info);
          } else {
            res.status("Requested Payment info is not found!");
          }
        }
      }
    );
  } catch (error) {
    next(e);
  }
};

exports.giveComission = async (req,res,next) =>{
  let user_id = req.query.user_id
  let comission = req.query.comission
  let payment_id = req.query.payment_id
  try {
    db.query("update users set balance = balance + ? where id = ?",[comission,user_id],(e,data)=>{
      if(e){
         return next(e)
      }else{
        res.redirect(`/admin/packages/view-up-line?payment_id=${payment_id}`)
      }
    })
  } catch (error) {
    next(e)
  }
}

exports.backComission = async (req,res,next) =>{
  let user_id = req.query.user_id
  let comission = req.query.comission
  let payment_id = req.query.payment_id
  try {
    db.query("update users set balance = balance - ? where id = ?",[comission,user_id],(e,data)=>{
      if(e){
         return next(e)
      }else{
        res.redirect(`/admin/packages/view-up-line?payment_id=${payment_id}`)
      }
    })
  } catch (error) {
    next(e)
  }
}

exports.pkgApproved = (req,res,next) =>{
  let pkg_sub_id = req.query.pkg_sub_id
  try {
    db.query("select pkg_id,approval_status from pkg_subscriber where id =? limit 1",[pkg_sub_id],(e,data)=>{
      if(e){
        return next(e)
      }else{
        db.query(
          "update pkg_subscriber set approval_status = 1 where id=? LIMIT 1;update packages set total_subscriber = total_subscriber + 1 where id = ? ",
          [pkg_sub_id,data[0].pkg_id],
          (e, data) => {
            if (e) {
              return next(e);
            } else {
              return res.redirect("/admin/packages/approve");
            }
          }
        );
      }
    })
    
  } catch (error) {
    next(error)
  }
}

