import express from 'express';
import { auth } from '../Controllers/Auth/index.js';
import { Products } from '../Controllers/Product/index.js';
import { verifyJWT } from '../MIddlewares/Auth.js';
import { cart } from '../Controllers/Product/index.js';
import { Catogery } from '../Models/catogery.model.js';
import { user } from '../Controllers/user/index.js';
import { getMyOrders , cancelOrder , getOrderDetails } from '../Controllers/Product/slice/getOrderDetails.controller.js';

// initialize router
const router = express.Router();


router.post('/registration', auth.registration)
router.post('/verify-otp', auth.verifyOtp)
router.post('/login', auth.login)
router.get('/refreshtoken', auth.refreshToken)
router.get('/order/summary/:productid', verifyJWT , Products.orderSummary)
router.post('/order/place/single',verifyJWT, Products.buySingleProduct)
router.get('/product', Products.getProduct)
router.get('/product/:id', Products.getProductById)
router.post('/cart/product/add', verifyJWT, cart.addToCart);
router.get('/cart', verifyJWT, cart.getCart);
router.post('/cart/product/remove', verifyJWT, cart.removeFromCart);
router.post('/cart/product/checkout', verifyJWT, cart.checkoutCart);
router.get('/profile', verifyJWT ,user.getUserProfile);
router.put('/profile',verifyJWT, user.updateUserProfile);
router.put('/password', verifyJWT ,user.changePassword);
router.put('/address',verifyJWT , user.updateAddress);
router.get('/orders/my-orders', verifyJWT, getMyOrders);
router.get('/orders/:orderId', verifyJWT, getOrderDetails);
router.put('/orders/:orderId/cancel', verifyJWT, cancelOrder);
router.post('/logout', verifyJWT, async (req, res) => {
  try {
    const user = req.user;

    user.refreshtoken = '';
    await user.save({ validateBeforeSave: false });

    res
      .clearCookie("RefreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.cloudcoderhub.in',
        path: '/'
      })
      .clearCookie("AccessToken", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.cloudcoderhub.in',
        path: '/'
      })
      .status(200)
      .json({ message: "Logout Success" });

  } catch (error) {
    res.status(500).json({ error: "Internal server Error" });
  }
});
router.get('/catogeries', async (req, res) => {
    try {
        const response = await Catogery.find()

        let catogery = [];
        response.map((data) => catogery.push(data.catogery))

        return res.status(200).json({
            message: "Success",
            data: catogery
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})



export default router;