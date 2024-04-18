// User routes
const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
// const { verifyToken } = require('../middleware/auth');

//router.post('/api/register', userControllers.registerUser);
router.post("/login", userControllers.loginUser);
//router.get('/api/users', verifyToken, userControllers.getUsers);

module.exports = router;
