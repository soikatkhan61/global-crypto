const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "873050750632-17hqhok367sbk53lemik57e2m241ovmc.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//049CiXWOjG8C6CgYIARAAGAQSNwF-L9IrKHVyCBR4RrXwav1M7UVLz2NgMG_baNiD7--cuRQWtKzNzPzATsKcP0tuH8fdaGQwsAQ";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.signUpGetController = (req, res, next) => {
  res.render("pages/auth/register", {
    title: "Create a new account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.signUpPostController = async (req, res, next) => {
  let { username, email, password, c_password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);
  console.log(errors);

  if (!errors.isEmpty()) {
    console.log("error khaicho ");
    req.flash("fail", "Please check your form");
    return res.render("pages/auth/auth", {
      title: "Create a new account",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      signup_mode: true,
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let hashPassword = await bcrypt.hash(password, 11);

    db.query(
      "insert into users values(?,?,?,?,?,?,?,?,?,?,?)",
      [
        null,
        "user",
        username,
        email,
        hashPassword,
        0,
        -1,
        "/uploads/avater.jpg",
        0,
        5,
        null,
      ],
      (e, user) => {
        if (e) {
          next(e);
        } else {
          req.flash("success", "User created successfully");
          if (user.insertId) {
            console.log(user);
            res.render("pages/auth/verify", {
              title: "Verify your account",
              email,
              flashMessage: Flash.getMessage(req),
            });
          } else {
            res.status(404).send("Failed to create user!");
          }
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", {
    title: "Login here",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");
    return res.render("pages/auth/login", {
      title: "Login here!",
      error: errors.mapped(),
      value: {
        email,
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    db.query(
      "select * from users where email=? LIMIT 1",
      [email],
      async (e, data) => {
        if (e) {
          next(e);
        }
        if (data.length == 0) {
          req.flash("fail", "Wrong Credential");
          return res.render("pages/auth/login", {
            title: "Login here!",
            error: errors.mapped(),
            value: {
              email,
            },
            flashMessage: Flash.getMessage(req),
          });
        } else if (data.length > 0) {
          bcrypt.compare(password, data[0].password, function (err, match) {
            if (err) throw new Error(err);
            else if (match == false) {
              req.flash("fail", "Wrong Credential");
              return res.render("pages/auth/login", {
                title: "Login here!",
                error: errors.mapped(),
                value: {
                  email,
                },
                flashMessage: Flash.getMessage(req),
              });
            } else {
              if (data[0].isVerified === 0) {
                return res.render("pages/auth/verify", {
                  flashMessage: "",
                  email: data[0].email,
                });
              }
              let token = jwt.sign(
                {
                  id: data[0].id,
                  username: data[0].username,
                  email: data[0].email,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "30d" }
              );

              req.session.isLoggedIn = true;
              req.session.token = token;
              req.session.user = data[0];

              req.session.save((err) => {
                if (err) {
                  return next(err);
                }
                req.flash("success", "Successfully Logged In");
                if (data[0].userType == "admin") {
                  return res.redirect("/admin");
                }
                res.redirect("/user/dashboard");
              });
            }
          });
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.verifyGetController = async (req, res, next) => {
  res.render("pages/auth/verify", { flashMessage: "" });
};

exports.sendVerifyCode = async (req, res, next) => {
  let v_id = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
  async function sendMail(email) {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "dev.soikathossain@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      let v_idd = v_id.toString().split("").join(" ");
      const mailOptions = {
        from: "<dev.soikathossain@gmail.com>",
        to: `${email}`,
        subject: "Thank You for Sing up! Just do one step more!",
        html: `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                  
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Thank You For Sign Up!</h1>
                                              <h3>Just One Step More!</h3>
                                         
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                   Thanks again for joining us, we are very happy to see that you become a family member from now. Its really appreciatable. Just do one thing to go on.
                                                </p>
                                                <a href="javascript:void(0);"
                                                    style="background:blue;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">C O D E : ${v_idd}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                   
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>
                    `,
      };

      await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          next(e);
        } else {
          db.query(
            "update users set verfication_id= ? where email=?",
            [v_id, email],
            (e, data) => {
              if (e) {
                next(e);
              } else {
                console.log("i am here 454");
                if (data.changedRows == 1) {
                  req.flash("success", "Email Sent Successfully");
                  if (req.query.forgot == "true") {
                    res.render("pages/auth/forgot-verify", {
                      flashMessage: Flash.getMessage(req),
                      email,
                    });
                  } else {
                    res.render("pages/auth/verify-code", {
                      flashMessage: Flash.getMessage(req),
                      email,
                    });
                  }
                } else {
                  res.status(
                    "Failed to to set verify code ! try to resend the code!"
                  );
                }
              }
            }
          );
        }
      });
    } catch (e) {
      next(e);
    }
  }

  let email = req.params.email;
  console.log(email);
  sendMail(email)
    .then((result) => console.log("Email sent:..." + result))
    .catch((error) => console.log(error));
};

exports.verifyController = async (req, res, next) => {
  let userEmail = req.body.email;
  let verify_id = req.body.verify_id;
console.log(userEmail,verify_id)
  if (verify_id < 1) {
    return res.sendStatus(500);
  }

  try {
    db.query(
      "select * from users where email=? and verfication_id=? LIMIT 1",
      [userEmail, verify_id],
      (e, user) => {
        if (e) {
          next(e);
        } else {
          if (user.length > 0) {
            db.query(
              "update users set verfication_id='-1', isVerified=1 where email = ?",
              [userEmail],
              (e, data) => {
                if (e) {
                  next(e);
                } else {
                  if(req.query.forgot === 'true'){
                    req.flash('success','Verification succesfull!')
                    return res.render("pages/auth/new-password",{flashMessage:Flash.getMessage(req),email:userEmail})
                  }
                  let token = jwt.sign(
                    {
                      id: user[0].id,
                      username: user[0].username,
                      email: user[0].email,
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "30d" }
                  );

                  req.session.isLoggedIn = true;
                  req.session.token = token;
                  req.session.user = user[0];
                  req.session.save((err) => {
                    if (err) {
                      return next(err);
                    }
                    res.redirect("/user/dashboard");
                  });
                }
              }
            );
          } else {
            res.status(404).send("Invalid verification code! try again! ");
          }
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.changePasswordGetController = async (req, res, next) => {
  res.render("user/pages/change_password", {
    title: "Change Password",
    error: "",
    notMatched: false,
  });
};

exports.changePasswordPostController = async (req, res, next) => {
  let { old_password, new_password1, new_password2 } = req.body;
  console.log(req.body);

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("user/pages/change_password", {
      title: "Change Password",
      error: errors.mapped(),
      notMatched: false,
    });
  }

  try {
    if (new_password2 !== new_password1) {
      return res.render("user/pages/change_password", {
        title: "Change Password",
        error: errors.mapped(),
        notMatched: "New Password and Confirm password is not matched",
      });
    }
    let hashPassword = await bcrypt.hash(new_password1, 11);
    bcrypt.compare(old_password, req.user.password, function (err, match) {
      if (err) {
        return next(err);
      } else if (match === false) {
        console.log("i am here");
        return res.render("user/pages/change_password", {
          title: "Change Password",
          error: errors.mapped(),
          notMatched: "Old password is not valid",
        });
      } else {
        db.query(
          "update users set password = ? where id=?",
          [hashPassword, req.user.id],
          (e, data) => {
            if (e) {
              return next(e);
            } else {
              if (data.changedRows == 1) {
                req.flash("success", "Password Changed Succefully,Login Now!");
                req.session.destroy((err) => {
                  if (err) {
                    return next(err);
                  }
                  res.clearCookie("token");
                  res.redirect("/auth/login");
                  res.end();
                });
              } else {
                res
                  .status(200)
                  .send(
                    "Something went wrong, try again with valid information!"
                  );
              }
            }
          }
        );
      }
    });
  } catch (error) {
    next(e);
  }
};

exports.renderForgotPassword = async (req, res, next) => {
  res.render("pages/auth/forgot", {
    title: "Change Password",
    flashMessage: "",
    error: "",
    notMatched: false,
  });
};

exports.forgotPasswordPostController = async (req, res, next) => {
  try {
    let { email } = req.body;
    db.query("select email from users where email = ?", [email], (e, data) => {
      if (e) {
        return next(e);
      } else {
        if (data.length > 0) {
          res.render("pages/auth/forgot-verify", {
            flashMessage: "",
            email: data[0].email,
          });
        } else {
          res.status(404).send("No account registered with this email!");
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.setNewPassword = async (req, res, next) => {
  try {
    let password = req.body.password
    let email = req.body.email
    
    let hashPassword = await bcrypt.hash(password, 11);
    db.query("update users set password= ? where email = ?",[hashPassword,email],(e,data)=>{
      if(e){
        return next(e)
      }else{
        if(data.changedRows){
          req.flash('success','New password set successfull')
          res.redirect("/auth/login")
        }else{
          res.status(500).send('Failed to change your password')
        }
      }
    })
  } catch (error) {
    next(error);
  }
};


exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("token");
    res.redirect("/auth/login");
    res.end();
  });
};
