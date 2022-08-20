
const moment = require("moment");
const db = require("../../config/db.config");

exports.adminPackageGetController = async (req, res, next) => {
  
    db.query("select * from packages",(e,data)=>{
        if(e){
            next(e)
        }
        if(data){
            res.render("admin/pages/package/package", { pkg:data });
        }else{
            res.status(404).send("no data found")
        }
    })
};

exports.packageEditGetController = async (req, res, next) => {
  try {
    let package_name = req.query.package;
    console.log(package_name)
    db.query(
      "select * from packages where package_name=?;select * from packages",
      [package_name],
      (e, data) => {
        if (e) {
          next(e);
        }
        if (!data[0] && !data[1]) {
          return res.render("pages/error/500", { flashMessage: "" });
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
        }
        if (!data) {
          return res.render("pages/error/404", { flashMessage: "" });
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
    );
  } catch (error) {
    next(error);
  }
};

exports.dashboardGetController = async (req, res, next) => {
  res.render("user/dashboard", { title: "Dashboard", userProfile: "" });
};
exports.pkgApproveGet = async (req, res, next) => {
  try {
    db.query(`SELECT
    users.id as userID, users.username, users.email, packages.package_name, packages.price, packages.package_comission,pkg_payment.id as  pkg_payment_id,pkg_payment.payment_method,pkg_payment.createdAt,pkg_subscriber.approval_status,pkg_payment.payment_number,pkg_payment.transaction_number
  FROM packages
  
  JOIN pkg_payment
    ON packages.id = pkg_payment.pkg_id 

  JOIN users
    ON pkg_payment.user_id = users.id
    
   JOIN pkg_subscriber
    ON pkg_subscriber.user_id = pkg_payment.user_id
    where pkg_subscriber.approval_status = 0
     LIMIT 20`,(e,data)=>{
      if(e){
        next(e)
      }else{
        console.log(data)
        if(data){
          res.render("admin/pages/package/pkg_buy_req", { title: "Pakcage Request",pkg:data});
        }
      }
    })
   
  } catch (error) {
    next(e)
  }
  
};

exports.pkgApprovPostConrtoller = async(req,res,next)=>{
  let payment_id = req.params.payment_id
  try {
    db.query("select * from pkg_payment where id= ? LIMIT 1",[payment_id],(e,data)=>{
      if(e){
        next(e)
      }else{
        if(data.length>0){
          db.query("update pkg_subscriber set approval_status=1 where id=? LIMIT 1",[data[0].pkg_sub_id],(e,data)=>{
            if(e){
              return next(e)
            }else{
              return res.redirect("/admin/packages/approve")
            }
          })
        }else{
          res.status(404).send("Requested package payment info cannot found!")
        }
      }
    })
  } catch (error) {
    next(e)
  }
}