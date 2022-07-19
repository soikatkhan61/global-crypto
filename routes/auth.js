const router = require("express").Router()

const {signUpGetController,logoutGetController} = require("../controllers/auth")

router.get("/sign-up",signUpGetController)
router.get("/logout",logoutGetController)

module.exports = router