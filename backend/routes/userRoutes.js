const express = require('express');
const router = express.Router();

const { signupUser, loginUser } = require('../controllers/userController');

router.post('/signupuser', signupUser);
router.post('/loginuser', loginUser);

module.exports = router;