const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
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


    let v_id = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
    db.query(
      "use treders_bd;insert into users values(?,?,?,?,?,?,?,?,?,?,?)",
      [
        null,
        "user",
        username,
        email,
        hashPassword,
        0,
        v_id,
        "/uploads/soikat.jpg",
        null,
        0,
        500
      ],
      (e, user) => {
        if (e) {
          next(e)
        } else {
          req.flash("success", "User created successfully");
          async function sendMail() {
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
                from: "codeDocz <codedoczbox@gamil.com>",
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
                if (error) {
                  next(e)
                } else {
                  res.render("pages/auth/verify", {
                    title: "Verify your account",
                    user:user[0],
                    flashMessage: Flash.getMessage(req),
                  });
                  console.log("email sent: " + info.response);
                }
              });
            } catch (e) {
              next(e);
            }
          }

          sendMail()
            .then((result) => console.log("Email sent:..." + result))
            .catch((error) => console.log(error));
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
      console.log(data.length)
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
              return res.render("pages/auth/verify", {
                title: "Verify you account",
                flashMessage: Flash.getMessage(req),
                user:data[0],
              });
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
              res.redirect("/");
            });
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

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
                    req.flash("success", "Successfully Logged In");
                    res.redirect("/");
                  });
                }
            })
        }
    })

  } catch (e) {
    next(e);
  }
};

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
