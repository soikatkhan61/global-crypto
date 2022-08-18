const router = require("express").Router()

const {
    isUnAuthenticated,
    isAuthenticated,
    checkAdmin
} = require('../middleware/authMiddleware')

const {adminDashboardGetController,packageAnalysticGetController} = require('../controllers/admin/adminController')
const {adminPackageGetController,packageEditGetController,packageEditPostController,pkgApproveGet} = require("../controllers/admin/adminPackageController")


router.get("/packages",isAuthenticated,checkAdmin,adminPackageGetController)
router.get("/packages/analystic",isAuthenticated,checkAdmin,packageAnalysticGetController)

router.get("/packages/edit-package",isAuthenticated,checkAdmin,packageEditGetController)
router.post("/packages/edit-package",isAuthenticated,checkAdmin,packageEditPostController)

router.get("/packages/approve",isAuthenticated,checkAdmin,pkgApproveGet)

router.get("/",isAuthenticated,checkAdmin,adminDashboardGetController)

module.exports = router