const router = require("express").Router()

const {
    isUnAuthenticated,
    isAuthenticated,
    checkAdmin
} = require('../middleware/authMiddleware')

const {adminDashboardGetController,packageAnalysticGetController} = require('../controllers/admin/adminController')
const {adminPackageGetController,packageEditGetController,packageEditPostController,pkgApproveGet,pkgApprovPostConrtoller} = require("../controllers/admin/adminPackageController")

const {renderWithdrawRequest,withdrawApproveController} = require("../controllers/admin/withdraw/withdrawController")


router.get("/packages",isAuthenticated,checkAdmin,adminPackageGetController)
router.get("/packages/analystic",isAuthenticated,checkAdmin,packageAnalysticGetController)

router.get("/packages/edit-package",isAuthenticated,checkAdmin,packageEditGetController)
router.post("/packages/edit-package",isAuthenticated,checkAdmin,packageEditPostController)

router.get("/packages/approve",isAuthenticated,checkAdmin,pkgApproveGet)
router.get("/packages/approve/:payment_id",isAuthenticated,checkAdmin,pkgApprovPostConrtoller)


router.get("/withdraw-request",isAuthenticated,checkAdmin,renderWithdrawRequest)
router.get("/withdraw-approve/:id",isAuthenticated,checkAdmin,withdrawApproveController)

router.get("/",isAuthenticated,checkAdmin,adminDashboardGetController)

module.exports = router