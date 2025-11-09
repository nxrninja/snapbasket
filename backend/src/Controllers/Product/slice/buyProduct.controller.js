import { Product } from "../../../Models/product.model.js"
import {Order} from '../../../Models/order.model.js'


// In your backend routes
export const placeSingleOrder = async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;
    const paymentMethods = paymentMethod.toLowerCase()
    const product = await Product.findOne({ productid: productId });
    if (!product || !product.isavailable) {
      return res.status(404).json({ 
        success: false,
        message: "Product not available" 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    // Calculate final price
    const discountedPrice = product.price - (product.price * (product.discount / 100));
    const finalPrice = discountedPrice * quantity;

    const user = req.user;

    const shippingAddress = {
      name: user.fullname,
      email: user.email,
      addressLine: user.address.street,
      city: user.address.city,
      state: user.address.state,
      pincode: user.address.pincode,
      phone: 'NA'
    }

    const order = await Order.create({
      userId: req.user._id,
      products: [{
        productId: product._id,
        productName: product.productname,
        quantity: quantity,
        price: discountedPrice
      }],
      totalAmount: finalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethods || "cod",
      paymentStatus: paymentMethod === "cod" ? "pending" : "completed",
      status: "pending"
    });

    // Update product stock
    product.stock -= quantity;
    await product.save();

    if(product.stock <=0 ){
      product.isavailable = false
      await product.save();
    }

    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully", 
      orderId: order._id 
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      success: false,
      message: "Order failed", 
      error: error.message 
    });
  }
};