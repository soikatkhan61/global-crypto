

const {body} = require('express-validator')
const User = require('../../models/User')

module.exports = [
        body('username')
            .isLength({min:2,max:15})
            .withMessage("Username must be between 2 to 15 char")
            .custom(async username =>{
                let user = await User.findOne({username})
                if(user){
                    return Promise.reject('User name already exists')
                } 
            }).trim(),
    
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .custom(async email =>{
                let emailExist = await User.findOne({email})
                if(emailExist){
                    return Promise.reject('email already used')
                } 
            }).normalizeEmail(),
    
        body('password')
            .isLength({min:5}).withMessage("Password must be greater than 5 char"),
        
        body('c_password')
            .custom((c_password,{req}) =>{
                if(c_password !== req.body.password){
                    throw new Error('Password dose not match!')
                }
                return true
            })
    ]