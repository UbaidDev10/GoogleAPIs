const dotenv = require("dotenv")
dotenv.config()

const config = {

    DBCONNECTION: process.env.DBCONNECTION,
    apiKey: process.env.APIKEY,
    key: process.env.X_KEY,
    host: process.env.HOST_URL,
    hostLive: "",
    imgUploads: process.env.IMAGE_UPLOAD_DIR,
    tokens: process.env.TOKENS,
    textModel: process.env.TEXTMODEL,
    textImgModel: process.env.TEXT_IMG_MODEL 

};

module.exports = config;