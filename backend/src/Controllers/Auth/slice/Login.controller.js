import { body, validationResult } from "express-validator";
import { User } from "../../../Models/user.model.js";
import { GenerateAccessTokenAndRefreshToken } from '../../../Utils/GenerateAccessTokenAndRefreshToken.js';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { UAParser } from 'ua-parser-js';
import { AccesstokenOption, RefreshtokenOption } from "../../../Utils/option.js";

// Validation for login fields
const LoginValidate = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email Formet'),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isString()
];

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Request received')

        await Promise.all(LoginValidate.map((validate) => validate.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                message: "missing Email or password! Please Check"
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credential"
            });
        }

        const verifypass = await user.checkpassword(password);
        if (!verifypass) {
            return res.status(429).json({
                message: "Invalid Credential"
            });
        };

        const { RefreshToken, AccessToken } = await GenerateAccessTokenAndRefreshToken(user._id);
        
        return res
            .cookie("RefreshToken", RefreshToken, RefreshtokenOption)
            .cookie("AccessToken", AccessToken, AccesstokenOption)
            .status(200).json({
                message: "Login Success",
                accessToken: AccessToken
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server Error"
        });
    }
};

export { Login };