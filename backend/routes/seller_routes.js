const express =require('express');
const [getMyProducts,addProducts] = require('../controllers/seller_controller');
const sellerRoutes = express.Router();

sellerRoutes.get('/seller-home/:seller_id',getMyProducts);
sellerRoutes.post('/seller-addProducts/:seller_id',addProducts)

module.exports = sellerRoutes;