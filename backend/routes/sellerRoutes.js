const express = require('express');
const router = express.Router();
const { sellerSignup, sellerLogin } = require('../controllers/sellerController');

router.post('/signupseller', sellerSignup);
router.post('/loginseller', sellerLogin);

module.exports = router;
