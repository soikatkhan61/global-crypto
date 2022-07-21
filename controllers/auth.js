
const  bcrypt = require('bcrypt')
const  jwt = require('jsonwebtoken')
const  config = require('config')
const  User = require('../models/User')
const  {validationResult} = require('express-validator')
const  errorFormatter = require('../utils/validationErrorFormatter')
const  Flash = require('../utils/Flash')
const nodemailer = require('nodemailer')
const {google} = require('googleapis')



const CLIENT_ID = '873050750632-17hqhok367sbk53lemik57e2m241ovmc.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//049CiXWOjG8C6CgYIARAAGAQSNwF-L9IrKHVyCBR4RrXwav1M7UVLz2NgMG_baNiD7--cuRQWtKzNzPzATsKcP0tuH8fdaGQwsAQ'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})


exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/auth',{
        title:'Create a new account',
        error:{}, 
        value:{},
        signup_mode:true,
        flashMessage : Flash.getMessage(req)
    } )
}

exports.signUpPostController = async (req, res, next) => {
    let { username, email, password, c_password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors)

    if (!errors.isEmpty()) {
        console.log("error khaicho ")
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/auth', {
            title: 'Create a new account',
            error: errors.mapped(),
            value: {
                username, email, password
            },
            signup_mode: true,
            flashMessage: Flash.getMessage(req)
        })
    }


    try {
        console.log("error kaj korena ")
        let hashPassword = await bcrypt.hash(password, 11)
        let user = new User({
            username,
            email,
            password: hashPassword,
        })
        let createdUser = await user.save()
        req.flash('success', 'User created successfully')

        let v_id = await User.findByIdAndUpdate({ _id: createdUser._id }, { verification_id: Math.floor(Math.random() * (99999999 - 11111111 + 1) + 11111111) }, { new: true })

        v_id = v_id.verification_id

        async function sendMail() {

            try {
                const accessToken = await oAuth2Client.getAccessToken()
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'dev.soikathossain@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: 'codeDocz <codedoczbox@gamil.com>',
                    to: `${createdUser.email}`,
                    subject: 'Please verify your account!',
                    html: `
                        <div>
                            <p>your verification code is:  
                            </p>
                            <h1> ${v_id} </h1>
                        </div>
                    `
                }

                await transport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.render('pages/auth/verify', {
                            user,
                            flashMessage: Flash.getMessage(req)
                        })
                        console.log('email sent: ' + info.response)
                    }
                })

            } catch (e) {
                next(e)
            }
        }

        sendMail().then(result => console.log("Email sent:..." + result))
            .catch(error => console.log(error))

    }
    catch (e) {
        next(e)
    }
}


exports.loginGetController = (req, res, next) => {
    res.render("pages/auth", { signupMode: false, msg: "" })
}