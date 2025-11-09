// controllers/orderController.js
import mongoose from 'mongoose';
import { Order } from '../../../Models/order.model.js';
import { Product } from '../../../Models/product.model.js';


// Get all orders for a user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'productname images price productid')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      products: order.products.map(item => ({
        productId: item.productId?._id,
        productCode: item.productId?.productid,
        name: item.productId?.productname,
        image: item.productId?.images?.[0],
        price: item.price,
        quantity: item.quantity
      }))
    }));

    res.status(200).json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get single order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate if orderId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId)
      .populate('products.productId', 'productname images price productid description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const formattedOrder = {
      _id: order._id,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      products: order.products.map(item => ({
        productId: item.productId?._id,
        productCode: item.productId?.productid,
        name: item.productId?.productname,
        image: item.productId?.images?.[0],
        price: item.price,
        quantity: item.quantity,
        description: item.productId?.description
      }))
    };

    res.status(200).json({
      success: true,
      order: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock for each product
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock +=  item.quantity;
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};