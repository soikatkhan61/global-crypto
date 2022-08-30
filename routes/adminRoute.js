const router = require("express").Router()

const {
    isUnAuthenticated,
    isAuthenticated,
    checkAdmin
} = require('../middleware/authMiddleware')

const {adminDashboardGetController,packageAnalysticGetController} = require('../controllers/admin/adminController')
const {adminPackageGetController,packageEditGetController,packageEditPostController,pkgApproveGet,pkgApprovPostConrtoller,viewUplineGetController,giveComission,backComission,pkgApproved} = require("../controllers/admin/adminPackageController")

const {renderWithdrawRequest,withdrawApproveController,renderWithdrawForm,renderUserWithdrawHistory} = require("../controllers/admin/withdraw/withdrawController")

const {profileSearchAndGetController} = require("../controllers/admin/user-profile/userProfileAnalysticController")


router.get("/packages",isAuthenticated,checkAdmin,adminPackageGetController)
router.get("/packages/analystic",isAuthenticated,checkAdmin,packageAnalysticGetController)

router.get("/packages/edit-package",isAuthenticated,checkAdmin,packageEditGetController)
router.post("/packages/edit-package",isAuthenticated,checkAdmin,packageEditPostController)


//router.get("/packages/approve/:payment_id",isAuthenticated,checkAdmin,pkgApprovPostConrtoller)
router.get("/packages/view-up-line",isAuthenticated,checkAdmin,viewUplineGetController)
router.get("/approve-pkg",isAuthenticated,checkAdmin,pkgApproved)
router.get("/packages/approve",isAuthenticated,checkAdmin,pkgApproveGet)

router.get("/give-comission",isAuthenticated,checkAdmin,giveComission)
router.get("/back-comission",isAuthenticated,checkAdmin,backComission)

router.get("/search-user-profile",isAuthenticated,checkAdmin,profileSearchAndGetController)


router.get("/withdraw-request",isAuthenticated,checkAdmin,renderWithdrawRequest)
router.get("/withdraw-request-view",isAuthenticated,checkAdmin,renderWithdrawForm)
router.post("/withdraw-approve",isAuthenticated,checkAdmin,withdrawApproveController)

router.get("/user-withdraw",isAuthenticated,checkAdmin,renderUserWithdrawHistory)

router.get("/",isAuthenticated,checkAdmin,adminDashboardGetController)

module.exports = router