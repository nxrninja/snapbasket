import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import * as crypto from 'crypto';
import bcrypt from 'bcrypt'

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    refrestoken: {
        type: String,
    },
    address: {
        type: {
            type: String,
        },
        street: String,
        city: String,
        state: String,
        zip: String
    }

})


userschema.methods.checkpassword = async function (oldpassword) {
    const result1 = await bcrypt.compare(oldpassword, this.password);
    return result1;
};

userschema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userschema.methods.generateRefreshToken = async function () {

    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model('User', userschema)