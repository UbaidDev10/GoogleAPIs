const { extname } = require('path');
const config = require('../config/config')
const { dbHandler } = require('../dataLayer/dbHandler');
const { emitWarning } = require('process');
const dbService = new dbHandler()

const basicAuth = async (req, res, next) => {
    
    // Check if Authorization header is present
    if (req.headers.authorization && req.headers.authorization.startsWith('Basic ')) {
        
        // Decode and extract username and password from Authorization header
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Attach username and password to request object
        req.username = username;
        req.password = password;

        const user = await dbService.getUser(username)

        if(req.headers.xkey === user.xkey){

            next(); // Move to the next middleware

        }else{

            // No Authorization key present
            res.status(401).json({
                status: 401,
                data: "",
                success: false,
                error: "Unauthorized"
                
            })  

        }

    }
    else{
        // No Authorization key present
        res.status(401).json({
            status: 401,
            data: "",
            success: false,
            error: "Unauthorized"
            
        })          
    }

};

module.exports = { basicAuth }
