const router = require("express").Router()

const signupValidator = require('../validator/auth/signupValidator')

const {
    isUnAuthenticated,
    isAuthenticated
} = require('../middleware/authMiddleware')

const {
    signUpGetController,
    signUpPostController,
    loginGetController,
    loginPostController,
    verifyController,
    logoutController
} = require("../controllers/auth")

router.get("/sign-up",isUnAuthenticated,signUpGetController)
router.post("/sign-up",isUnAuthenticated,signupValidator,signUpPostController)

router.post("/verify/:email/:code",verifyController)


router.get("/login",isUnAuthenticated,loginGetController)
router.post("/login",isUnAuthenticated,loginPostController)

router.get("/logout",logoutController)




module.exports = router