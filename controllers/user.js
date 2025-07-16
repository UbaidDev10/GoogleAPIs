const { dbHandler } = require('../dataLayer/dbHandler')
const dbService = new dbHandler()

class User{

    async userRegistration(req, res) {

        try{

            const {email} = req.body
                if(!(await dbService.userExist(email))){

                    let apiKey = Buffer.from(email).toString('base64')
                    await dbService.createUser(email, apiKey)

                    res.status(200).json({
                        status: 200,
                        data: {
                            email,
                            apiKey
                        },
                        success: true,
                        error: ""
                        
                    })   


                }else{

                    res.status(400).json({
                        status: 400,
                        data: "",
                        success: false,
                        error: "User already Exit!"
                        
                    })         
                }

        }catch(error){

            res.status(400).json({
                status: 400,
                data: "",
                success: false,
                error: error
            
            })
        }
    }
        

}

module.exports = { User }