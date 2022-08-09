const router = require("express").Router()


const {
    isAuthenticated,checkAdmin
} = require('../middleware/authMiddleware')

const {packageGetController,packageBuyPostController} = require('../controllers/user/packageController')


router.get("/",packageGetController)

router.get("/buy",isAuthenticated,packageBuyPostController)






module.exports = router