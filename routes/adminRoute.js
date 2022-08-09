const router = require("express").Router()

const {
    isUnAuthenticated,
    isAuthenticated,
    checkAdmin
} = require('../middleware/authMiddleware')

const {adminDashboardGetController} = require('../controllers/admin/adminController')
const {adminPackageGetController,packageEditPostController} = require("../controllers/admin/adminPackageController")


router.get("/packages",isAuthenticated,checkAdmin,adminPackageGetController)

router.get("/",isAuthenticated,checkAdmin,adminDashboardGetController)
router.get("/packages/edit",isAuthenticated,checkAdmin,packageEditPostController)





module.exports = router