import { Product } from "../../../Models/product.model.js";
import mongoose from "mongoose";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const ALLOWED_SORT_FIELDS = ['price', 'rating', 'createdAt', 'discount', 'review', 'stock'];
const ALLOWED_PROJECTION_FIELDS = ['productname', 'price', 'category', 'discount', 'rating', 'review', 'stock', 'images', 'isavailable', 'createdAt'];

function parseNumber(value, defaultValue = undefined) {
  if (value === undefined || value === null || value === "") return defaultValue;
  const number = Number(value);
  return Number.isNaN(number) ? defaultValue : number;
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  const stringValue = String(value).toLowerCase();
  if (["true", "1", "yes", "y"].includes(stringValue)) return true;
  if (["false", "0", "no", "n"].includes(stringValue)) return false;
  return undefined;
}

function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[.$]/g, '');
}

function buildPriceConditions(query) {
  const conditions = {};
  const minPrice = parseNumber(query.minPrice);
  const maxPrice = parseNumber(query.maxPrice);
  
  if (minPrice !== undefined) conditions.$gte = minPrice;
  if (maxPrice !== undefined) conditions.$lte = maxPrice;

  const priceLt = parseNumber(query.price_lt);
  const priceLte = parseNumber(query.price_lte);
  const priceGt = parseNumber(query.price_gt);
  const priceGte = parseNumber(query.price_gte);
  
  if (priceLt !== undefined) conditions.$lt = priceLt;
  if (priceLte !== undefined) conditions.$lte = priceLte;
  if (priceGt !== undefined) conditions.$gt = priceGt;
  if (priceGte !== undefined) conditions.$gte = priceGte;

  return Object.keys(conditions).length ? conditions : null;
}

function buildDiscountConditions(query) {
  const conditions = {};
  const minDiscount = parseNumber(query.minDiscount);
  const maxDiscount = parseNumber(query.maxDiscount);
  
  if (minDiscount !== undefined) conditions.$gte = minDiscount;
  if (maxDiscount !== undefined) conditions.$lte = maxDiscount;

  const discountLt = parseNumber(query.discount_lt);
  const discountLte = parseNumber(query.discount_lte);
  const discountGt = parseNumber(query.discount_gt);
  const discountGte = parseNumber(query.discount_gte);
  
  if (discountLt !== undefined) conditions.$lt = discountLt;
  if (discountLte !== undefined) conditions.$lte = discountLte;
  if (discountGt !== undefined) conditions.$gt = discountGt;
  if (discountGte !== undefined) conditions.$gte = discountGte;

  return Object.keys(conditions).length ? conditions : null;
}

function buildSortObject(sortString) {
  const sortObject = {};
  if (!sortString) return { createdAt: -1 };

  const parts = String(sortString).split(",").map(part => part.trim()).filter(part => part);
  
  for (const part of parts) {
    const fieldName = part.startsWith("-") ? part.slice(1) : part;
    if (ALLOWED_SORT_FIELDS.includes(fieldName)) {
      sortObject[fieldName] = part.startsWith("-") ? -1 : 1;
    }
  }

  return Object.keys(sortObject).length ? sortObject : { createdAt: -1 };
}

function buildProjection(fieldsString) {
  const projection = { _id: 0 };
  if (!fieldsString) return projection;

  const fields = String(fieldsString).split(",").map(field => field.trim()).filter(field => field);
  
  for (const field of fields) {
    if (ALLOWED_PROJECTION_FIELDS.includes(field)) {
      projection[field] = 1;
    }
  }

  projection.productid = 1;
  return projection;
}

function buildTextSearchCondition(searchQuery) {
  if (!searchQuery) return null;
  const sanitizedQuery = sanitizeString(searchQuery);
  if (!sanitizedQuery) return null;

  return {
    $or: [
      { productname: { $regex: sanitizedQuery, $options: "i" } },
      { productdescription: { $regex: sanitizedQuery, $options: "i" } }
    ]
  };
}

function buildCategoryCondition(categoryParam) {
  if (!categoryParam) return null;
  
  const categories = String(categoryParam).split(",")
    .map(cat => sanitizeString(cat))
    .filter(cat => cat);
  
  return categories.length ? { category: { $in: categories } } : null;
}

function buildMatchConditions(query) {
  const match = {};

  const searchCondition = buildTextSearchCondition(query.q);
  if (searchCondition) {
    Object.assign(match, searchCondition);
  }

  const categoryCondition = buildCategoryCondition(query.categories || query.category);
  if (categoryCondition) {
    Object.assign(match, categoryCondition);
  }

  const priceCondition = buildPriceConditions(query);
  if (priceCondition) {
    match.price = priceCondition;
  }

  const discountCondition = buildDiscountConditions(query);
  if (discountCondition) {
    match.discount = discountCondition;
  }

  const minReview = parseNumber(query.minReview);
  const maxReview = parseNumber(query.maxReview);
  if (minReview !== undefined || maxReview !== undefined) {
    match.review = {};
    if (minReview !== undefined) match.review.$gte = minReview;
    if (maxReview !== undefined) match.review.$lte = maxReview;
  }

  const stockStatus = parseBoolean(query.inStock);
  if (stockStatus === true) match.stock = { $gt: 0 };
  else if (stockStatus === false) match.stock = { $lte: 0 };

  const availabilityStatus = parseBoolean(query.isavailable);
  if (availabilityStatus !== undefined) match.isavailable = availabilityStatus;

  const hasImagesStatus = parseBoolean(query.hasImages);
  if (hasImagesStatus === true) match.images = { $exists: true, $ne: [] };
  else if (hasImagesStatus === false) {
    match.$or = [
      { images: { $exists: false } },
      { images: { $size: 0 } }
    ];
  }

  const minRating = parseNumber(query.minRating);
  const maxRating = parseNumber(query.maxRating);
  if (minRating !== undefined || maxRating !== undefined) {
    const expressions = [];
    if (minRating !== undefined) expressions.push({ $gte: [{ $toDouble: "$rating" }, minRating] });
    if (maxRating !== undefined) expressions.push({ $lte: [{ $toDouble: "$rating" }, maxRating] });
    
    if (expressions.length === 1) {
      match.$expr = expressions[0];
    } else if (expressions.length > 1) {
      match.$expr = { $and: expressions };
    }
  }

  return match;
}

export async function getProducts(req, res) {
  try {
    const pageNum = Math.max(1, parseNumber(req.query.page, 1));
    const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseNumber(req.query.limit, DEFAULT_LIMIT)));
    const skip = (pageNum - 1) * limitNum;

    const matchConditions = buildMatchConditions(req.query);
    const sortObject = buildSortObject(req.query.sort);
    const projection = buildProjection(req.query.fields);

    const pipeline = [];

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push({ $sort: sortObject });

    const facet = {
      metadata: [{ $count: "total" }],
      data: [
        { $skip: skip },
        { $limit: limitNum }
      ]
    };

    if (Object.keys(projection).length > 1) {
      facet.data.unshift({ $project: projection });
    }

    pipeline.push({ $facet: facet });
    pipeline.push({ 
      $addFields: { 
        metadata: { $arrayElemAt: ["$metadata", 0] } 
      } 
    });

    const aggregationOptions = { allowDiskUse: true, maxTimeMS: 30000 };
    const result = await Product.aggregate(pipeline).option(aggregationOptions);
    
    const output = result[0] || { metadata: null, data: [] };
    const total = output.metadata?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      message: "Success",
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      data: output.data
    });

  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

export async function getProductById(req, res) {
  try {
    const productId = sanitizeString(req.params.id);
    if (!productId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    let product = await Product.findOne({ productid: productId }).lean().exec();
    
    if (!product && mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId).lean().exec();
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Success", data: product });

  } catch (error) {
    console.error("Get product by ID error:", error);
    return res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}