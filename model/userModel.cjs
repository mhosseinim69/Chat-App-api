const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,  
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 3,   
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default:"",
    },
    userOnline: {
        type: Boolean,
        default: false,
    },

});

module.exports = mongoose.model("Users", userSchema);