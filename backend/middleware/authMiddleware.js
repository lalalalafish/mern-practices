const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const protect = asyncHandler(async (req, res, next) => {
   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];//Bearer token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }catch (err){
            console.error(err);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
   }
   if(!token){
       res.status(401);
       throw new Error('Not authorized, no token');
   }

});

module.exports = {protect};