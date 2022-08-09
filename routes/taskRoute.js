const router = require("express").Router()


const {
    isAuthenticated
} = require('../middleware/authMiddleware')

const {taskGetController,taskPostController,createTaskController} = require('../controllers/user/taskController')

router.get("/",isAuthenticated,taskGetController)
router.get("/create-task",isAuthenticated,createTaskController)
router.get("/complete",isAuthenticated,taskPostController)





module.exports = router