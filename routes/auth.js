const router = require("express").Router()

const signupValidator = require('../validator/auth/signupValidator')

const {
    signUpGetController,
    signUpPostController,
    loginGetController
} = require("../controllers/auth")

router.get("/sign-up",signUpGetController)
router.post("/sign-up",signupValidator,signUpPostController)

router.get("/login",loginGetController)
router.post("/login",loginGetController)


module.exports = router