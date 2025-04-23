const express = require('express');
const router = express.Router();
const { 
    addProduct,
    getProductsBySeller,
    updateProductRating
} = require('../controllers/productController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/addproduct', upload.single('image'), addProduct);
router.get('/sellerproducts/:sellerName', getProductsBySeller);
router.put('/updaterating/:productId', updateProductRating);

module.exports = router;