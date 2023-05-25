const { 
    register,
    login,
    setAvatar,   
    getAllUsers,
    status, 
} = require("../controllers/userController.cjs");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.post("/status", status);
module.exports = router;