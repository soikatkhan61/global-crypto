const {body} = require('express-validator')

module.exports = [
        body('username')
            .isLength({min:2,max:50})
            .withMessage("Username must be between 2 to 15 char")
            .trim(),
    
        body('email')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
    
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