const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path')
const multiparty = require('multiparty')
const config = require('../config/config');
const { dbHandler } = require('../dataLayer/dbHandler')
const dbService = new dbHandler()

class GoogleAPI{


    async textToText (req, res){

        try{

            const genAI = new GoogleGenerativeAI(config.apiKey);
    
            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: req.headers.model});
        
            // Getting prompt from body
            const prompt = req.body.prompt
        
            // Generating response against the given promp
            const result = await model.generateContent(prompt);
            const data = result.response.text();
    
            //console.log(data);
    
            // Saving data to the database
            await dbService.saveData(req.username, req.headers.xkey, req.headers.model, prompt, data, "")
    
            res.status(200).json({
                status: 200,
                data: data,
                success: true,
                error: ""
                
            })    

        }catch(error){

            res.status(400).json({
                status: 400,
                data: "",
                success: false,
                error: error
                
            })  
        }

    }

    
    async multiTurnConversation(req, res){

        try{

            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI(config.apiKey);

            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: req.headers.model});


            const chat = model.startChat({
                // sending chat history to the model 
                history: req.body.history,
                generationConfig: {
                    maxOutputTokens: config.tokens,
                },
            });

            // prompt for the new query
            const prompt = req.body.prompt;

            // getting respone from model
            const result = await chat.sendMessage(prompt);
            const data = result.response.text();

            // Saving data to the database
            await dbService.saveData(req.username, req.headers.xkey, req.headers.model, prompt, data, "")


            res.status(200).json({
                status: 200,
                data: data,
                success: true,
                error: ""
                
            }) 

        }catch(error){

            res.status(400).json({
                status: 400,
                data: "",
                success: false,
                error: error
                
            }) 
        }

    }

    async textImgToText (req, res){

        try{

            const { GoogleGenerativeAI } = require("@google/generative-ai");

            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI(config.apiKey);
    
            // path for saving the images
            const path_ = path.join(path.resolve(), config.imgUploads)
            let form = new multiparty.Form({
                autoFiles: true,
                uploadDir: path_,
            })
    
            var imageData = []
            var prompt_ = ""
            var img_ = []
    
            const myProcess = new Promise(function(resolve, reject){
                try{
    
                    form.parse(req, async function (error, fields, files) {
    
                        if (error){

                            res.status(400).json({
                                status: 400,
                                data: "",
                                success: false,
                                error: error
                                
                            }) 

                        } 
                
                        prompt_ = fields.prompt[0]
                        if (files.images) {
                            for (var img of files.images) {
                                const imagePath = img.path
                                const fileName = imagePath.slice(imagePath.lastIndexOf('/') + 1)
                                img_.push(
                                    process.env.NODE_ENV === 'production'
                                        ? `${config.hostLive}/images/` + fileName
                                        : `${config.host}/images/` + fileName
                                )
                            }
                        }
                        for (let img of files.images){
                            //console.log(img.headers)
                            const originalFilename = img.originalFilename;
                            // Split the filename by dot ('.') and take the last part
                            const parts = originalFilename.split('.');
                            const extension = parts[parts.length - 1];
                            const imgType = "image/" + extension
                            const data = await fileToGenerativePart(img.path, imgType)
                            //console.log(data)
                            imageData.push(data)
                            //console.log("ImagesData", imageData)

                        }
    
                        resolve("1")
                
                    })
    
                }catch(error){
                    reject(error)
    
                }
    
            })
    
            myProcess.then(async function(){
            
                // For text-and-image input (multimodal), use the gemini-pro-vision model
                const model = genAI.getGenerativeModel({ model: req.headers.model});

                
                // Text prompt that we will pass to the Google Model
                const prompt = prompt_
        
                // Image data that will pass to the Google Model
                const imageParts = imageData
                
                // Passing data to Google Model and getting response
                const result = await model.generateContent([prompt, ...imageParts]);
                const data = result.response.text();
    
                // Saving data into DB
                await dbService.saveData(req.username, req.headers.xkey, req.headers.model, prompt, data, img_)

    
                res.status(200).json({
                    status: 200,
                    data: data,
                    success: true,
                    error: ""
                    
                })

            }).catch(function(error){
                res.status(400).json({
                    status: 400,
                    data: "",
                    success: false,
                    error: error
                    
                })        
            })
    

        }catch(error){

            res.status(400).json({
                status: 400,
                data: "",
                success: false,
                error: error
                
            })    
        }

    }

    async embeddings(req, res){

        try{        
            
            const { GoogleGenerativeAI } = require("@google/generative-ai");

            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI(config.apiKey);

            // For embeddings, use the embedding-001 model
            const model = genAI.getGenerativeModel({ model: req.headers.model});

            const prompt = req.body.prompt
            
            const result = await model.embedContent(prompt);
            const embedding = result.embedding;
            const data = JSON.stringify(embedding.values)
            // Saving data into DB
            await dbService.saveData(req.username, req.headers.xkey, req.headers.model, prompt, data, "")

            res.status(200).json({
                status: 200,
                data: data,
                success: true,
                error: ""   
            })

            console.log(data);

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

// Converts local file information to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(path, mimeType) {

    const fs = require("fs");

    return {
        inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
        },
    };
    
}

module.exports = { GoogleAPI }
