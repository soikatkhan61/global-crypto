const router = require("express").Router()


const {
    isAuthenticated
} = require('../middleware/authMiddleware')
const {isRef} = require("../middleware/mlm_middleware")

const {getReferGetController,getReferPostController,renderMyReferLink,myMemberGetController} = require('../controllers/user/mlm')
const {renderMyPackage,renderPkgPayment,pkgPaymentPostContrller} = require("../controllers/user/packageController")
const {dashboardGetController,renderUserSearch} = require("../controllers/user/dashboardController")
const {renderWithdraw,withdrawPostController,renderWithdrawHistory} = require("../controllers/user/withdrawController")

router.get("/get-refered",isAuthenticated,getReferGetController)
router.post("/get-refered",isAuthenticated,getReferPostController)

router.get("/my-member",isAuthenticated,myMemberGetController)

router.get("/my-refer-link",isAuthenticated,isRef,renderMyReferLink)

router.get("/my_package",isAuthenticated,renderMyPackage)
router.get("/pay/:pkg_id",isAuthenticated,renderPkgPayment)
router.post("/pay",isAuthenticated,pkgPaymentPostContrller)

router.get("/withdraw",isAuthenticated,renderWithdraw)
router.post("/withdraw",isAuthenticated,withdrawPostController)

router.get("/withdraw/history",isAuthenticated,renderWithdrawHistory)

router.get("/search",isAuthenticated,renderUserSearch)

router.get("/dashboard",isAuthenticated,dashboardGetController)




module.exports = router