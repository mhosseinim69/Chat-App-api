const User = require("../model/userModel.cjs");
const brcypt = require("bcrypt");


module.exports.register = async (req,res,next) => {
    try {
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "email already used", status: false });
        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    }   catch(ex) {
        next(ex);
    }
};

module.exports.login = async (req,res,next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: "Incorrect username or password", status: false });
        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect username or password", status: false });
        delete user.password;
        return res.json({ status: true, user });
    }   catch(ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req,res,next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    }   catch(ex) {
        next(ex);
    }
};

module.exports.status = async (req,res,next) => {
    try {  
        const {id, online} = req.body;
        const userData = await User.findByIdAndUpdate(id, {
            userOnline: online,
        });
        if (userData.userOnline) return res.json({ msg: "User is online." }); 
            return res.json({ msg: "User is offline." });
    }   catch(ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req,res,next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id }}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "userOnline",
        ]);
        return res.json(users);
    }   catch(ex) {
        next(ex);
    }
};