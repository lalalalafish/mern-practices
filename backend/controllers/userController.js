const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../model/userModel');

//@desc Register a new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    //Check if user already exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        })
    }else{
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//@desc get user data
//@route GET /api/users/me
//@access Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);

    res.status(200).json({
        _id,
        name,
        email
    });
});

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

//@desc Authenticate a user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    //Check if user exists
    const user = await User.findOne({email});
    if(!user && !bcrypt.compare(password, user.password)){
        res.status(400);
        throw new Error("Invalid credentials");
    }else{
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
});


module.exports = {
    registerUser,
    getMe,
    loginUser
};