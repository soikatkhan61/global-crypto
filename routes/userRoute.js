const router = require("express").Router()


const {
    isUnAuthenticated,
    isAuthenticated
} = require('../middleware/authMiddleware')

const {getReferGetController,getReferPostController,dashboardGetController} = require('../controllers/user/mlm')
const {renderMyPackage,renderPkgPayment,pkgPaymentPostContrller} = require("../controllers/user/packageController")

const {renderWithdraw,withdrawPostController,renderWithdrawHistory} = require("../controllers/user/withdrawController")

router.get("/get-refered",isAuthenticated,getReferGetController)
router.post("/get-refered",isAuthenticated,getReferPostController)

router.get("/my_package",isAuthenticated,renderMyPackage)
router.get("/pay/:pkg_id",isAuthenticated,renderPkgPayment)
router.post("/pay",isAuthenticated,pkgPaymentPostContrller)

router.get("/withdraw",isAuthenticated,renderWithdraw)
router.post("/withdraw",isAuthenticated,withdrawPostController)

router.get("/withdraw/history",isAuthenticated,renderWithdrawHistory)

router.get("/dashboard",isAuthenticated,dashboardGetController)




module.exports = router