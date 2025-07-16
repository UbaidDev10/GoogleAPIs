const mongoose = require('mongoose');

const API_Data_Schema = mongoose.Schema({
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        user: {
            type: String,
            required: true
        },
        xkey: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        req: {
            type: String,
            required: true
        },
        res: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true
        },

    },
    {
        timestamps: true
    }
);


const API_Data = mongoose.model('API_Data', API_Data_Schema);
module.exports = API_Data;