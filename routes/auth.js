const router = require("express").Router()

const {signUpGetController,loginGetController} = require("../controllers/auth")

router.get("/sign-up",signUpGetController)
router.post("/sign-up",signUpGetController)

router.get("/login",loginGetController)
router.post("/login",loginGetController)


module.exports = router