import mongoose from "mongoose"

const productschema = new mongoose.Schema({
    productid: {
        type: String,
        required: true,
        unique: true
    },
    productname: {
        type: String,
        required: true
    },
    productdescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    images: {
        type: [String]
    },
    category: {
        type: String,
    },
    rating: {
        type: String,
        default: 0
    },
    review: {
        type: Number,
        default: 0
    },
    isavailable: {
        type: Boolean,

    },
    stock: {
        type: Number
    }
}, { timestamps: true })


const Product = mongoose.model('Product', productschema)

export {Product} 