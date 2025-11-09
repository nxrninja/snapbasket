import express from 'express';
import mongoose from 'mongoose';
import { Product } from '../Models/product.model.js';
import { Catogery } from '../Models/catogery.model.js';
import { Products } from '../Controllers/Product/index.js';

const router = express.Router();

// Utility to generate productid
const generateName = (length = 15) => {
  const chars = 'a1AbB2c3C4dDe5E6fFgGh7HiIjJk8KlLmMnNOoP9pQqRrSsTtUuVvWwXxYyZz0';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// POST /api/products
router.post('/product', async (req, res) => {
  try {
    const {
      productname,
      productdescription,
      price,
      discount,
      stock,
      category,
      images
    } = req.body;

    // Validate required fields
    if (!productname || !productdescription || !price || !discount || !category || !images?.length) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }


    if(discount >100){
        return res.status(400).json({
            message: "discount is not more than",discount
        })
    }


    const categoryExists = await Catogery.findOne({catogery: category});
    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    // Create product
    const newProduct = new Product({
      productid: generateName(),
      productname,
      productdescription,
      price,
      discount,
      stock: stock || 0,
      category: category,
      images,
      isavailable: true
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully.', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});


router.get('/catogery' , async (req,res) => {
    const response = await Catogery.find()

    let catogery = [];
    response.map((data) => catogery.push(data.catogery))

    return res.status(200).json({
        message: "Success",
        data: catogery
    })
})



export default router;