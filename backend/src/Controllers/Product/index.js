import { getProductById, getProducts } from "./slice/getProduct.controller.js";
import { getOrderSummary } from "./slice/orderSummary.controller.js";
import {placeSingleOrder} from '../../Controllers/Product/slice/buyProduct.controller.js'
import { addToCart, checkoutCart, getCart, removeFromCart } from "./slice/cart.controller.js";

export const Products = {
    getProduct: getProducts,
    getProductById: getProductById,
    orderSummary: getOrderSummary,
    buySingleProduct: placeSingleOrder 
}

export const cart = {
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    checkoutCart: checkoutCart,
    getCart: getCart
}