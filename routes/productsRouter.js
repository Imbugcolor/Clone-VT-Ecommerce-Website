const router = require('express').Router()
const productsCtrl = require('../controllers/productsCtrl')
const auth = require('../middleware/auth')

router.route('/products')
    .get(productsCtrl.getProducts)
    .post(productsCtrl.createProduct)

router.route('/products/:id')
    .delete(productsCtrl.deleteProduct)
    .put(productsCtrl.updateProduct)

router.route('/products/:id/review')
    .post(auth, productsCtrl.createReview)

module.exports = router