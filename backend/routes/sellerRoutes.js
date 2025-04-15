const express = require('express');
const router = express.Router();

const { signupSeller, loginSeller } = require('../controllers/sellerController');

router.post('/signupseller', signupSeller);
router.post('/loginseller', loginSeller);

module.exports = router;
