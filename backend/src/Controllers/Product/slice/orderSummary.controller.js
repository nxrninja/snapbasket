import { Product } from "../../../Models/product.model.js";
import {User}  from '../../../Models/user.model.js'



export const getOrderSummary = async (req, res) => {
  try {
    const product = await Product.findOne({ productid: req.params.productid });
    if (!product || !product.isavailable) {
      return res.status(404).json({ message: "Product not available" });
    }

     const user = await User.findById(req.user._id);

     console.log(user.address)
    console.log(product)

    res.status(200).json({
      product: {
        productid: product.productid,
        name: product.productname,
        price: product.price,
        discount: product.discount,
        image: product.images[0],
        stock: product.stock
      },
       
       address: user.address || null
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};