const router = require("express").Router()


const {
    isAuthenticated,checkAdmin
} = require('../middleware/authMiddleware')

const {packageGetController,packageBuyPostController} = require('../controllers/user/packageController')
const {isRef} = require("../middleware/mlm_middleware")



router.get("/buy",isAuthenticated,isRef,packageBuyPostController)

router.get("/",packageGetController)




module.exports = router