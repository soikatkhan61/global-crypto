const router = require("express").Router()


const {
    isAuthenticated
} = require('../middleware/authMiddleware')

const {taskGetController,taskPostController,createTaskController} = require('../controllers/user/taskController')


router.get("/create-task",isAuthenticated,createTaskController)
router.get("/complete",isAuthenticated,taskPostController)


router.get("/",isAuthenticated,taskGetController)


module.exports = router