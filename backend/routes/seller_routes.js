const express =require('express');
const [getMyProducts,addProducts] = require('../controllers/seller_controller');
const sellerRoutes = express.Router();

sellerRoutes.get('/home/:seller_id',getMyProducts);
sellerRoutes.post('/:seller_id/addProducts',addProducts)

module.exports = sellerRoutes;