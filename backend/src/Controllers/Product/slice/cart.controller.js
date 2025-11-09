import { Cart } from '../../../Models/cart.model.js';
import { Product } from '../../../Models/product.model.js';
import { Order } from '../../../Models/order.model.js';

export const getCart = async (req, res) => {
  console.log('getCart hit')
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  console.log(cart)
  res.json(cart || { items: [] });
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ productid: productId });
    console.log(product)
  
    if (!product) return res.status(404).json({ message: 'Product not found' });
  
    const price = product.price - product.discount;
    let cart = await Cart.findOne({ userId: req.user._id });
  
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
  
    const existing = cart.items.find(item => item.productId.equals(product._id));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId: product._id, quantity, price });
    }
  
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Internal server Error"
    })
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findOne({ productid: productId });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => !item.productId.equals(product._id));
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  await cart.save();
  res.json(cart);
};

export const checkoutCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const order = new Order({
    userId: req.user._id,
    products: cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: cart.totalAmount,
    paymentMethod: 'COD',
    paymentStatus: 'pending',
    status: 'pending',
    discount: cart.discount || 0,
    couponCode: cart.couponCode || null,
    shippingAddress: req.body.shippingAddress
  });

  await order.save();
  await Cart.deleteOne({ _id: cart._id });

  res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
};