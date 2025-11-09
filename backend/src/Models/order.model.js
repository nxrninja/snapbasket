import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    paymentMethod: String,
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed" , "completed"],
        default: "pending"
    },
    shippingAddress: {
        name: String,
        email: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
        phone: String
    },
    deliveryDate: Date,
    couponCode: String,
    discount: Number,
    notes: String
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema)