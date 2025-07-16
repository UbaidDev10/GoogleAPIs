const express = require("express")
const router = express.Router()

const { User }  = require("../controllers/user")
const user = new User()

router.post("/userRegistration", user.userRegistration)


module.exports = router