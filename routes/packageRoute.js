const router = require("express").Router()


const {
    isAuthenticated,checkAdmin
} = require('../middleware/authMiddleware')

const {packageGetController,packageBuyPostController} = require('../controllers/user/packageController')




router.get("/buy",isAuthenticated,packageBuyPostController)

router.get("/",packageGetController)




module.exports = router