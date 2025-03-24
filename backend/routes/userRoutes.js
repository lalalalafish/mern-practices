const express = require('express');
const router = express.Router();
const {registerUser, getMe, loginUser} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.get('/me', protect, getMe);
router.route('/login').post(loginUser);

module.exports = router;
