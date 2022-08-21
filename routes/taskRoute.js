const router = require("express").Router()


const {
    isAuthenticated
} = require('../middleware/authMiddleware')

const {taskGetController,taskPostController,createTaskController} = require('../controllers/user/taskController')
const {isRef} = require("../middleware/mlm_middleware")

router.get("/create-task",isAuthenticated,createTaskController)
router.get("/complete",isAuthenticated,isRef,taskPostController)


router.get("/",isAuthenticated,taskGetController)


module.exports = router