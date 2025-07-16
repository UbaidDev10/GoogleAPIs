const config = require('./config/config.js');
const express = require("express")
const mongoose = require("mongoose")
var cors = require("cors")
const { connectDB } = require('./config/db.js')


const app = express()
app.use(cors())
app.use("/images", express.static("./uploads/images"))
app.use(express.json())


mongoose.set("strictQuery", false)

app.get('/', (req, res) => {

    return res.send("Welcome From GoogleAPI Node Server!")

})



if(connectDB()){
    app.listen(3000)     
    console.log("Listening to port 3000 and database is connected!")
}

// app.use("/api/users", require("./routes/usersRoutes"))
// app.use("/api/admins", require("./routes/adminRoutes"))
app.use("/api/googleAPIs", require("./routes/googleAPIs"))
app.use("/api/user", require("./routes/user.js"))

