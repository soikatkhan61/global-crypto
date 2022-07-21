const router = require("express").Router()

const {pg} = require("../controllers/pg")

router.get("/",pg)


module.exports = router