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
  res.render("pages/auth/auth", {
    title: "Create a new account",
    error: {},
    value: {},
    signup_mode: true,
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
        null
      ],
      (e, user) => {
        if (e) {
          next(e)
        } else {
          req.flash("success", "User created successfully");
          if(user.insertId){
            console.log(user)
            res.render("pages/auth/verify", {
              title: "Verify your account",
              email,
              flashMessage: Flash.getMessage(req),
            });
          }else{
            res.status(404).send("Failed to create user!")
          }
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/auth", {
    title: "Login here",
    error: {},
    value: {},
    signup_mode: false,
    flashMessage: Flash.getMessage(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please check your form");
    return res.render("pages/auth/auth", {
      title: "Login here!",
      error: errors.mapped(),
      signup_mode: false,
      value: {
        email,
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    db.query("select * from users where email=? LIMIT 1", [email], async (e, data) => {
      if (e) {
        next(e)
      }
      if (data.length == 0) {
        req.flash("fail", "Wrong Credential");
        return res.render("pages/auth/auth", {
          title: "Login here!",
          error: errors.mapped(),
          signup_mode: false,
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
            return res.render("pages/auth/auth", {
              title: "Login here!",
              error: errors.mapped(),
              signup_mode: false,
              value: {
                email,
              },
              flashMessage: Flash.getMessage(req),
            });
          } else {
            if (data[0].isVerified === 0) {
              return res.render("pages/auth/verify",{flashMessage:"",email:data[0].email});
            }
            let token =  jwt.sign({
              id:data[0].id,
              username:data[0].username,
              email:data[0].email
            },process.env.JWT_SECRET_KEY,{expiresIn:'30d'})

            req.session.isLoggedIn = true;
            req.session.token = token;
            req.session.user = data[0];

            req.session.save((err) => {
              if (err) {
                return next(err);
              }
              req.flash("success", "Successfully Logged In");
              if(data[0].userType == "admin"){
                return res.redirect("/admin");
              }
              res.redirect("/user/dashboard");
            });
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

exports.verifyGetController = async(req,res,next) =>{
    res.render("pages/auth/verify",{flashMessage:""})
}

exports.sendVerifyCode = async(req,res,next) =>{

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
  
      const mailOptions = {
        from: "codeDocz <dev.soikathossain@gmail.com>",
        to: `${email}`,
        subject: "Please verify your account!",
        html: `
                        <div>
                            <p>your verification code is:  
                            </p>
                            <h1> ${v_id} </h1>
                        </div>
                    `,
      };
  
      await transport.sendMail(mailOptions, function (error, info) {
        console.log("i am here 545")
        if (error) {
          next(e)
        } else {
          db.query("update users set verfication_id= ? where email=?",[v_id,email],(e,data)=>{
            if(e){
              next(e)
            }else{
              console.log("i am here 454")
              if(data.changedRows == 1){
                req.flash("success","Email Sent Successfully")
                res.render("pages/auth/verify-code",{flashMessage: Flash.getMessage(req),email})
              }else{
                res.status("Failed to to set verify code ! try to resend the code!")
              }
            }
          })
        }
      });
    } catch (e) {
      next(e);
    }
  }

  let email = req.params.email
  console.log(email)
  sendMail(email)
            .then((result) => console.log("Email sent:..." + result))
            .catch((error) => console.log(error));
}

exports.verifyController = async (req, res, next) => {
  let userEmail = req.body.email
  let verify_id = req.body.verify_id;
  console.log(userEmail,verify_id)

  if (verify_id < 1) {
    return res.sendStatus(500);
  }
  
  try {
    db.query("select * from users where email=? and verfication_id=? LIMIT 1",[userEmail,verify_id],(e,user)=>{
        if(e){
            next(e)
        }else if(user.length > 0){
            console.log(user[0])
            db.query("update users set verfication_id='-1', isVerified=1 where email = ?" ,[userEmail],(e,data)=>{
                if(e){
                    next(e)
                }
                else{
                  let token =  jwt.sign({
                    id:user[0].id,
                    username:user[0].username,
                    email:user[0].email
                  },process.env.JWT_SECRET_KEY,{expiresIn:'30d'})
      
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
            })
        }else{
          res.status(404).send("Invalid verification code! try again! ")
        }
    })

  } catch (e) {
    next(e);
  }
};


exports.changePasswordGetController = async (req,res,next) => {
  res.render("user/pages/change_password",{title:'Change Password',error: '',notMatched:false})
}

exports.changePasswordPostController = async (req,res,next) => {
  let {old_password,new_password1,new_password2} = req.body
  console.log(req.body)

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("user/pages/change_password", {
      title: "Change Password",
      error: errors.mapped(),
      notMatched:false
    });
  }

  try {
    if(new_password2 !== new_password1){
      return res.render("user/pages/change_password", {
        title: "Change Password",
        error: errors.mapped(),
        notMatched: "New Password and Confirm password is not matched"
      });
    }
    let hashPassword = await bcrypt.hash(new_password1, 11);
    bcrypt.compare(old_password, req.user.password, function (err, match) {
     
      if(err){
        return next(err)
      }
      else if(match === false){
        console.log("i am here")
        return res.render("user/pages/change_password", {
          title: "Change Password",
          error: errors.mapped(),
          notMatched: "Old password is not valid"
        });
      }else{
        db.query("update users set password = ? where id=?",[hashPassword,req.user.id],(e,data)=>{
          if(e){
            return next(e)
          }else{
            if(data.changedRows == 1){
              req.flash("success","Password Changed Succefully,Login Now!")
              req.session.destroy((err) => {
                if (err) {
                  return next(err);
                }
               res.clearCookie("token");
              res.redirect("/auth/login")
              res.end()
            });
            
            }else{
              res.status(200).send("Something went wrong, try again with valid information!")
            }
          }
        })
      }
    })
    
  } catch (error) {
    next(e)
  }
}

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
   res.clearCookie("token");
   res.redirect("/auth/login");
   res.end()
  });
};
