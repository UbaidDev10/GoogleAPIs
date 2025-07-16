const API_Data = require('../models/API_Data')
const User = require('../models/user')
class dbHandler{

    async saveData(user, key, model, req, res, images){

        const data = new API_Data({
            "user": user,
            "model": model,
            "xkey": key,
            "req": req,
            "res": res,
            "images": images
        })
        await data.save().then(() => {
            return true
        })
    }

    async createUser(email, key){

        const user = new User({
            email: email,
            xkey: key
        })
        await user.save().then(() => {
            return user
        })

    }

    async userExist(email){
        const user = await User.findOne({"email": email})

        if(user){

            return true

        }else{

            return false

        }
    }

    async getUser(email){

        const user = await User.findOne({"email": email})
        return user

    }
}

module.exports = { dbHandler }