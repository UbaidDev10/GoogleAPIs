const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        email: {
            type: String,
            required: true,
            unique: true,

        },
        xkey: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true
    }
);


const User = mongoose.model('User', userSchema);
module.exports = User;