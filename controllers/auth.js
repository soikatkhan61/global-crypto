
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
    res.render('pages/auth/auth',{
        title:'Create a new account',
        error:{}, 
        value:{},
        signup_mode:false,
        flashMessage : Flash.getMessage(req)
    } )
}


exports.loginPostController = async (req,res,next) =>{
    let {email,password} = req.body
    
    let errors = validationResult(req).formatWith(errorFormatter)

    
    if(!errors.isEmpty()){
        req.flash('fail','Please check your form')
        return  res.render('pages/auth/auth',
        {
            title:'Login here!',
            error:errors.mapped(),
            signup_mode:false,
            value:{
                email
            },
            flashMessage : Flash.getMessage(req)

         })
    }

    try{
        let user = await User.findOne({email})
        if(!user){

            req.flash('fail','Wrong Credential')
            return  res.render('pages/auth/auth',
            {
                title:'Login here!',
                error:errors.mapped(),
                signup_mode:false,
                value:{
                    email
                },
                flashMessage : Flash.getMessage(req)
    
             })
        }

        let password_match = await bcrypt.compare(password, user.password)
        if(!password_match){

            req.flash('fail','Wrong Credential')
            return  res.render('pages/auth/auth',
            {
                title:'Login here!',
                error:errors.mapped(),
                signup_mode:false,
                value:{
                    email
                },
                flashMessage : Flash.getMessage(req)
    
             })
        }

        console.log(user)
        if(!user.isVerified){
            return  res.render('pages/auth/verify',
            {
                flashMessage : Flash.getMessage(req),
                user
            }
            )
        }
        // const token = jwt.sign({
        //     username: user.username,
        //     userId: user._id
        // },config.get('secret'),{expiresIn: '30d'})

        req.session.isLoggedIn = true
       // req.session.token = token
        req.session.user = user

        req.session.save(err=>{
            if(err){
                console.log(err)
                return next(err)
            }
            req.flash('success','Successfully Logged In')
            res.redirect('/')
        })
       
    }
    catch(e){
        next(e)
    }
}


exports.verifyController = async(req,res,next) =>{
   
    let userEmail = req.params.email
    let verify_id = req.params.code
    console.log(userEmail)
    console.log(verify_id)

    if(verify_id < 1){
        return res.sendStatus(500)
    }
    
    try{
        console.log('ami ekhane')
        let user = await User.findOneAndUpdate({email:userEmail,verification_id:verify_id},{isVerified:true,verification_id:-1})
        if(!user){
           return res.sendStatus(500)
        }
        return res.sendStatus(200)
    }catch(e){
        next(e)
    }
}



exports.logoutController = (req,res,next) =>{
   
    req.session.destroy(err =>{
        if(err){
            return next(err)
        }
        return res.redirect('/auth/login')
    })

   
}
