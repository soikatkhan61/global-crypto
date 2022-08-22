const {body} = require('express-validator')

module.exports = [
        body('old_password')
            .isLength({min:5,max:30})
            .withMessage("must be between 5 to 30 charecter")
            .trim(),

        body('new_password1')
            .isLength({min:5,max:30})
            .withMessage('must be between 5 to 30 charecter')
            .trim(),
    
        body('new_password2')
            .isLength({min:5,max:30})
            .withMessage('must be between 5 to 30 charecter')
            .trim()
    ]