const mongoose = require("mongoose")
const config = require('../config/config')

const connectDB = async () => {
    const dbURL = config.DBCONNECTION

    mongoose
    .connect(dbURL)
    .then(() => {
        return true

    })
    .catch((err) => {
        console.log(err)
        return false
    })
}

module.exports = { connectDB } 