const router = require("express").Router()

const {profileGetController} = require("../controllers/user/profileController")

router.get("/:username",profileGetController)

module.exports = router