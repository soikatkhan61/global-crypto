const router = require("express").Router()


const {
    isUnAuthenticated,
    isAuthenticated
} = require('../middleware/authMiddleware')

const {getReferGetController,getReferPostController,dashboardGetController} = require('../controllers/user/mlm')

router.get("/get-refered",isAuthenticated,getReferGetController)
router.post("/get-refered",isAuthenticated,getReferPostController)


router.get("/dashboard",isAuthenticated,dashboardGetController)




module.exports = router