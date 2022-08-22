const router = require("express").Router()

const signupValidator = require('../validator/auth/signupValidator')
const changePasswordValidator = require('../validator/auth/changePasswordValidator')

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
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require("../controllers/auth")



router.get("/sign-up",isUnAuthenticated,signUpGetController)
router.post("/sign-up",isUnAuthenticated,signupValidator,signUpPostController)

router.post("/verify",verifyController)


router.get("/login",isUnAuthenticated,loginGetController)
router.post("/login",isUnAuthenticated,loginPostController)

router.get("/change-password",isAuthenticated,changePasswordGetController)
router.post("/change-password",isAuthenticated,changePasswordValidator,changePasswordPostController)

router.get("/logout",logoutController)




module.exports = router