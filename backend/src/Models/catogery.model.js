import mongoose from "mongoose";

const catogeryschema = new mongoose.Schema({
    catogery: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })


const Catogery = mongoose.model("Catogery" , catogeryschema)
export {Catogery}